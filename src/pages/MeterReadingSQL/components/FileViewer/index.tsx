import { MeterDataFileFormat, type CSVFile } from "@/types";
import CloseIcon from "@/assets/close.svg?react";
import { useState } from "react";
import { SQLGenerator } from "../SQLGenerator";
import { useSyncState } from "@/hooks";
import { Title } from "./Title";
import { TableRow } from "./Row";
import { SummaryView } from "./SummaryView";
import { removeHiddenRows } from "./utils/removeHiddenRows";

interface CSVViewerProps {
  file: CSVFile;
  onDelete: () => void;
}

export const FileViewer = (props: CSVViewerProps) => {
  const { file, onDelete } = props;
  const { fileName, data, fileType } = file;
  const [showRawData, setShowRawData] = useSyncState(`showRawData`);
  const [hoverDelete, setHoverDelete] = useState(false);

  const filteredData = data.filter(removeHiddenRows);
  const wrapperStyle = hoverDelete
    ? "rounded-lg  p-4 bg-red-300/20 border border-red-500"
    : "rounded-lg  p-4 border border-gray-200";

  if (fileType === MeterDataFileFormat.NEM12) {
    return (
      <div className={wrapperStyle}>
        <div className="flex">
          <Title
            fileName={fileName}
            showRawData={showRawData}
            setShowRawData={setShowRawData}
          />
          <button
            className="w-8 h-8 rounded-full ml-auto flex items-center justify-center hover:bg-gray-400 active:bg-gray-500 transition-colors duration-200 hover:cursor-pointer"
            onClick={onDelete}
            onMouseEnter={() => setHoverDelete(true)}
            onMouseLeave={() => setHoverDelete(false)}
          >
            <CloseIcon className=" white" />
          </button>
        </div>
        {showRawData ? (
          <div className="overflow-x-auto  rounded">
            <table className="table-auto min-w-full text-sm border-collapse border border-gray-100">
              <tbody>
                {filteredData.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    rowData={row}
                    index={rowIndex}
                    data={filteredData}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <SummaryView data={data} />
        )}
        <SQLGenerator file={file} />
      </div>
    );
  }

  console.error(`Error ${fileType} not supported yet.`);

  return null;
};
