export function bdToPaise(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value < 0) throw new Error('Invalid amount');
  return Math.round(value * 100);
}
export function paiseToBd(paise) { return Number(paise || 0) / 100; }
