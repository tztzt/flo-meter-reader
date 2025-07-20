import type { CSVFile } from "@/types";
import { useState } from "react";
import { genNEM12Sql } from "./utils/genNEM12Sql";

interface SQLGeneratorProps {
  file: CSVFile;
}

export const SQLGenerator = (props: SQLGeneratorProps) => {
  const { file } = props;

  const [sql, setSql] = useState<string>("");

  const handleGenerateSQL = () => {
    const sql = genNEM12Sql(file.data);
    setSql(sql.join("\n"));
  };

  const handleExportSQL = () => {
    const sql = genNEM12Sql(file.data);
    const sqlContent = sql.join("\n");

    // Create blob and download link
    const blob = new Blob([sqlContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Set download attributes
    link.href = url;
    link.download = "meter_readings.sql";

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
  };

  const handleClear = () => {
    setSql("");
  };

  return (
    <div className="mt-4">
      <div className="flex gap-12">
        <button
          onClick={handleGenerateSQL}
          className="w-full bg-blue-500 rounded-md p-2 hover:bg-blue-600 hover:cursor-pointer text-white"
        >
          Generate SQL
        </button>
        <button
          onClick={handleExportSQL}
          className="w-full bg-blue-500 rounded-md p-2 hover:bg-blue-600 hover:cursor-pointer text-white"
        >
          Export SQL
        </button>
      </div>

      {sql && (
        <>
          <div className="flex gap-4 mt-4 content-center">
            <div className="text-4xl">Output</div>
            <button
              onClick={handleCopy}
              className="bg-blue-500 rounded-md p-2 hover:bg-blue-600 hover:cursor-pointer text-white"
            >
              Copy all
            </button>
            <button
              onClick={handleClear}
              className="bg-blue-500 rounded-md p-2 hover:bg-blue-600 hover:cursor-pointer text-white"
            >
              Clear
            </button>
          </div>
          <div className="p-4 mt-4 bg-gray-300 border-1 border-black border-radius-1 rounded-md">
            <pre>
              <code>{sql}</code>
            </pre>
          </div>
        </>
      )}
    </div>
  );
};
