import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TableRow } from "../Row";
import { RecordType } from "@/types";

// Mock utilities
vi.mock("../utils/sameRowTypeAsPrev", () => ({
  sameRowTypeAsPrev: vi.fn(() => true),
}));

vi.mock("../utils/isValidValue", () => ({
  isValidValue: vi.fn(() => true),
}));

vi.mock("../utils/getNimInterval", () => ({
  getNimInterval: vi.fn(() => 30), // 48 intervals per day
}));

import { sameRowTypeAsPrev } from "../utils/sameRowTypeAsPrev";
import { isValidValue } from "../utils/isValidValue";
import { getNimInterval } from "../utils/getNimInterval";

describe("TableRow", () => {
  const mockData = [
    [RecordType.HEADER, "1", "2", "3", "4", "5"],
    [RecordType.HEADER, "1", "2", "3", "4", "5"],
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header row when index is 0", () => {
    render(
      <table>
        <tbody>
          <TableRow rowData={mockData[0]} index={0} data={mockData} />
        </tbody>
      </table>
    );

    expect(screen.getByText("Record Indicator")).toBeDefined();
    expect(screen.getByText("Version Header")).toBeDefined();
  });

  it("skips header row if sameRowTypeAsPrev returns false", () => {
    (sameRowTypeAsPrev as jest.Mock).mockReturnValueOnce(false);

    render(
      <table>
        <tbody>
          <TableRow rowData={mockData[1]} index={1} data={mockData} />
        </tbody>
      </table>
    );

    expect(screen.queryByTestId("table-row-header")).toBeNull();
  });

  it("filters out empty values from rowData", () => {
    const row = [RecordType.NMI_DATA, "mockData1", "", "mockData2"];

    // Filter out empty strings only
    (isValidValue as jest.Mock).mockImplementation((val) => val !== "");

    render(
      <table>
        <tbody>
          <TableRow rowData={row} index={0} data={[row]} />
        </tbody>
      </table>
    );

    // Assert the valid data appears
    expect(screen.getByText("200")).toBeDefined();
    expect(screen.getByText("mockData1")).toBeDefined();
    expect(screen.getByText("mockData2")).toBeDefined();

    // Assert the number of <td> matches filtered values
    const tr = screen.getByTestId("table-row-data");
    const cells = tr.querySelectorAll("td");
    expect(cells).toHaveLength(3); // filtered out the empty one
  });

  it("renders dynamic interval headers based on getNimInterval", () => {
    const intervalRow = [
      RecordType.INTERVAL_DATA,
      "2025-01-01",
      ...Array(48).fill("100"),
      "A",
      "01",
      "now",
      "now",
    ];
    (getNimInterval as jest.Mock).mockReturnValue(30); // 48 intervals

    render(
      <table>
        <tbody>
          <TableRow rowData={intervalRow} index={0} data={[intervalRow]} />
        </tbody>
      </table>
    );

    expect(screen.getByText("Interval Values 1")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined(); // index 2 header
    expect(screen.getByText("Quality Method")).toBeDefined();
  });
});
