import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Uploader } from "./";
import { MeterDataFileFormat } from "@/types";

// Mock Papa.parse to immediately return fake data
vi.mock("papaparse", async () => {
  return {
    default: {
      parse: vi.fn((_file, options) => {
        options.complete?.({
          data: [
            ["Header1", "Header2"],
            ["Row1Col1", "Row1Col2"],
          ],
        });
      }),
    },
  };
});

// Fake CSV File
const createCsvFile = (name = "test.csv") => {
  return new File(["Header1,Header2\nRow1Col1,Row1Col2"], name, {
    type: "text/csv",
  });
};

describe("Uploader Component", () => {
  let addFileMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    addFileMock = vi.fn();
  });

  it("renders upload label and input", () => {
    render(<Uploader files={[]} addFile={addFileMock} />);
    expect(screen.getByText("Click to upload")).toBeDefined();
    expect(screen.getByText("Only .csv files are supported.")).toBeDefined();
  });

  it("calls addFile when a valid CSV is uploaded", async () => {
    render(<Uploader files={[]} addFile={addFileMock} />);
    const fileInput = screen.getByTestId("csv-uploader");

    const csvFile = createCsvFile();
    await userEvent.upload(fileInput, csvFile);

    await waitFor(() => {
      expect(addFileMock).toHaveBeenCalledWith({
        fileName: "test.csv",
        data: [
          ["Header1", "Header2"],
          ["Row1Col1", "Row1Col2"],
        ],
        fileType: MeterDataFileFormat.NEM12,
      });
    });
  });

  it("disables upload when max files reached", () => {
    render(
      <Uploader
        files={[
          {
            fileName: "existing.csv",
            data: [],
            fileType: MeterDataFileFormat.NEM12,
          },
        ]}
        max={1}
        addFile={addFileMock}
      />
    );
    expect(screen.getByText("Maximum files reached")).toBeDefined();
  });

  it("shows alert if non-csv file is uploaded", async () => {
    window.alert = vi.fn(); // mock alert
    render(<Uploader files={[]} addFile={addFileMock} />);
    const fileInput = screen.getByTestId("csv-uploader");
    const txtFile = new File(["Some text"], "not-csv.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, txtFile);

    expect(window.alert).toHaveBeenCalledWith(
      "Please upload a valid CSV file."
    );
    expect(addFileMock).not.toHaveBeenCalled();
  });
});
