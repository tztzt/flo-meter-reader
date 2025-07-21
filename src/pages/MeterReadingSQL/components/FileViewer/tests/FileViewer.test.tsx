import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FileViewer } from "..";
import { MeterDataFileFormat, type CSVFile } from "@/types";

// Stub subcomponents (we only care if they render)
vi.mock("./Title", () => ({
  Title: ({ fileName }: { fileName: string }) => <div>{fileName}</div>,
}));

vi.mock("./SummaryView", () => ({
  SummaryView: ({ data }: { data: string[][] }) => (
    <div data-testid="summary-view">{`Summary (${data.length} rows)`}</div>
  ),
}));

vi.mock("./Row", () => ({
  TableRow: ({ rowData }: { rowData: string[] }) => (
    <tr data-testid="table-row">
      {rowData.map((cell, i) => (
        <td key={i}>{cell}</td>
      ))}
    </tr>
  ),
}));

vi.mock("../SQLGenerator", () => ({
  SQLGenerator: () => <div data-testid="sql-generator">SQL Output</div>,
}));

vi.mock("./utils/removeHiddenRows", () => ({
  removeHiddenRows: () => true, // let all rows through
}));

// Mock the useSyncState hook
vi.mock("@/hooks", () => ({
  useSyncState: vi.fn(),
}));

import { useSyncState } from "@/hooks";

describe("FileViewer", () => {
  const testFile: CSVFile = {
    fileName: "sample.csv",
    fileType: MeterDataFileFormat.NEM12,
    data: [
      ["row1-col1", "row1-col2"],
      ["row2-col1", "row2-col2"],
    ],
  };

  const setup = (syncStateValue: boolean = false) => {
    const mockSet = vi.fn();
    (useSyncState as jest.Mock).mockReturnValue([syncStateValue, mockSet]);

    const onDelete = vi.fn();
    render(<FileViewer file={testFile} onDelete={onDelete} />);
    return { onDelete, mockSet };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders file name and delete button", () => {
    setup();
    expect(screen.getByText("sample.csv")).toBeDefined();
    expect(screen.getByTestId("delete-button")).toBeDefined();
  });

  it("calls onDelete when delete button is clicked", () => {
    const { onDelete } = setup();
    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalled();
  });

  it("renders SummaryView when showRawData is false", () => {
    setup(false);
    expect(screen.getByTestId("summary-view")).toBeDefined();
    expect(screen.queryByTestId("raw-data-table")).toBeNull();
  });

  it("renders raw table when showRawData is true", () => {
    setup(true);
    expect(screen.queryByTestId("raw-data-table")).toBeDefined();
    expect(screen.queryByTestId("summary-view")).toBeNull();
  });

  it("renders SQLGenerator always", () => {
    setup();
    expect(screen.queryByTestId("sql-generator")).toBeDefined();
  });

  it("returns null and logs error for unsupported file type", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <FileViewer
        file={{ ...testFile, fileType: "unknown" as MeterDataFileFormat }}
        onDelete={vi.fn()}
      />
    );

    expect(screen.queryByText("sample.csv")).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith("Error unknown not supported yet.");
  });
});
