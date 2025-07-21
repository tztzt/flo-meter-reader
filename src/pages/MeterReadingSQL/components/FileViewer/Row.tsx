import { sameRowTypeAsPrev } from "./utils/sameRowTypeAsPrev";
import { isValidValue } from "./utils/isValidValue";
import { RecordType } from "@/types";
import { getNimInterval } from "./utils/getNimInterval";

const headersList = {
  [RecordType.HEADER]: [
    "Record Indicator",
    "Version Header",
    "Date Time",
    "From Participant",
    "To Participant",
  ],
  [RecordType.NMI_DATA]: [
    "Record Indicator",
    "NMI",
    "NMI Configuration",
    "Register ID",
    "NMI Suffix",
    "MDM Data Stream Identifier",
    "Meter Serial Number",
    "UOM",
    "Interval Length",
    "Next Scheduled Read Date",
  ],
  [RecordType.INTERVAL_DATA]: [
    "Record Indicator",
    "Interval Date",
    "Interval Value",
    "Quality Method",
    "Reason Code",
    // temporarily omit
    // "Reason Description",
    "Update Date Time",
    "MSATS Load Date Time",
  ],
  [RecordType.INTERVAL_EVENT]: [
    "Record Indicator",
    "Start Interval",
    "End Interval",
    "Quality Method",
    "Reason Code",
    // "Reason Description",
  ],
  [RecordType.B2B_DETAILS_RECORD]: [
    "Record Indicator",
    "Transaction Code",
    "Retail Service Order",
    "Read Date Time",
    "Index Read",
  ],
  [RecordType.EOF]: ["Record Indicator"],
} as const;

const getIntervalDataHeaders = (length: number) => [
  "Record Indicator",
  "Interval Date",
  ...Array.from({ length }, (_, i) => {
    if (!i) return `Interval Values ${i + 1}`;
    else return `${i + 1}`;
  }),
  "Quality Method",
  "Reason Code",
  // temporarily omit
  // "Reason Description",
  "Update Date Time",
  "MSATS Load Date Time",
];

const CustomTD = ({ value }: { value?: string | number }) => (
  <td className="px-4 py-2 border border-gray-300">{value || ""}</td>
);

export const TableRow = ({
  rowData,
  index,
  data,
}: {
  rowData: string[];
  index: number;
  data: string[][];
}) => {
  const showHeader = index === 0 || sameRowTypeAsPrev(rowData, index, data);

  const filteredRow =
    rowData[0] === RecordType.INTERVAL_DATA
      ? rowData
      : rowData.filter(isValidValue);

  // for data interval rows, we need to check the NIM data to infer the number of interval data cells
  const nimInterval = getNimInterval(data, index);
  const length = nimInterval ? 1440 / nimInterval : 1;

  return (
    <>
      {showHeader && (
        <tr
          key={`header-${index}`}
          className="font-bold bg-gray-100"
          data-testid="table-row-header"
        >
          {(rowData[0] as RecordType) === RecordType.INTERVAL_DATA
            ? getIntervalDataHeaders(length).map((value, colIndex) => {
                return <CustomTD key={colIndex} value={value} />;
              })
            : headersList[rowData[0] as RecordType]?.map((value, colIndex) => {
                return <CustomTD key={colIndex} value={value} />;
              })}
        </tr>
      )}
      <tr key={index} data-testid="table-row-data">
        {filteredRow.map((value, colIndex) => (
          <CustomTD key={colIndex} value={value} />
        ))}
      </tr>
    </>
  );
};
