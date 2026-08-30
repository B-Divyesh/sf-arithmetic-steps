export type Operation = "add" | "subtract";
export type MoveDirection = "right-to-left" | "left-to-right";
export type MoveReason = "make-ten" | "split" | "own";

export interface RouteFrame {
  left: number;
  right: number;
  equation: string;
  narration: string;
  kind: "start" | "move" | "finish";
}

export interface Attempt {
  schemaVersion: 1;
  id: string;
  operation: Operation;
  first: number;
  second: number;
  result: number;
  createdAt: string;
  frames: RouteFrame[];
}

export interface ActiveRoute extends Attempt {
  completed: boolean;
}

const integer = (value: number) => Number.isInteger(value) && value >= 0 && value <= 100;

export type ParsedProblemOperands =
  | { ok: true; first: number; second: number }
  | { ok: false; emptyField: "first" | "second" };

/**
 * Keep required-field checks on the raw form values. Number("") is 0, which
 * would otherwise turn a missing operand into a number the child never chose.
 */
export function parseProblemOperands(firstValue: string, secondValue: string): ParsedProblemOperands {
  if (firstValue.trim() === "") return { ok: false, emptyField: "first" };
  if (secondValue.trim() === "") return { ok: false, emptyField: "second" };
  return { ok: true, first: Number(firstValue), second: Number(secondValue) };
}

export function validateProblem(operation: Operation, first: number, second: number): string | null {
  if (!integer(first) || !integer(second)) return "Use whole numbers from 0 to 100.";
  if (operation === "add" && first + second > 100) return "Choose numbers with a total of 100 or less.";
  if (operation === "add" && first + second === 0) return "Choose at least one counter so there is a problem to explore.";
  if (operation === "subtract" && second > first) return "The number being taken away must be smaller than the starting number.";
  if (operation === "subtract" && second === 0) return "Choose something to take away so there is a problem to explore.";
  return null;
}

export function createRoute(operation: Operation, first: number, second: number): ActiveRoute {
  const error = validateProblem(operation, first, second);
  if (error) throw new Error(error);
  const result = operation === "add" ? first + second : first - second;
  return {
    schemaVersion: 1,
    id: crypto.randomUUID(),
    operation,
    first,
    second,
    result,
    createdAt: new Date().toISOString(),
    completed: false,
    frames: [{
      left: first,
      right: second,
      equation: operation === "add" ? `${first} + ${second}` : `${first} − ${second}`,
      narration: operation === "add"
        ? `Start with ${first} and ${second}. The total will stay the same as we rearrange them.`
        : `Start at ${first}. We need to take away ${second} altogether.`,
      kind: "start"
    }]
  };
}

export function currentFrame(route: ActiveRoute): RouteFrame {
  const frame = route.frames.at(-1);
  if (!frame) throw new Error("This problem has no first step.");
  return frame;
}

function reasonWords(reason: MoveReason): string {
  if (reason === "make-ten") return "to land on a friendly ten";
  if (reason === "split") return "to split the problem into easier parts";
  return "to try my own step";
}

export function moveAddition(route: ActiveRoute, amount: number, direction: MoveDirection, reason: MoveReason): RouteFrame {
  if (route.operation !== "add" || route.completed) throw new Error("This addition problem cannot be changed now.");
  const before = currentFrame(route);
  const source = direction === "right-to-left" ? before.right : before.left;
  if (!Number.isInteger(amount) || amount < 1 || amount > source) {
    throw new Error(`Choose a chunk from 1 to ${source}.`);
  }
  const left = direction === "right-to-left" ? before.left + amount : before.left - amount;
  const right = direction === "right-to-left" ? before.right - amount : before.right + amount;
  const from = direction === "right-to-left" ? before.right : before.left;
  const to = direction === "right-to-left" ? before.left : before.right;
  const frame: RouteFrame = {
    left,
    right,
    equation: `${left} + ${right}`,
    narration: `Move ${amount} from ${from} to ${to} ${reasonWords(reason)}. ${before.left} + ${before.right} and ${left} + ${right} have the same total.`,
    kind: "move"
  };
  route.frames.push(frame);
  return frame;
}

export function subtractChunk(route: ActiveRoute, amount: number, reason: MoveReason): RouteFrame {
  if (route.operation !== "subtract" || route.completed) throw new Error("This subtraction problem cannot be changed now.");
  const before = currentFrame(route);
  if (!Number.isInteger(amount) || amount < 1 || amount > before.right) {
    throw new Error(`Choose a chunk from 1 to ${before.right}.`);
  }
  const left = before.left - amount;
  const right = before.right - amount;
  const frame: RouteFrame = {
    left,
    right,
    equation: right === 0 ? `${left}` : `${left} − ${right}`,
    narration: `Take away ${amount} ${reasonWords(reason)}. ${before.left} − ${amount} = ${left}, and ${right} is still waiting to be taken away.`,
    kind: "move"
  };
  route.frames.push(frame);
  return frame;
}

export function canFinish(route: ActiveRoute): boolean {
  if (route.completed || route.frames.length < 2) return false;
  return route.operation === "add" || currentFrame(route).right === 0;
}

export function finishRoute(route: ActiveRoute): RouteFrame {
  if (!canFinish(route)) {
    throw new Error(route.operation === "subtract" ? "Take away the remaining amount first." : "Make at least one move before finishing the problem.");
  }
  const before = currentFrame(route);
  const frame: RouteFrame = {
    left: route.result,
    right: 0,
    equation: `${route.first} ${route.operation === "add" ? "+" : "−"} ${route.second} = ${route.result}`,
    narration: route.operation === "add"
      ? `Join ${before.left} and ${before.right}. The total is ${route.result}.`
      : `Nothing is left to take away. The answer is ${route.result}.`,
    kind: "finish"
  };
  route.frames.push(frame);
  route.completed = true;
  return frame;
}

function uniqueChunks(chunks: number[], maximum: number): number[] {
  return [...new Set(chunks.filter((chunk) => Number.isInteger(chunk) && chunk > 0 && chunk <= maximum))].slice(0, 4);
}

export function additionSuggestions(left: number, right: number, direction: MoveDirection): number[] {
  const target = direction === "right-to-left" ? left : right;
  const source = direction === "right-to-left" ? right : left;
  const toTen = target % 10 === 0 ? Math.min(10, source) : 10 - (target % 10);
  return uniqueChunks([toTen, Math.min(10, source), source % 10, source], source);
}

export function subtractionSuggestions(current: number, remaining: number): number[] {
  const toTen = current % 10 === 0 ? Math.min(10, remaining) : current % 10;
  return uniqueChunks([toTen, Math.min(10, remaining), remaining % 10, remaining], remaining);
}

function hasValidRouteShape(value: unknown, minimumFrames: number): value is Attempt {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Attempt>;
  return item.schemaVersion === 1 && (item.operation === "add" || item.operation === "subtract") &&
    integer(item.first as number) && integer(item.second as number) && integer(item.result as number) &&
    typeof item.id === "string" && typeof item.createdAt === "string" && Array.isArray(item.frames) && item.frames.length >= minimumFrames &&
    item.frames.every((frame) => frame && typeof frame.equation === "string" && typeof frame.narration === "string" &&
      typeof frame.left === "number" && typeof frame.right === "number");
}

export function isAttempt(value: unknown): value is Attempt {
  return hasValidRouteShape(value, 2);
}

export function isActiveRoute(value: unknown): value is ActiveRoute {
  return hasValidRouteShape(value, 1) && typeof (value as Partial<ActiveRoute>).completed === "boolean";
}
