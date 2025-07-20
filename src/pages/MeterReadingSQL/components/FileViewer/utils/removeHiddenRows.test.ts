import { describe, it, expect } from "vitest";
import { removeHiddenRows } from "./removeHiddenRows";
import { RecordType } from "@/types";

describe("removeHiddenRows", () => {
  it("removes EOF rows", () => {
    const row = [RecordType.EOF, "some", "data"];
    expect(removeHiddenRows(row)).toBe(false);
  });

  it("removes INTERVAL_EVENT rows", () => {
    const row = [RecordType.INTERVAL_EVENT, "some", "data"];
    expect(removeHiddenRows(row)).toBe(false);
  });

  it("removes B2B_DETAILS_RECORD rows", () => {
    const row = [RecordType.B2B_DETAILS_RECORD, "some", "data"];
    expect(removeHiddenRows(row)).toBe(false);
  });

  it("keeps HEADER rows", () => {
    const row = [RecordType.HEADER, "header"];
    expect(removeHiddenRows(row)).toBe(true);
  });

  it("keeps NMI_DATA rows", () => {
    const row = [RecordType.NMI_DATA, "nmi"];
    expect(removeHiddenRows(row)).toBe(true);
  });

  it("keeps INTERVAL_DATA rows", () => {
    const row = [RecordType.INTERVAL_DATA, "data"];
    expect(removeHiddenRows(row)).toBe(true);
  });

  it("handles unexpected record types safely", () => {
    const row = ["999", "unexpected"];
    expect(removeHiddenRows(row)).toBe(true);
  });
});
