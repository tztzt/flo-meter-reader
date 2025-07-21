const constructSummaryData = (data: string[][]) => {
  const records = new Map<string, number[]>();

  let currentNMI = "";
  let currentKey = "";
  let intervalLength = 30; // default

  for (const row of data) {
    const rowType = row[0];

    if (rowType === "200") {
      currentNMI = row[1];
      intervalLength = parseInt(row[-2]) || 30;
    }

    if (rowType === "300" && currentNMI) {
      const date = row[1]; // e.g., 20050301
      currentKey = `${currentNMI}~${date}`;

      const length = 1440 / intervalLength;

      for (let i = 0; i < length; i++) {
        const value = row[i + 2];
        if (!value || isNaN(parseFloat(value))) continue;
        if (!records.has(currentKey)) {
          records.set(currentKey, [parseFloat(value)]);
        } else {
          records.get(currentKey)?.push(parseFloat(value));
        }
      }
    }
  }

  const insertStatements: string[][] = [];

  for (const [key, values] of records) {
    const [nmi, date] = key.split("~");
    const consumption = values.reduce((a, b) => a + b, 0).toFixed(4);
    insertStatements.push([nmi, date, consumption]);
  }

  return insertStatements;
};

export const SummaryView = (props: { data: string[][] }) => {
  const { data } = props;
  const summaryData = constructSummaryData(data);

  return (
    <div data-testid="summary-view">
      <table className="w-1/2 text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left border border-gray-300 p-2">NMI</th>
            <th className="text-left border border-gray-300 p-2">Date</th>
            <th className="text-right border border-gray-300 p-2">
              Consumption
            </th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border border-gray-300 p-2">{row[0]}</td>
              <td className="border border-gray-300 p-2">{row[1]}</td>
              <td className="text-right border border-gray-300 p-2">
                {row[2]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
