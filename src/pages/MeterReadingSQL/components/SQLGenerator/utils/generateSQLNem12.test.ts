import { describe, it, expect } from "vitest";
import { generateSQLNem12 } from "./generateSQLNem12";

describe("generateSQLNem12", () => {
  it("should generate SQL statements for basic NEM12 data with 30-minute intervals", () => {
    const data = [
      ["200", "NMI001", "E1E2", "E1", "N1", "", "KWH", "30", ""],
      [
        "300",
        "20050301",
        "1.1",
        "2.2",
        "3.3",
        "4.4",
        "5.5",
        "6.6",
        "7.7",
        "8.8",
        "9.9",
        "10.0",
        "11.1",
        "12.2",
        "13.3",
        "14.4",
        "15.5",
        "16.6",
        "17.7",
        "18.8",
        "19.9",
        "20.0",
        "21.1",
        "22.2",
        "23.3",
        "24.4",
        "25.5",
        "26.6",
        "27.7",
        "28.8",
        "29.9",
        "30.0",
        "31.1",
        "32.2",
        "33.3",
        "34.4",
        "35.5",
        "36.6",
        "37.7",
        "38.8",
        "39.9",
        "40.0",
        "41.1",
        "42.2",
        "43.3",
        "44.4",
        "45.5",
        "46.6",
        "47.7",
        "48.8",
        "A",
        "",
        "20050301143000",
      ],
    ];

    const result = generateSQLNem12(data);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatch(
      /INSERT INTO meter_readings \(nmi, timestamp, consumption\) VALUES \('NMI001', '2005-03-01 00:00:00', \d+\.\d{4}\);/
    );

    const expectedSum = data[1]
      .filter((_, index) => index > 1 && index < 50)
      .reduce((a, b) => a + Number(b), 0);
    expect(result[0]).toContain(expectedSum.toFixed(4));
  });

  it("should handle 15-minute intervals correctly", () => {
    const data = [
      ["200", "NMI002", "E1E2", "E1", "N1", "", "KWH", "15", ""],
      [
        "300",
        "20050301",
        "1.0",
        "2.0",
        "3.0",
        "4.0",
        "5.0",
        "6.0",
        "7.0",
        "8.0",
        "9.0",
        "10.0",
      ], // Only first 10 readings for brevity
    ];

    const result = generateSQLNem12(data);

    expect(result).toHaveLength(1);
    expect(result[0]).toContain("'NMI002'");
    expect(result[0]).toContain("'2005-03-01 00:00:00'");

    expect(result[0]).toContain("55.0000");
  });

  it("should handle multiple NMIs in the same dataset", () => {
    const data = [
      ["200", "NMI001", "E1E2", "E1", "N1", "", "KWH", "30", ""],
      ["300", "20050301", "1.0", "2.0", "3.0", "4.0"],
      ["200", "NMI002", "E1E2", "E1", "N1", "", "KWH", "30", ""],
      ["300", "20050301", "5.0", "6.0", "7.0", "8.0"],
    ];

    const result = generateSQLNem12(data);

    expect(result).toHaveLength(2);
    expect(result.some((stmt) => stmt.includes("'NMI001'"))).toBe(true);
    expect(result.some((stmt) => stmt.includes("'NMI002'"))).toBe(true);
  });

  it("should handle multiple dates for the same NMI", () => {
    const data = [
      ["200", "NMI001", "E1E2", "E1", "N1", "", "KWH", "30", ""],
      ["300", "20050301", "1.0", "2.0", "3.0"],
      ["300", "20050302", "4.0", "5.0", "6.0"],
    ];

    const result = generateSQLNem12(data);

    expect(result).toHaveLength(2);
    expect(result.some((stmt) => stmt.includes("'2005-03-01 00:00:00'"))).toBe(
      true
    );
    expect(result.some((stmt) => stmt.includes("'2005-03-02 00:00:00'"))).toBe(
      true
    );
  });

  it("should skip invalid numeric values", () => {
    const data = [
      ["200", "NMI001", "E1E2", "E1", "N1", "", "KWH", "30", ""],
      ["300", "20050301", "1.0", "invalid", "3.0", "", "5.0", "NaN"],
    ];

    const result = generateSQLNem12(data);

    expect(result).toHaveLength(1);
    expect(result[0]).toContain("9.0000");
  });

  it("should handle empty data array", () => {
    const result = generateSQLNem12([]);
    expect(result).toHaveLength(0);
  });

  it("should handle data with only 200 records (no 300 records)", () => {
    const data = [["200", "NMI001", "E1E2", "E1", "N1", "", "KWH", "30", ""]];

    const result = generateSQLNem12(data);
    expect(result).toHaveLength(0);
  });

  it("should handle 300 records without preceding 200 record", () => {
    const data = [["300", "20050301", "1.0", "2.0", "3.0"]];

    const result = generateSQLNem12(data);
    expect(result).toHaveLength(0);
  });

  it("should use default interval length when parsing fails", () => {
    const data = [
      ["200", "NMI001", "E1E2", "E1", "N1", "", "KWH", "invalid", ""],
      ["300", "20050301", "1.0", "2.0", "3.0"], // Should use 30-minute default (48 intervals)
    ];

    const result = generateSQLNem12(data);
    expect(result).toHaveLength(1);
    expect(result[0]).toContain("6.0000");
  });

  it("should format consumption values to 4 decimal places", () => {
    const data = [
      ["200", "NMI001", "E1E2", "E1", "N1", "", "KWH", "30", ""],
      ["300", "20050301", "1.0", "2.123456789"],
    ];

    const result = generateSQLNem12(data);

    expect(result).toHaveLength(1);
    expect(result[0]).toContain("3.1235");
  });

  it("should correctly parse date strings in YYYYMMDD format", () => {
    const data = [
      ["200", "NMI001", "E1E2", "E1", "N1", "", "KWH", "30", ""],
      ["300", "20231225", "1.0", "2.0"],
    ];

    const result = generateSQLNem12(data);

    expect(result).toHaveLength(1);
    expect(result[0]).toContain("'2023-12-25 00:00:00'");
  });

  it("should handle single-digit months and days correctly", () => {
    const data = [
      ["200", "NMI001", "E1E2", "E1", "N1", "", "KWH", "30", ""],
      ["300", "20230105", "1.0", "2.0"],
    ];

    const result = generateSQLNem12(data);

    expect(result).toHaveLength(1);
    expect(result[0]).toContain("'2023-01-05 00:00:00'");
  });

  it("should generate correct SQL INSERT statement format", () => {
    const data = [
      ["200", "TEST_NMI", "E1E2", "E1", "N1", "", "KWH", "30", ""],
      ["300", "20230101", "10.0", "20.0"],
    ];

    const result = generateSQLNem12(data);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(
      "INSERT INTO meter_readings (nmi, timestamp, consumption) VALUES ('TEST_NMI', '2023-01-01 00:00:00', 30.0000);"
    );
  });
});
