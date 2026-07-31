const vnd = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

/** Formats a VND amount, e.g. -150000 -> "-150.000 ₫". */
export function formatVnd(amount: number): string {
  return vnd.format(amount);
}
