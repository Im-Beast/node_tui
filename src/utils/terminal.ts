export function consoleSize() {
  return {
    columns: process.stdout.columns,
    rows: process.stdout.rows,
  };
}
