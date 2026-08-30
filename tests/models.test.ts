import { describe, expect, it } from "vitest";
import {
  additionSuggestions,
  canFinish,
  createRoute,
  finishRoute,
  isActiveRoute,
  isAttempt,
  moveAddition,
  subtractChunk,
  subtractionSuggestions,
  validateProblem
} from "../src/models";

describe("problem validation", () => {
  it("keeps work within whole numbers to 100", () => {
    expect(validateProblem("add", 70, 31)).toMatch(/100 or less/);
    expect(validateProblem("add", 0, 0)).toMatch(/at least one/);
    expect(validateProblem("subtract", 12, 20)).toMatch(/smaller/);
    expect(validateProblem("subtract", 20, 0)).toMatch(/something to take away/);
    expect(validateProblem("add", 38, 27)).toBeNull();
  });
});

describe("addition routes", () => {
  it("distinguishes an unfinished checkpoint from a completed attempt", () => {
    const route = createRoute("add", 8, 7);
    expect(isActiveRoute(route)).toBe(true);
    expect(isAttempt(route)).toBe(false);
    moveAddition(route, 2, "right-to-left", "make-ten");
    expect(isActiveRoute(structuredClone(route))).toBe(true);
    expect(isActiveRoute({ ...route, completed: "no" })).toBe(false);
  });

  it("preserves the total while making a ten", () => {
    const route = createRoute("add", 8, 7);
    const frame = moveAddition(route, 2, "right-to-left", "make-ten");
    expect(frame).toMatchObject({ left: 10, right: 5, equation: "10 + 5" });
    expect(frame.left + frame.right).toBe(15);
    expect(canFinish(route)).toBe(true);
    expect(finishRoute(route).equation).toBe("8 + 7 = 15");
    expect(route.completed).toBe(true);
  });

  it("suggests the distance to the next ten first", () => {
    expect(additionSuggestions(38, 27, "right-to-left")[0]).toBe(2);
    expect(additionSuggestions(7, 8, "left-to-right")[0]).toBe(2);
  });

  it("rejects chunks larger than the source", () => {
    const route = createRoute("add", 8, 7);
    expect(() => moveAddition(route, 8, "right-to-left", "own")).toThrow(/1 to 7/);
  });
});

describe("subtraction routes", () => {
  it("subtracts chosen chunks until nothing remains", () => {
    const route = createRoute("subtract", 52, 18);
    subtractChunk(route, 10, "split");
    expect(route.frames.at(-1)).toMatchObject({ left: 42, right: 8, equation: "42 − 8" });
    subtractChunk(route, 8, "make-ten");
    expect(route.frames.at(-1)).toMatchObject({ left: 34, right: 0 });
    expect(finishRoute(route).equation).toBe("52 − 18 = 34");
  });

  it("offers a chunk that lands on a ten", () => {
    expect(subtractionSuggestions(52, 18)[0]).toBe(2);
  });
});
