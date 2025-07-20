import { RecordType } from "@/types";

/**
 * Get NIM interval of current row by searching for previous RecordType.NMI_DATA
 */
export function getNimInterval(data: string[][], index: number) {
  const reversedData = data.slice(0, index).reverse();
  const lastNmiRow = reversedData.find((ele) => ele[0] === RecordType.NMI_DATA);

  // Interval length is usually at index 8 (9th column), per NEM12
  const unsafeNimInterval = lastNmiRow?.[8];

  return unsafeNimInterval && !isNaN(parseInt(unsafeNimInterval))
    ? parseInt(unsafeNimInterval)
    : 30; // default fallback
}
