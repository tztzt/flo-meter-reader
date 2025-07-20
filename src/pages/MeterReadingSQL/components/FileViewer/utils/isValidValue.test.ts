import { describe, it, expect } from "vitest";
import { isValidValue } from "./isValidValue";

describe("isValidValue", () => {
  it("returns false for empty string", () => {
    expect(isValidValue("")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isValidValue(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isValidValue(undefined)).toBe(false);
  });

  it("returns true for non-empty string", () => {
    expect(isValidValue("hello")).toBe(true);
  });

  it("returns true for number 0", () => {
    expect(isValidValue(0)).toBe(true);
  });

  it("returns true for NaN", () => {
    expect(isValidValue(NaN)).toBe(true);
  });

  it("returns true for false", () => {
    expect(isValidValue(false)).toBe(true);
  });

  it("returns true for true", () => {
    expect(isValidValue(true)).toBe(true);
  });

  it("returns true for object", () => {
    expect(isValidValue({})).toBe(true);
  });

  it("returns true for array", () => {
    expect(isValidValue([])).toBe(true);
  });
});
