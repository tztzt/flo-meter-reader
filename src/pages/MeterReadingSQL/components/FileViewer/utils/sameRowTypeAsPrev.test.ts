import { describe, it, expect } from "vitest";
import { sameRowTypeAsPrev } from "./sameRowTypeAsPrev";
import { RecordType } from "@/types";

describe("sameRowTypeAsPrev", () => {
  it("returns false for the first row (index 0)", () => {
    const data = [[RecordType.HEADER]];
    const result = sameRowTypeAsPrev(data[0], 0, data);
    expect(result).toBe(false);
  });

  it("returns true if previous row has a different type", () => {
    const data = [[RecordType.HEADER], [RecordType.NMI_DATA]];
    const result = sameRowTypeAsPrev(data[1], 1, data);
    expect(result).toBe(true);
  });

  it("returns false if previous row has the same type", () => {
    const data = [[RecordType.INTERVAL_DATA], [RecordType.INTERVAL_DATA]];
    const result = sameRowTypeAsPrev(data[1], 1, data);
    expect(result).toBe(false);
  });

  it("returns true if row type changes after multiple identical rows", () => {
    const data = [
      [RecordType.INTERVAL_DATA],
      [RecordType.INTERVAL_DATA],
      [RecordType.NMI_DATA],
    ];
    const result = sameRowTypeAsPrev(data[2], 2, data);
    expect(result).toBe(true);
  });

  it("handles unexpected record types safely", () => {
    const data = [["999"], ["300"]];
    const result = sameRowTypeAsPrev(data[1], 1, data);
    expect(result).toBe(true);
  });
});
