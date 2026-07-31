/** Vietnamese thousands grouping, e.g. 150000 -> "150.000". */
export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount);
}

/** Fine balance shown as a negative amount, e.g. 150000 -> "-150.000". */
export function formatFine(amount: number): string {
  return amount === 0 ? "0" : `-${formatVnd(amount)}`;
}
