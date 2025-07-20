import { RecordType } from "@/types";

export const removeHiddenRows = (row: string[]) => {
  return (
    row[0] !== RecordType.EOF &&
    row[0] !== RecordType.INTERVAL_EVENT &&
    row[0] !== RecordType.B2B_DETAILS_RECORD
  );
};
