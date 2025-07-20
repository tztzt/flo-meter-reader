import Papa from "papaparse";
import UploadIcon from "@/assets/upload.svg?react";
import { MeterDataFileFormat, type CSVFile } from "@/types";

interface UploaderProps {
  files: CSVFile[];
  max?: number;
  addFile: (files: CSVFile) => void;
}

export const Uploader = (props: UploaderProps) => {
  const { files, addFile, max = 1 } = props;

  const allowUpload = max > files.length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          addFile({
            fileName: file.name,
            data: results.data as string[][],
            fileType: MeterDataFileFormat.NEM12,
          });
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    } else {
      alert("Please upload a valid CSV file.");
    }
    e.target.value = ""; // Reset file input so the same file can be uploaded again
  };

  return (
    <div className="flex items-center justify-center w-full my-8">
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center w-128 h-32 border-2 border-dashed rounded-lg ${
          allowUpload
            ? "border-gray-300 cursor-pointer bg-gray-50 hover:bg-gray-100"
            : "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <p className={`my-2 ${!allowUpload && "opacity-50"}`}>
            <UploadIcon />
          </p>
          <div
            className={`my-2 text-sm ${
              !allowUpload ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {allowUpload ? (
              <div className="flex flex-col items-center">
                <span className="font-semibold text-center">
                  Click to upload
                </span>
                <div className="text-xs">Only .csv files are supported.</div>
              </div>
            ) : (
              <span>Maximum files reached</span>
            )}
          </div>
        </div>
        <input
          disabled={!allowUpload}
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};
