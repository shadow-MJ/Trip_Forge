export function generateInviteCode(destination) {
  const slug = (destination || 'TRIP').replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase() || 'PLAN';
  return `TF-${slug}-${Math.floor(100 + Math.random() * 900)}`;
}
