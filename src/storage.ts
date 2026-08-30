import type { ActiveRoute, Attempt } from "./models";
import { isActiveRoute, isAttempt } from "./models";

const DB_NAME = "arithmetic-steps";
const DB_VERSION = 1;
const ATTEMPTS = "attempts";
const SETTINGS = "settings";
const ACTIVE_ROUTE = "active-route";

/**
 * Demo work must never share the learner's IndexedDB database. Keeping this
 * switch in the persistence module means every existing save/load call uses
 * the selected namespace, rather than relying on individual callers to
 * remember a demo flag.
 */
let storageMode: "real" | "demo" = "real";

export function setStorageMode(mode: "real" | "demo"): void {
  storageMode = mode;
}

export function storageDatabaseName(): string {
  return storageMode === "demo" ? `demo:${DB_NAME}` : DB_NAME;
}

function activeCheckpointKey(): string {
  return `${storageDatabaseName()}:${ACTIVE_ROUTE}`;
}

type ActiveCheckpoint = {
  schemaVersion: 1;
  route: ActiveRoute | null;
};

function saveCheckpoint(route: ActiveRoute | null): boolean {
  try {
    const checkpoint: ActiveCheckpoint = { schemaVersion: 1, route: structuredClone(route) };
    localStorage.setItem(activeCheckpointKey(), JSON.stringify(checkpoint));
    return true;
  } catch {
    return false;
  }
}

function loadCheckpoint(): { found: boolean; route: ActiveRoute | null } {
  const key = activeCheckpointKey();
  const stored = localStorage.getItem(key);
  if (stored === null) return { found: false, route: null };
  try {
    const checkpoint = JSON.parse(stored) as Partial<ActiveCheckpoint>;
    if (checkpoint.schemaVersion === 1 && (checkpoint.route === null || isActiveRoute(checkpoint.route))) {
      return { found: true, route: checkpoint.route ?? null };
    }
  } catch {
    // A malformed checkpoint must not hide the valid IndexedDB copy below.
  }
  localStorage.removeItem(key);
  return { found: false, route: null };
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(storageDatabaseName(), DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ATTEMPTS)) db.createObjectStore(ATTEMPTS, { keyPath: "id" });
      if (!db.objectStoreNames.contains(SETTINGS)) db.createObjectStore(SETTINGS, { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Local storage could not be opened."));
  });
}

/** Remove only the currently selected namespace. Used when resetting/leaving
 * the sample activity; it can never delete a learner's real saved routes. */
export async function resetCurrentStorage(): Promise<void> {
  const name = storageDatabaseName();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error("The sample problems could not be reset."));
    request.onblocked = () => reject(new Error("Close other Arithmetic Steps tabs, then reset the sample again."));
  });
  localStorage.removeItem(activeCheckpointKey());
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("The local change could not be saved."));
    transaction.onabort = () => reject(transaction.error ?? new Error("The local change was cancelled."));
  });
}

export async function saveAttempt(attempt: Attempt): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction([ATTEMPTS, SETTINGS], "readwrite");
  transaction.objectStore(ATTEMPTS).put(attempt);
  transaction.objectStore(SETTINGS).delete(ACTIVE_ROUTE);
  await transactionDone(transaction);
  db.close();
  saveCheckpoint(null);
}

export async function saveActive(route: ActiveRoute): Promise<void> {
  // The local checkpoint is synchronous. It makes a just-completed move safe
  // if the page refreshes while IndexedDB is busy, and lets the UI respond
  // without waiting for a storage transaction under mobile contention.
  const checkpointSaved = saveCheckpoint(route);
  let db: IDBDatabase | null = null;
  try {
    db = await openDatabase();
    const transaction = db.transaction(SETTINGS, "readwrite");
    transaction.objectStore(SETTINGS).put({ key: ACTIVE_ROUTE, value: route });
    await transactionDone(transaction);
  } catch (error) {
    if (!checkpointSaved) throw error;
  } finally {
    db?.close();
  }
}

export async function loadActive(): Promise<ActiveRoute | null> {
  const checkpoint = loadCheckpoint();
  if (checkpoint.found) return checkpoint.route;
  const db = await openDatabase();
  const value = await new Promise<{ key: string; value: ActiveRoute } | undefined>((resolve, reject) => {
    const request = db.transaction(SETTINGS).objectStore(SETTINGS).get(ACTIVE_ROUTE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return value?.value ?? null;
}

export async function clearActive(): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction(SETTINGS, "readwrite");
  transaction.objectStore(SETTINGS).delete(ACTIVE_ROUTE);
  await transactionDone(transaction);
  db.close();
  saveCheckpoint(null);
}

export async function listAttempts(): Promise<Attempt[]> {
  const db = await openDatabase();
  const values = await new Promise<Attempt[]>((resolve, reject) => {
    const request = db.transaction(ATTEMPTS).objectStore(ATTEMPTS).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return values.filter(isAttempt).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function importAttempts(values: unknown[]): Promise<number> {
  const attempts = values.filter(isAttempt);
  if (attempts.length === 0) throw new Error("That file does not contain any valid Arithmetic Steps problems.");
  const db = await openDatabase();
  const transaction = db.transaction(ATTEMPTS, "readwrite");
  const store = transaction.objectStore(ATTEMPTS);
  attempts.forEach((attempt) => store.put(attempt));
  await transactionDone(transaction);
  db.close();
  return attempts.length;
}

export async function clearAttempts(): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction(ATTEMPTS, "readwrite");
  transaction.objectStore(ATTEMPTS).clear();
  await transactionDone(transaction);
  db.close();
}
