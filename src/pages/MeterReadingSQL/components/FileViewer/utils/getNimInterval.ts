import { RecordType } from "@/types";

/**
 * Get NIM interval of current row by searching for previous RecordType.NMI_DATA
 */
export function getNimInterval(data: string[][], index: number) {
  return (
    data
      .slice(0, index)
      .reverse()
      .find((ele) => ele[0] === RecordType.NMI_DATA)
      ?.filter((ele) => Boolean(ele))
      ?.at(-2) || "30"
  );
}
