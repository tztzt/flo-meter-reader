import { describe, it, expect } from "vitest";
import { getNimInterval } from "./getNimInterval";
import { RecordType } from "@/types";

describe("getNimInterval", () => {
  it("should return the interval from the most recent NMI_DATA record", () => {
    const data = [
      [RecordType.HEADER, "header"],
      [
        RecordType.NMI_DATA,
        "NEM1201009",
        "E1E2",
        "1",
        "E1",
        "N1",
        "01009",
        "kWh",
        "30",
        "20050610",
      ],
      [RecordType.INTERVAL_DATA, "20050301", "0", "..."],
      [RecordType.INTERVAL_DATA, "20050302", "0", "..."],
    ];

    const interval = getNimInterval(data, 3);
    expect(interval).toBe(30);
  });

  it("should return 30 if no NMI_DATA is found", () => {
    const data = [
      [RecordType.HEADER, "header"],
      [RecordType.INTERVAL_DATA, "20050301", "0", "..."],
      [RecordType.INTERVAL_DATA, "20050302", "0", "..."],
    ];

    const interval = getNimInterval(data, 2);
    expect(interval).toBe(30);
  });

  it("should handle malformed or missing interval gracefully", () => {
    const data = [
      [RecordType.HEADER, "header"],
      [RecordType.NMI_DATA, "NEM1201009", "", "", "", "", "", "", "", ""],
      [RecordType.INTERVAL_DATA, "20050301"],
    ];

    const interval = getNimInterval(data, 2);
    expect(interval).toBe(30);
  });

  it("should parse a different interval (e.g., 15) correctly", () => {
    const data = [
      [RecordType.HEADER, "header"],
      [
        RecordType.NMI_DATA,
        "NEM1201009",
        "E1E2",
        "1",
        "E1",
        "N1",
        "01009",
        "kWh",
        "15",
        "20050610",
      ],
      [RecordType.INTERVAL_DATA, "20050301"],
    ];

    const interval = getNimInterval(data, 2);
    expect(interval).toBe(15);
  });
});
