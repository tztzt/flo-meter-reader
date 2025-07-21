import { render, screen } from "@testing-library/react";
import { SummaryView } from "../SummaryView";
import { describe, it, expect } from "vitest";

describe("SummaryView Component", () => {
  it("renders a summary row with correct NMI, date, and consumption", () => {
    const data: string[][] = [
      ["200", "NMI123", "other", "values", "here", "30"], // intervalLength = 30
      ["300", "20250721", "1.5", "2.5", "3.0", "bad", ""], // 3 values, 1 invalid, 1 missing
    ];

    render(<SummaryView data={data} />);

    // Check table headers
    expect(screen.getByText("NMI")).toBeDefined();
    expect(screen.getByText("Date")).toBeDefined();
    expect(screen.getByText("Consumption")).toBeDefined();

    // Check rendered values
    expect(screen.getByText("NMI123")).toBeDefined();
    expect(screen.getByText("20250721")).toBeDefined();
    expect(screen.getByText("7.0000")).toBeDefined(); // 1.5 + 2.5 + 3.0
  });

  it("skips invalid or non-numeric values in interval data", () => {
    const data: string[][] = [
      ["200", "NMI456", "blah", "blah", "blah", "30"],
      ["300", "20250721", "5.0", "notANumber", "", "2.0"], // only 5.0 and 2.0 count
    ];

    render(<SummaryView data={data} />);

    expect(screen.getByText("NMI456")).toBeDefined();
    expect(screen.getByText("20250721")).toBeDefined();
    expect(screen.getByText("7.0000")).toBeDefined(); // 5.0 + 2.0
  });

  it("uses default intervalLength if value is missing or invalid", () => {
    const data: string[][] = [
      ["200", "NMI789"], // intervalLength should default to 30
      ["300", "20250721", "2.0", "2.0"], // just 2 values for 48 slots — fine for test
    ];

    render(<SummaryView data={data} />);

    expect(screen.getByText("NMI789")).toBeDefined();
    expect(screen.getByText("20250721")).toBeDefined();
    expect(screen.getByText("4.0000")).toBeDefined(); // 2.0 + 2.0
  });

  it("renders nothing if no 300 records are present", () => {
    const data: string[][] = [["200", "NMI000", "x", "y", "z", "30"]];

    render(<SummaryView data={data} />);

    expect(screen.queryByText("NMI000")).toBeNull();
  });
});
