export function formatCurrency(amount) {
  const numeric = Number(amount);
  const safeValue = Number.isFinite(numeric)
    ? Math.abs(numeric) < 0.005
      ? 0
      : numeric
    : 0;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: safeValue % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(safeValue);
  return `৳${formatted}`;
}

export function formatExactCurrency(amount) {
  const numeric = Number(amount);
  const safeValue = Number.isFinite(numeric)
    ? Math.abs(numeric) < 0.005
      ? 0
      : numeric
    : 0;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue);
  return `৳${formatted}`;
}

export function getInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function pluralize(count, singular, pluralForm) {
  const plural = pluralForm || `${singular}s`;
  return `${count} ${count === 1 ? singular : plural}`;
}
