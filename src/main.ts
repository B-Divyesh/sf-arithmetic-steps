import "./styles.css";
import {
  additionSuggestions,
  canFinish,
  createRoute,
  currentFrame,
  finishRoute,
  moveAddition,
  subtractChunk,
  subtractionSuggestions,
  validateProblem,
  type ActiveRoute,
  type Attempt,
  type MoveDirection,
  type MoveReason,
  type Operation,
  type RouteFrame
} from "./models";
import {
  clearActive,
  clearAttempts,
  importAttempts,
  listAttempts,
  loadActive,
  resetCurrentStorage,
  saveActive,
  saveAttempt,
  setStorageMode
} from "./storage";

function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`The page shell is missing ${selector}.`);
  return element;
}

const app = requiredElement<HTMLDivElement>("#app");
const toast = requiredElement<HTMLDivElement>("#toast");
const networkBanner = requiredElement<HTMLDivElement>("#network-banner");
const demoBanner = requiredElement<HTMLDivElement>("#demo-banner");

function urlIsDemo(url: URL): boolean {
  return url.pathname === "/demo" || url.searchParams.get("demo") === "1";
}

function locationIsDemo(): boolean {
  return urlIsDemo(new URL(location.href));
}

type View = "setup" | "work" | "complete" | "history";

const state: {
  view: View;
  operation: Operation;
  first: number;
  second: number;
  route: ActiveRoute | null;
  direction: MoveDirection;
  amount: number;
  reason: MoveReason;
  error: string;
  replayIndex: number;
  replayTimer: number | null;
  confirmingClear: boolean;
  isDemo: boolean;
} = {
  view: "setup",
  operation: "add",
  first: 8,
  second: 7,
  route: null,
  direction: "right-to-left",
  amount: 2,
  reason: "make-ten",
  error: "",
  replayIndex: 0,
  replayTimer: null,
  confirmingClear: false,
  isDemo: locationIsDemo()
};

if (state.isDemo) setStorageMode("demo");

function updateDemoBanner(): void {
  demoBanner.hidden = !state.isDemo;
  document.title = state.isDemo
    ? "Demo — Arithmetic Steps"
    : "Arithmetic Steps — Explore addition and subtraction";
}

function sampleRoute(): ActiveRoute {
  const route = createRoute("subtract", 52, 18);
  subtractChunk(route, 10, "split");
  return route;
}

async function seedDemoRoute(reset = false): Promise<void> {
  setStorageMode("demo");
  if (reset) await resetCurrentStorage();
  state.operation = "subtract";
  state.first = 52;
  state.second = 18;
  state.route = sampleRoute();
  state.direction = "right-to-left";
  state.amount = 8;
  state.reason = "make-ten";
  state.error = "";
  state.replayIndex = 0;
  state.view = "work";
  await safelySaveActive();
}

async function enterDemo(pushLocation = true): Promise<void> {
  stopReplay();
  state.isDemo = true;
  await seedDemoRoute(true);
  if (pushLocation) history.pushState(null, "", "/demo");
  updateDemoBanner();
  render();
  document.querySelector<HTMLHeadingElement>("#page-title")?.focus();
}

async function resetDemo(): Promise<void> {
  stopReplay();
  await seedDemoRoute(true);
  updateDemoBanner();
  render();
  showToast("The 52 − 18 sample route is ready again.");
  document.querySelector<HTMLHeadingElement>("#page-title")?.focus();
}

/**
 * Demo storage is disposable by design. Always restore the real namespace,
 * including when IndexedDB reports a blocked deletion, so a failed cleanup
 * can never route later work into the demo database.
 */
async function discardDemoStorage(): Promise<void> {
  setStorageMode("demo");
  try {
    await resetCurrentStorage();
  } finally {
    setStorageMode("real");
  }
}

async function leaveDemo(replaceLocation = true): Promise<void> {
  stopReplay();
  try {
    await discardDemoStorage();
  } catch {
    showToast("The sample could not be cleared. Close other Arithmetic Steps tabs, then try again.");
    return;
  }
  state.isDemo = false;
  state.view = "setup";
  state.route = null;
  state.operation = "add";
  state.first = 8;
  state.second = 7;
  state.error = "";
  if (replaceLocation) history.replaceState(null, "", "/#learn");
  updateDemoBanner();
  render();
  document.querySelector<HTMLHeadingElement>("#page-title")?.focus();
}

async function navigateAwayFromDemo(destination: URL): Promise<void> {
  try {
    await discardDemoStorage();
    window.location.assign(destination.href);
  } catch {
    showToast("The sample could not be cleared. Close other Arithmetic Steps tabs, then try again.");
  }
}

const escapeHtml = (value: string | number) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function showToast(message: string, action?: { label: string; run: () => void }): void {
  toast.innerHTML = `<span>${escapeHtml(message)}</span>${action ? `<button type="button" id="toast-action">${escapeHtml(action.label)}</button>` : ""}`;
  toast.hidden = false;
  document.querySelector<HTMLButtonElement>("#toast-action")?.addEventListener("click", action?.run ?? (() => undefined));
  window.setTimeout(() => { toast.hidden = true; }, action ? 12000 : 4000);
}

function reasonLabel(reason: MoveReason): string {
  if (reason === "make-ten") return "Land on a friendly ten";
  if (reason === "split") return "Split into easier parts";
  return "Try my own route";
}

function equationLabel(route: Pick<Attempt, "first" | "second" | "operation">): string {
  return `${route.first} ${route.operation === "add" ? "+" : "−"} ${route.second}`;
}

function quantity(value: number, label: string, tone: "coral" | "brass" | "teal" = "coral"): string {
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  const bars = Array.from({ length: tens }, () => `<span class="ten-bar" aria-hidden="true">${"<i></i>".repeat(10)}</span>`).join("");
  const dots = Array.from({ length: ones }, () => `<span class="one-counter" aria-hidden="true"></span>`).join("");
  return `<div class="quantity quantity--${tone}" role="img" aria-label="${escapeHtml(label)}: ${value}, shown as ${tens} tens and ${ones} ones">
    <div class="quantity-heading"><span>${escapeHtml(label)}</span><strong>${value}</strong></div>
    <div class="blocks">${bars}${dots}${value === 0 ? `<span class="zero-marker" aria-hidden="true">0</span>` : ""}</div>
    <small>${tens} ${tens === 1 ? "ten" : "tens"} + ${ones} ${ones === 1 ? "one" : "ones"}</small>
  </div>`;
}

function setupTemplate(): string {
  const op = state.operation;
  const firstLabel = op === "add" ? "First number" : "Start at";
  const secondLabel = op === "add" ? "Second number" : "Take away";
  return `<section class="hero" aria-labelledby="page-title">
    <div class="hero-copy">
      <p class="eyebrow"><span>Line A</span> Addition and subtraction to 100</p>
      <h1 id="page-title" tabindex="-1">Explore addition and subtraction steps</h1>
      <p class="lede">For elementary children with a teacher or parent, move counters to explain how each answer changes.</p>
      <div class="hero-actions">
        <button class="primary-button" id="try-sample" type="button">Try it with sample data <span aria-hidden="true">→</span></button>
        <a class="text-link" href="#route-planner">Plan your own route <span aria-hidden="true">↓</span></a>
      </div>
      <ul class="hero-facts" aria-label="Product facts"><li>Works offline after the first visit.</li><li>Routes stay only on this device.</li><li>Free with no accounts or scores.</li></ul>
    </div>
    <picture class="hero-art">
      <source media="(max-width: 700px)" srcset="/assets/number-line-limited-720.avif" type="image/avif" />
      <source media="(max-width: 700px)" srcset="/assets/number-line-limited-720.webp" type="image/webp" />
      <source srcset="/assets/number-line-limited-1200.avif" type="image/avif" />
      <source srcset="/assets/number-line-limited-1200.webp" type="image/webp" />
      <img src="/assets/number-line-limited-1200.jpg" width="1200" height="800" fetchpriority="high" alt="Two counter trains travel on separate tracks and meet at a ten-frame station." />
    </picture>
  </section>
  <section class="planner-section" id="route-planner" aria-labelledby="planner-title">
    <div class="section-sign">
      <span aria-hidden="true">01</span>
      <div><p>Route office</p><h2 id="planner-title">Choose a journey</h2></div>
    </div>
    <form class="route-form" id="route-form" novalidate>
      <fieldset class="operation-switch">
        <legend>Which kind of route?</legend>
        <label><input type="radio" name="operation" value="add" ${op === "add" ? "checked" : ""} /><span><b aria-hidden="true">+</b> Add</span></label>
        <label><input type="radio" name="operation" value="subtract" ${op === "subtract" ? "checked" : ""} /><span><b aria-hidden="true">−</b> Subtract</span></label>
      </fieldset>
      <div class="number-fields">
        <label>${firstLabel}<input id="first-number" name="first" type="number" inputmode="numeric" min="0" max="100" step="1" value="${state.first}" required /></label>
        <span class="operator" aria-hidden="true">${op === "add" ? "+" : "−"}</span>
        <label>${secondLabel}<input id="second-number" name="second" type="number" inputmode="numeric" min="0" max="100" step="1" value="${state.second}" required /></label>
      </div>
      <div class="example-row" aria-label="Example problems">
        <span>Try a route:</span>
        ${(op === "add" ? [[8, 7], [38, 27], [46, 35]] : [[15, 7], [52, 18], [83, 46]]).map(([a, b]) =>
          `<button class="route-chip" type="button" data-example="${a},${b}">${a} ${op === "add" ? "+" : "−"} ${b}</button>`).join("")}
      </div>
      <p class="form-error" id="form-error" aria-live="assertive">${escapeHtml(state.error)}</p>
      <button class="primary-button" type="submit">Begin the route <span aria-hidden="true">→</span></button>
    </form>
    <div class="grownup-note" role="note" aria-labelledby="grownup-note-title">
      <span class="station-dot" aria-hidden="true"></span>
      <div><h3 id="grownup-note-title">For the grown-up nearby</h3><p>Let the child choose the chunk, even when it is not the shortest path. Ask “What stayed the same?” before offering a strategy.</p></div>
    </div>
  </section>
  <section class="three-stops" aria-labelledby="how-title">
    <p class="eyebrow">How it works</p><h2 id="how-title">A thought becomes a route</h2>
    <ol><li><span>1</span><strong>Move</strong><p>Choose a useful chunk. The counters show tens and ones.</p></li><li><span>2</span><strong>Explain</strong><p>Each choice becomes a sentence, not a speed score.</p></li><li><span>3</span><strong>Replay</strong><p>Step through the route and talk about why it works.</p></li></ol>
  </section>`;
}

function controlsTemplate(route: ActiveRoute, frame: RouteFrame): string {
  const isAdd = route.operation === "add";
  const maximum = isAdd ? (state.direction === "right-to-left" ? frame.right : frame.left) : frame.right;
  if (!isAdd && maximum === 0) {
    return `<div class="move-controls ready-to-finish"><p class="eyebrow">All chunks moved</p><h2>Nothing is left to take away</h2><p>You can finish the route and replay how you reached ${route.result}.</p><button class="finish-button" type="button" id="finish-route">Finish the route</button></div>`;
  }
  if (isAdd && maximum === 0 && canFinish(route)) {
    return `<div class="move-controls ready-to-finish"><p class="eyebrow">All counters together</p><h2>This side has no more chunks</h2><p>Join the numbers now, or change direction to keep exploring.</p>
      <fieldset class="direction-switch"><legend>Direction</legend>
        <label><input type="radio" name="direction" value="right-to-left" ${state.direction === "right-to-left" ? "checked" : ""} /><span>${frame.right} <b aria-hidden="true">→</b> ${frame.left}</span></label>
        <label><input type="radio" name="direction" value="left-to-right" ${state.direction === "left-to-right" ? "checked" : ""} /><span>${frame.left} <b aria-hidden="true">→</b> ${frame.right}</span></label>
      </fieldset><button class="finish-button" type="button" id="finish-route">Join the numbers and finish</button></div>`;
  }
  const suggestions = isAdd
    ? additionSuggestions(frame.left, frame.right, state.direction)
    : subtractionSuggestions(frame.left, frame.right);
  if (state.amount < 1 || state.amount > maximum) state.amount = suggestions[0] ?? 1;
  return `<div class="move-controls">
    <div class="control-intro">
      <p class="eyebrow">Next move</p>
      <h2>${isAdd ? "Move a chunk between the numbers" : `Choose part of the ${frame.right} still to subtract`}</h2>
    </div>
    ${isAdd ? `<fieldset class="direction-switch"><legend>Direction</legend>
      <label><input type="radio" name="direction" value="right-to-left" ${state.direction === "right-to-left" ? "checked" : ""} /><span>${frame.right} <b aria-hidden="true">→</b> ${frame.left}</span></label>
      <label><input type="radio" name="direction" value="left-to-right" ${state.direction === "left-to-right" ? "checked" : ""} /><span>${frame.left} <b aria-hidden="true">→</b> ${frame.right}</span></label>
    </fieldset>` : ""}
    <div class="chunk-picker">
      <label for="chunk-amount">Chunk size</label>
      <div class="stepper">
        <button type="button" id="decrease-chunk" aria-label="Decrease chunk by 1">−</button>
        <input id="chunk-amount" type="number" min="1" max="${maximum}" step="1" inputmode="numeric" value="${state.amount}" aria-describedby="chunk-help" />
        <button type="button" id="increase-chunk" aria-label="Increase chunk by 1">+</button>
      </div>
      <p id="chunk-help">Choose from 1 to ${maximum}. Quick choices:</p>
      <div class="suggestions">${suggestions.map((amount) => `<button type="button" class="suggestion ${amount === state.amount ? "is-selected" : ""}" data-amount="${amount}">${amount}</button>`).join("")}</div>
    </div>
    <label class="reason-picker" for="reason">Why this chunk?</label>
    <select id="reason">
      ${(["make-ten", "split", "own"] as MoveReason[]).map((reason) => `<option value="${reason}" ${reason === state.reason ? "selected" : ""}>${reasonLabel(reason)}</option>`).join("")}
    </select>
    <p class="form-error" id="move-error" aria-live="assertive">${escapeHtml(state.error)}</p>
    <div class="action-row">
      <button class="primary-button" type="button" id="apply-move">${isAdd ? "Move the chunk" : "Take away the chunk"} <span aria-hidden="true">→</span></button>
      <button class="secondary-button" type="button" id="undo-move" ${route.frames.length <= 1 ? "disabled" : ""}>Undo last move</button>
    </div>
    ${isAdd ? `<button class="finish-button" type="button" id="finish-route" ${canFinish(route) ? "" : "disabled"}>Join the numbers and finish</button>` : frame.right === 0 ? `<button class="finish-button" type="button" id="finish-route">Finish the route</button>` : ""}
  </div>`;
}

function ledgerTemplate(route: ActiveRoute, activeIndex = route.frames.length - 1): string {
  return `<section class="route-ledger" aria-labelledby="ledger-title">
    <div class="ledger-heading"><span class="route-line" aria-hidden="true"></span><div><p>Reasoning trail</p><h2 id="ledger-title">Route stations</h2></div></div>
    <ol>${route.frames.map((frame, index) => `<li class="${index === activeIndex ? "is-current" : ""} ${frame.kind === "finish" ? "is-finish" : ""}">
      <span class="ledger-marker" aria-hidden="true">${index + 1}</span>
      <div><strong>${escapeHtml(frame.equation)}</strong><p>${escapeHtml(frame.narration)}</p></div>
    </li>`).join("")}</ol>
  </section>`;
}

function workTemplate(): string {
  const route = state.route;
  if (!route) return setupTemplate();
  const frame = currentFrame(route);
  const opWord = route.operation === "add" ? "Addition" : "Subtraction";
  return `<section class="work-page" aria-labelledby="page-title">
    <div class="route-masthead">
      <div><p class="eyebrow">${opWord} line · numbers to 100</p><h1 id="page-title" tabindex="-1">${equationLabel(route)}</h1><p>One useful move at a time.</p></div>
      <button class="quiet-button" type="button" id="new-route">Choose a different route</button>
    </div>
    <div class="work-layout">
      <div class="workbench">
        <div class="platform-label"><span>Now at</span><strong>${escapeHtml(frame.equation)}</strong></div>
        <div class="quantity-platform ${route.operation === "subtract" ? "is-subtraction" : ""}">
          ${quantity(frame.left, route.operation === "add" ? "First number" : "Current number", "coral")}
          <span class="platform-operator" aria-hidden="true">${route.operation === "add" ? "+" : "−"}</span>
          ${quantity(frame.right, route.operation === "add" ? "Second number" : "Still to subtract", "brass")}
        </div>
        <p class="invariant"><span aria-hidden="true">◆</span> ${route.operation === "add" ? `The total stays ${route.result}, however you move the chunks.` : `Goal: take away ${route.second} altogether and arrive at ${route.result}.`}</p>
        ${controlsTemplate(route, frame)}
      </div>
      ${ledgerTemplate(route)}
    </div>
  </section>`;
}

function completionTemplate(): string {
  const route = state.route;
  if (!route) return setupTemplate();
  const frame = route.frames[state.replayIndex] ?? route.frames[0]!;
  const finalEquation = `${equationLabel(route)} = ${route.result}`;
  return `<section class="complete-page" aria-labelledby="page-title">
    <div class="arrival-heading"><p class="eyebrow">Route complete</p><h1 id="page-title" tabindex="-1">You arrived at ${route.result}.</h1><p>The answer is one stop. Your reasoning is the whole journey.</p></div>
    <div class="replay-layout">
      <div class="replay-stage">
        <div class="platform-label"><span>Replay station ${state.replayIndex + 1} of ${route.frames.length}</span><strong>${escapeHtml(frame.equation)}</strong></div>
        <div class="quantity-platform">
          ${quantity(frame.left, route.operation === "add" ? "First number" : "Current number", frame.kind === "finish" ? "teal" : "coral")}
          ${frame.kind !== "finish" ? `<span class="platform-operator" aria-hidden="true">${route.operation === "add" ? "+" : "−"}</span>${quantity(frame.right, route.operation === "add" ? "Second number" : "Still to subtract", "brass")}` : ""}
        </div>
        <p class="replay-narration" aria-live="polite">${escapeHtml(frame.narration)}</p>
        <div class="replay-controls" aria-label="Replay controls">
          <button type="button" id="replay-previous" ${state.replayIndex === 0 ? "disabled" : ""}><span aria-hidden="true">←</span> Previous</button>
          <button type="button" id="replay-play">${state.replayTimer === null ? "Play route" : "Pause"}</button>
          <button type="button" id="replay-next" ${state.replayIndex >= route.frames.length - 1 ? "disabled" : ""}>Next <span aria-hidden="true">→</span></button>
        </div>
      </div>
      ${ledgerTemplate(route, state.replayIndex)}
    </div>
    <article class="discussion-card" id="discussion-card" aria-labelledby="ticket-title">
      <header><span>Number Line Limited</span><b>Discussion ticket</b></header>
      <div class="ticket-equation"><p>Our route</p><h2 id="ticket-title">${escapeHtml(finalEquation)}</h2></div>
      <ol>${route.frames.slice(1).map((step) => `<li>${escapeHtml(step.narration)}</li>`).join("")}</ol>
      <div class="talk-prompts"><h3>Talk at the station</h3><ul><li>What changed at each step?</li><li>What stayed the same?</li><li>Which chunk made the problem friendlier?</li><li>Can you find a different route?</li></ul></div>
      <footer><span>Route ${escapeHtml(new Date(route.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }))}</span><span>No score. Explain what you noticed.</span></footer>
    </article>
    <div class="completion-actions">
      <button class="primary-button" id="print-card" type="button">Print discussion card</button>
      <button class="secondary-button" id="copy-route" type="button">Copy route</button>
      <button class="secondary-button" id="start-another" type="button">Start another route</button>
    </div>
  </section>`;
}

function historyTemplate(attempts: Attempt[], error = ""): string {
  return `<section class="history-page" aria-labelledby="page-title">
    <div class="history-heading"><p class="eyebrow">Local route archive</p><h1 id="page-title" tabindex="-1">Saved routes</h1><p>Finished reasoning trails stay only in this browser. Replay one for a conversation, or take your data with you.</p></div>
    <div class="history-tools">
      <a class="primary-button" href="/#learn">Start a new route</a>
      <button class="secondary-button" id="export-history" type="button" ${attempts.length ? "" : "disabled"}>Export JSON</button>
      <label class="secondary-button file-button">Import JSON<input id="import-history" type="file" accept="application/json,.json" /></label>
    </div>
    <p class="form-error" aria-live="assertive">${escapeHtml(error)}</p>
    ${attempts.length ? `<ol class="history-list">${attempts.map((attempt) => `<li>
      <div class="history-route"><span class="station-dot" aria-hidden="true"></span><div><strong>${escapeHtml(equationLabel(attempt))} = ${attempt.result}</strong><p>${attempt.frames.length} stations · ${escapeHtml(new Date(attempt.createdAt).toLocaleDateString())}</p></div></div>
      <button class="quiet-button" type="button" data-replay-id="${escapeHtml(attempt.id)}">Replay route</button>
    </li>`).join("")}</ol>` : `<div class="empty-state"><span class="empty-rails" aria-hidden="true"></span><h2>No finished routes yet</h2><p>Complete a problem and its reasoning trail will wait here for the next conversation.</p><a href="/#learn">Plan the first route</a></div>`}
    ${attempts.length ? `<div class="clear-zone">${state.confirmingClear ? `<p><strong>Remove all ${attempts.length} saved ${attempts.length === 1 ? "route" : "routes"} from this browser?</strong> Export first if you may need them later.</p><button id="confirm-clear" class="danger-button" type="button">Remove all routes</button><button id="cancel-clear" class="quiet-button" type="button">Keep routes</button>` : `<button id="ask-clear" class="quiet-button" type="button">Clear saved routes…</button>`}</div>` : ""}
  </section>`;
}

function bindSetup(): void {
  document.querySelector<HTMLButtonElement>("#try-sample")?.addEventListener("click", () => { void enterDemo(); });
  document.querySelectorAll<HTMLInputElement>('input[name="operation"]').forEach((input) => input.addEventListener("change", () => {
    state.operation = input.value as Operation;
    [state.first, state.second] = state.operation === "add" ? [8, 7] : [15, 7];
    state.error = "";
    render();
  }));
  document.querySelectorAll<HTMLButtonElement>("[data-example]").forEach((button) => button.addEventListener("click", () => {
    const [first, second] = (button.dataset.example ?? "").split(",").map(Number);
    if (first === undefined || second === undefined) return;
    state.first = first; state.second = second; state.error = ""; render();
    document.querySelector<HTMLInputElement>("#first-number")?.focus();
  }));
  document.querySelector<HTMLFormElement>("#route-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const first = Number(document.querySelector<HTMLInputElement>("#first-number")?.value);
    const second = Number(document.querySelector<HTMLInputElement>("#second-number")?.value);
    state.first = first; state.second = second;
    const error = validateProblem(state.operation, first, second);
    if (error) { state.error = error; render(); document.querySelector<HTMLInputElement>("#first-number")?.focus(); return; }
    state.route = createRoute(state.operation, first, second);
    state.direction = state.operation === "add" && second === 0 ? "left-to-right" : "right-to-left";
    const frame = currentFrame(state.route);
    state.amount = state.operation === "add" ? (additionSuggestions(frame.left, frame.right, state.direction)[0] ?? 1) : (subtractionSuggestions(frame.left, frame.right)[0] ?? 1);
    state.error = ""; state.view = "work";
    history.replaceState(null, "", "#route");
    await safelySaveActive();
    render();
    document.querySelector<HTMLHeadingElement>("#page-title")?.focus();
  });
}

async function safelySaveActive(): Promise<void> {
  if (!state.route) return;
  try { await saveActive(state.route); }
  catch { showToast("This route is open, but this browser could not save it for later."); }
}

function bindWork(): void {
  const route = state.route;
  if (!route) return;
  document.querySelectorAll<HTMLInputElement>('input[name="direction"]').forEach((input) => input.addEventListener("change", () => {
    state.direction = input.value as MoveDirection;
    const frame = currentFrame(route);
    state.amount = additionSuggestions(frame.left, frame.right, state.direction)[0] ?? 1;
    render();
  }));
  const amountInput = document.querySelector<HTMLInputElement>("#chunk-amount");
  amountInput?.addEventListener("input", () => { state.amount = Number(amountInput.value); });
  document.querySelector("#decrease-chunk")?.addEventListener("click", () => { state.amount = Math.max(1, state.amount - 1); render(); document.querySelector<HTMLInputElement>("#chunk-amount")?.focus(); });
  document.querySelector("#increase-chunk")?.addEventListener("click", () => {
    const frame = currentFrame(route);
    const maximum = route.operation === "add" ? (state.direction === "right-to-left" ? frame.right : frame.left) : frame.right;
    state.amount = Math.min(maximum, state.amount + 1); render(); document.querySelector<HTMLInputElement>("#chunk-amount")?.focus();
  });
  document.querySelectorAll<HTMLButtonElement>("[data-amount]").forEach((button) => button.addEventListener("click", () => { state.amount = Number(button.dataset.amount); render(); document.querySelector<HTMLButtonElement>(`[data-amount="${state.amount}"]`)?.focus(); }));
  document.querySelector<HTMLSelectElement>("#reason")?.addEventListener("change", (event) => { state.reason = (event.target as HTMLSelectElement).value as MoveReason; });
  document.querySelector("#apply-move")?.addEventListener("click", async () => {
    const input = document.querySelector<HTMLInputElement>("#chunk-amount");
    state.amount = Number(input?.value);
    state.reason = (document.querySelector<HTMLSelectElement>("#reason")?.value ?? "own") as MoveReason;
    try {
      route.operation === "add" ? moveAddition(route, state.amount, state.direction, state.reason) : subtractChunk(route, state.amount, state.reason);
      state.error = "";
      const frame = currentFrame(route);
      state.amount = route.operation === "add" ? (additionSuggestions(frame.left, frame.right, state.direction)[0] ?? 1) : (subtractionSuggestions(frame.left, frame.right)[0] ?? 1);
      await safelySaveActive(); render();
      document.querySelector<HTMLButtonElement>(frame.right === 0 && route.operation === "subtract" ? "#finish-route" : "#apply-move")?.focus();
    } catch (error) { state.error = error instanceof Error ? error.message : "That move could not be made."; render(); document.querySelector<HTMLInputElement>("#chunk-amount")?.focus(); }
  });
  document.querySelector("#undo-move")?.addEventListener("click", async () => {
    if (route.frames.length > 1) route.frames.pop();
    state.error = ""; await safelySaveActive(); render(); document.querySelector<HTMLButtonElement>("#apply-move")?.focus();
  });
  document.querySelector("#finish-route")?.addEventListener("click", async () => {
    try {
      finishRoute(route); state.view = "complete"; state.replayIndex = route.frames.length - 1; state.error = "";
      await saveAttempt(route); history.replaceState(null, "", `#route-${route.id}`); render();
      document.querySelector<HTMLHeadingElement>("#page-title")?.focus();
    } catch (error) { state.error = error instanceof Error ? error.message : "This route is not ready to finish."; render(); }
  });
  document.querySelector("#new-route")?.addEventListener("click", async () => {
    if (route.frames.length > 1 && !window.confirm("Leave this unfinished route? Its steps will be removed.")) return;
    await clearActive().catch(() => undefined); state.route = null; state.view = "setup"; history.replaceState(null, "", "#learn"); render();
  });
}

function stopReplay(): void {
  if (state.replayTimer !== null) window.clearInterval(state.replayTimer);
  state.replayTimer = null;
}

function bindCompletion(): void {
  const route = state.route;
  if (!route) return;
  document.querySelector("#replay-previous")?.addEventListener("click", () => { stopReplay(); state.replayIndex = Math.max(0, state.replayIndex - 1); render(); });
  document.querySelector("#replay-next")?.addEventListener("click", () => { stopReplay(); state.replayIndex = Math.min(route.frames.length - 1, state.replayIndex + 1); render(); });
  document.querySelector("#replay-play")?.addEventListener("click", () => {
    if (state.replayTimer !== null) { stopReplay(); render(); return; }
    if (state.replayIndex >= route.frames.length - 1) state.replayIndex = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { state.replayIndex = Math.min(route.frames.length - 1, state.replayIndex + 1); showToast("Reduced motion is on, so replay advances one station at a time."); render(); return; }
    state.replayTimer = window.setInterval(() => {
      if (state.replayIndex >= route.frames.length - 1) { stopReplay(); render(); return; }
      state.replayIndex += 1; render();
    }, 1400);
    render();
  });
  document.querySelector("#print-card")?.addEventListener("click", () => window.print());
  document.querySelector("#copy-route")?.addEventListener("click", async () => {
    const summary = [`${equationLabel(route)} = ${route.result}`, ...route.frames.map((frame, index) => `${index + 1}. ${frame.narration}`), "Talk about it: What changed? What stayed the same?"] .join("\n");
    try { await navigator.clipboard.writeText(summary); showToast("Route copied."); }
    catch { showToast("Copy was blocked. Use Print discussion card instead."); }
  });
  document.querySelector("#start-another")?.addEventListener("click", () => { stopReplay(); state.route = null; state.view = "setup"; state.error = ""; history.replaceState(null, "", "#learn"); render(); });
}

async function renderHistory(error = ""): Promise<void> {
  state.view = "history"; stopReplay();
  updateDemoBanner();
  app.innerHTML = `<section class="history-page" aria-labelledby="page-title"><div class="history-heading"><p class="eyebrow">Local route archive</p><h1 id="page-title" tabindex="-1">Saved routes</h1></div><div class="empty-state" role="status"><span class="empty-rails" aria-hidden="true"></span><h2>Opening the route archive…</h2><p>Reading the finished trails stored in this browser.</p></div></section>`;
  let attempts: Attempt[] = [];
  try { attempts = await listAttempts(); }
  catch { error = "Saved routes could not be opened in this browser. You can still practice a new route."; }
  app.innerHTML = historyTemplate(attempts, error);
  document.querySelectorAll<HTMLButtonElement>("[data-replay-id]").forEach((button) => button.addEventListener("click", () => {
    const attempt = attempts.find((item) => item.id === button.dataset.replayId);
    if (!attempt) return;
    state.route = { ...structuredClone(attempt), completed: true }; state.view = "complete"; state.replayIndex = 0; history.replaceState(null, "", `#route-${attempt.id}`); render();
  }));
  document.querySelector("#export-history")?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ product: "arithmetic-steps", exportedAt: new Date().toISOString(), attempts }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `arithmetic-steps-${new Date().toISOString().slice(0, 10)}.json`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    // Let the browser begin consuming the object URL before releasing it.
    // Revoking in the same turn can cancel a programmatic download in some
    // browsers, particularly when storage has just finished rendering.
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  });
  document.querySelector<HTMLInputElement>("#import-history")?.addEventListener("change", async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      const values = Array.isArray(parsed) ? parsed : (parsed && typeof parsed === "object" && "attempts" in parsed ? (parsed as { attempts: unknown }).attempts : []);
      if (!Array.isArray(values)) throw new Error("The JSON file has no routes list.");
      const count = await importAttempts(values); showToast(`${count} ${count === 1 ? "route" : "routes"} imported.`); await renderHistory();
    } catch (problem) { await renderHistory(problem instanceof Error ? problem.message : "That file could not be imported."); }
  });
  document.querySelector("#ask-clear")?.addEventListener("click", () => { state.confirmingClear = true; void renderHistory(); });
  document.querySelector("#cancel-clear")?.addEventListener("click", () => { state.confirmingClear = false; void renderHistory(); });
  document.querySelector("#confirm-clear")?.addEventListener("click", async () => { await clearAttempts(); state.confirmingClear = false; showToast("All saved routes were removed."); await renderHistory(); });
}

function render(): void {
  if (state.view === "history") { void renderHistory(); return; }
  updateDemoBanner();
  app.innerHTML = state.view === "setup" ? setupTemplate() : state.view === "work" ? workTemplate() : completionTemplate();
  if (state.view === "setup") bindSetup();
  else if (state.view === "work") bindWork();
  else bindCompletion();
}

window.addEventListener("hashchange", () => {
  const hash = location.hash;
  if (hash === "#history") { state.confirmingClear = false; void renderHistory(); }
  else if (hash === "#learn" || hash === "") { stopReplay(); state.view = "setup"; state.route = null; state.error = ""; render(); }
});

window.addEventListener("popstate", () => {
  const shouldUseDemo = locationIsDemo();
  if (shouldUseDemo === state.isDemo) return;
  if (shouldUseDemo) void enterDemo(false);
  else void leaveDemo(false);
});

// Header, footer, and legal-page links are regular links so they retain their
// expected browser behavior. In demo mode, wait for its disposable database
// to be removed before following an ordinary navigation away from /demo.
// This covers the common home/privacy/footer exits that cannot be handled by
// the app's History API callback alone.
document.addEventListener("click", (event) => {
  if (!state.isDemo || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
  if (!target || target.target || target.hasAttribute("download")) return;
  const destination = new URL(target.href, location.href);
  if (urlIsDemo(destination)) return;
  event.preventDefault();
  void navigateAwayFromDemo(destination);
});

document.querySelector<HTMLButtonElement>("#reset-demo")?.addEventListener("click", () => { void resetDemo(); });
document.querySelector<HTMLButtonElement>("#start-real")?.addEventListener("click", () => { void leaveDemo(); });

function updateNetworkState(): void {
  networkBanner.hidden = navigator.onLine;
}
window.addEventListener("online", updateNetworkState);
window.addEventListener("offline", updateNetworkState);
updateNetworkState();

let deferredInstall: BeforeInstallPromptEvent | null = null;
interface BeforeInstallPromptEvent extends Event { prompt(): Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }>; }
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault(); deferredInstall = event as BeforeInstallPromptEvent;
  const button = document.querySelector<HTMLButtonElement>("#install-button");
  if (button) button.hidden = false;
});
document.querySelector("#install-button")?.addEventListener("click", async () => {
  if (!deferredInstall) return;
  await deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null;
  const button = document.querySelector<HTMLButtonElement>("#install-button"); if (button) button.hidden = true;
});

async function registerServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator) || import.meta.env.DEV) return;
  let refreshForUpdate = false;
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      worker?.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) {
          showToast("A fresh route map is ready.", { label: "Update", run: () => { refreshForUpdate = true; worker.postMessage({ type: "SKIP_WAITING" }); } });
        }
      });
    });
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (refreshForUpdate) location.reload(); });
  } catch { showToast("Offline setup is unavailable, but practice still works while this page is open."); }
}

async function bootstrap(): Promise<void> {
  updateDemoBanner();
  // A real-app load may follow an ordinary document navigation from /demo.
  // Await cleanup before rendering so the old sample cannot survive that exit
  // even if a browser did not run the preceding page's click handler.
  if (!state.isDemo) {
    try {
      await discardDemoStorage();
    } catch {
      showToast("A previous sample could not be cleared. Close other Arithmetic Steps tabs, then reload.");
    }
  }
  if (location.hash === "#history") { await renderHistory(); void registerServiceWorker(); return; }
  try {
    const active = await loadActive();
    if (active && !active.completed) {
      state.route = active;
      state.view = "work";
      state.first = active.first;
      state.second = active.second;
      state.operation = active.operation;
    } else if (state.isDemo) {
      await seedDemoRoute();
    }
  } catch { showToast("A previous unfinished route could not be restored."); }
  render();
  void registerServiceWorker();
}

void bootstrap();
