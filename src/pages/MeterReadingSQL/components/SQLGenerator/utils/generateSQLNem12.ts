/**
 * Assume that dates given from the NEM12 data follow UTC+08
 */
const toSQLTimestamp = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-based
  const day = pad(date.getDate());

  return `${year}-${month}-${day} 00:00:00`;
};

export function generateSQLNem12(data: string[][]): string[] {
  const records = new Map<string, number[]>();

  let currentNMI = "";
  let currentKey = "";
  let intervalLength = 30; // default

  for (const row of data) {
    const rowType = row[0];

    if (rowType === "200") {
      currentNMI = row[1];

      const unsafeIntervalValue = row[row.length - 2]; // safely get second last
      const parsed = parseInt(unsafeIntervalValue);
      intervalLength = isNaN(parsed) ? 30 : parsed;
    }

    if (rowType === "300" && currentNMI) {
      const dateStr = row[1]; // e.g., 20050301
      const baseDate = new Date(
        parseInt(dateStr.slice(0, 4)),
        parseInt(dateStr.slice(4, 6)) - 1,
        parseInt(dateStr.slice(6, 8))
      );
      const timestamp = toSQLTimestamp(baseDate);

      currentKey = `${currentNMI}~${timestamp}`;

      const length = 1440 / intervalLength;

      for (let i = 0; i < length; i++) {
        const value = row[i + 2];
        if (!value || isNaN(parseFloat(value))) continue;
        const v = parseFloat(value);
        if (!records.has(currentKey)) {
          records.set(currentKey, [v]);
        } else {
          records.get(currentKey)?.push(v);
        }
      }
    }
  }
  const insertStatements: string[] = [];

  for (const [key, values] of records) {
    const [nmi, timestamp] = key.split("~");

    const consumption = values.reduce((a, b) => a + b, 0);
    insertStatements.push(
      `INSERT INTO meter_readings (nmi, timestamp, consumption) VALUES ('${nmi}', '${timestamp}', ${consumption.toFixed(
        4
      )});`
    );
  }

  return insertStatements;
}
