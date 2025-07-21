import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SQLGenerator } from "./";
import { MeterDataFileFormat, type CSVFile } from "@/types";

// Mock the utils
vi.mock("./utils/generateSQLNem12", () => ({
  generateSQLNem12: vi.fn(() => ["SQL LINE 1", "SQL LINE 2"]),
}));
vi.mock("./utils/download", () => ({
  handleDownload: vi.fn(),
}));

import { generateSQLNem12 } from "./utils/generateSQLNem12";
import { handleDownload } from "./utils/download";

describe("SQLGenerator", () => {
  const mockFile: CSVFile = {
    fileName: "test.csv",
    fileType: MeterDataFileFormat.NEM12,
    data: [
      ["a", "b"],
      ["c", "d"],
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  it("renders Generate SQL and Export SQL buttons", () => {
    render(<SQLGenerator file={mockFile} />);
    expect(screen.getByText("Generate SQL")).toBeDefined();
    expect(screen.getByText("Export SQL")).toBeDefined();
  });

  it("calls generateSQLNem12 and displays SQL output when Generate SQL is clicked", async () => {
    render(<SQLGenerator file={mockFile} />);

    const generateButton = screen.getByText("Generate SQL");
    await userEvent.click(generateButton);

    expect(generateSQLNem12).toHaveBeenCalledWith(mockFile.data);

    // SQL output should be displayed
    expect(screen.getByText("Output")).toBeDefined();
    expect(screen.getByText(/SQL LINE 1\s*SQL LINE 2/)).toBeDefined();
  });

  it("calls handleDownload when Export SQL is clicked", async () => {
    render(<SQLGenerator file={mockFile} />);
    const exportButton = screen.getByText("Export SQL");
    await userEvent.click(exportButton);

    expect(handleDownload).toHaveBeenCalledWith(mockFile);
  });

  it("copies SQL text to clipboard when Copy all is clicked", async () => {
    render(<SQLGenerator file={mockFile} />);

    // Generate SQL first to display output and enable Copy button
    await userEvent.click(screen.getByText("Generate SQL"));

    const copyButton = screen.getByText("Copy all");
    await userEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "SQL LINE 1\nSQL LINE 2"
    );
  });

  it("clears SQL output when Clear is clicked", async () => {
    render(<SQLGenerator file={mockFile} />);
    await userEvent.click(screen.getByText("Generate SQL"));

    expect(screen.getByText("Output")).toBeDefined();

    const clearButton = screen.getByText("Clear");
    await userEvent.click(clearButton);

    // Output section should disappear after clearing
    expect(screen.queryByText("Output")).toBeNull();
  });
});
