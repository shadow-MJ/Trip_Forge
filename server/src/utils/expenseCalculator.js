export function calculateExpenseSummary(expenses = [], members = []) {
  const map = new Map(members.map((m) => [m.id, { memberId: m.id, name: m.name, paidCents: 0, shareCents: 0, netCents: 0 }]));
  let totalCents = 0;
  for (const expense of expenses) {
    const amountCents = Number(expense.amountCents ?? Math.round(Number(expense.amount || 0) * 100));
    if (!amountCents) continue;
    totalCents += amountCents;
    if (!map.has(expense.payerId)) map.set(expense.payerId, { memberId: expense.payerId, name: expense.payerName || 'Former member', paidCents: 0, shareCents: 0, netCents: 0 });
    map.get(expense.payerId).paidCents += amountCents;
    const participants = Array.isArray(expense.participantIds) && expense.participantIds.length ? expense.participantIds : members.map((m) => m.id);
    const base = Math.floor(amountCents / participants.length);
    let remainder = amountCents - base * participants.length;
    for (const id of participants) {
      if (!map.has(id)) map.set(id, { memberId: id, name: 'Member', paidCents: 0, shareCents: 0, netCents: 0 });
      map.get(id).shareCents += base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
    }
  }
  const balances = [...map.values()].map((b) => {
    b.netCents = b.paidCents - b.shareCents;
    return { memberId: b.memberId, name: b.name, paid: b.paidCents / 100, share: b.shareCents / 100, net: b.netCents / 100, netCents: b.netCents };
  });
  const debtors = balances.filter((b) => b.netCents < 0).map((b) => ({ memberId: b.memberId, name: b.name, amountCents: -b.netCents })).sort((a,b) => b.amountCents-a.amountCents);
  const creditors = balances.filter((b) => b.netCents > 0).map((b) => ({ memberId: b.memberId, name: b.name, amountCents: b.netCents })).sort((a,b) => b.amountCents-a.amountCents);
  const settlements = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amountCents = Math.min(debtors[i].amountCents, creditors[j].amountCents);
    settlements.push({ id: `${debtors[i].memberId}-${creditors[j].memberId}`, fromId: debtors[i].memberId, fromName: debtors[i].name, toId: creditors[j].memberId, toName: creditors[j].name, amount: amountCents / 100 });
    debtors[i].amountCents -= amountCents; creditors[j].amountCents -= amountCents;
    if (!debtors[i].amountCents) i++; if (!creditors[j].amountCents) j++;
  }
  return { totalSpent: totalCents / 100, balances, settlements };
}
