import type { ActiveRoute, Attempt } from "./models";
import { isAttempt } from "./models";

const DB_NAME = "arithmetic-steps";
const DB_VERSION = 1;
const ATTEMPTS = "attempts";
const SETTINGS = "settings";

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
  transaction.objectStore(SETTINGS).delete("active-route");
  await transactionDone(transaction);
  db.close();
}

export async function saveActive(route: ActiveRoute): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction(SETTINGS, "readwrite");
  transaction.objectStore(SETTINGS).put({ key: "active-route", value: route });
  await transactionDone(transaction);
  db.close();
}

export async function loadActive(): Promise<ActiveRoute | null> {
  const db = await openDatabase();
  const value = await new Promise<{ key: string; value: ActiveRoute } | undefined>((resolve, reject) => {
    const request = db.transaction(SETTINGS).objectStore(SETTINGS).get("active-route");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return value?.value ?? null;
}

export async function clearActive(): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction(SETTINGS, "readwrite");
  transaction.objectStore(SETTINGS).delete("active-route");
  await transactionDone(transaction);
  db.close();
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
