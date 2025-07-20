export const enum MeterDataFileFormat {
  NEM12 = "NEM12",
  NEM13 = "NEM13",
}

export type CSVFile = {
  fileName: string;
  data: string[][];
  fileType: MeterDataFileFormat;
};

export const enum RecordType {
  HEADER = "100",
  NMI_DATA = "200",
  INTERVAL_DATA = "300",
  INTERVAL_EVENT = "400",
  B2B_DETAILS_RECORD = "500",
  EOF = "900",
}
