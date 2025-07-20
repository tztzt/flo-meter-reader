export const sameRowTypeAsPrev = (
  record: string[],
  index: number,
  data: string[][]
) => index > 0 && data[index - 1][0] !== record[0];
