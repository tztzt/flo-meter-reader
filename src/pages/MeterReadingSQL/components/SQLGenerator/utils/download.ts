import type { CSVFile } from "@/types";
import { generateSQLNem12 } from "./generateSQLNem12";

export function handleDownload(file: CSVFile) {
  const sql = generateSQLNem12(file.data);
  const sqlContent = sql.join("\n");
  const blob = new Blob([sqlContent], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "meter_readings.sql";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
