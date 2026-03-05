export function normalizeAmount(value: unknown): number {
  const raw = String(value ?? "").trim();
  // If only comma is present, treat it as decimal separator; otherwise remove commas as thousand separators
  const normalized = raw.includes(',') && !raw.includes('.')
    ? raw.replace(',', '.')
    : raw.replace(/,/g, '');
  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
}

export function formatAmount(value: number | string | null | undefined): string {
  const num = normalizeAmount(value ?? 0);
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
}

export function handleAmountKeyPress(event: KeyboardEvent) {
  const allowed = /[0-9.,]/;
  if (!allowed.test(event.key)) {
    event.preventDefault();
  }
}
