import { FileViewer } from "@/pages/MeterReadingSQL/components/FileViewer";
import { Uploader } from "@/components/Uploader";
import type { CSVFile } from "@/types";
import { useState } from "react";

export const MeterReadingSQL = () => {
  const maxFiles = 1;
  const [data, setData] = useState<CSVFile[]>([]);

  const canUpload = data.length < maxFiles;

  const handleAddFile = (file: CSVFile) => {
    setData((prevData) => [...prevData, file]);
  };

  const handleDeleteFile = (index: number) => {
    setData((prevData) => prevData.filter((_f, i) => i !== index));
  };

  return (
    <div className="shadow-lg rounded-lg h-full">
      {canUpload && (
        <div className="shadow-lg rounded-lg p-8 bg-flo-bg-3">
          <h1 className="text-4xl font-bold mb-6 text-center text-flo-text-1">
            Upload Meter Readings
          </h1>

          <Uploader addFile={handleAddFile} files={data} />
        </div>
      )}
      {data.length > 0 && (
        <div className="shadow-lg rounded-lg p-8 bg-flo-bg-3">
          {data.map((file, i) => (
            <FileViewer
              file={file}
              key={i}
              onDelete={() => handleDeleteFile(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
