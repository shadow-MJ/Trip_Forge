/**
 * Computes total spent, per-member paid/owed/net balances, and simplified
 * "who pays whom" transfers using integer cents to prevent floating-point drift.
 */
export function calculateExpenseSummary(expenses = [], members = []) {
  const memberMap = new Map();
  members.forEach((member) => {
    memberMap.set(member.id, {
      memberId: member.id,
      name: member.name,
      paidCents: 0,
      shareCents: 0,
      netCents: 0,
    });
  });

  let totalCents = 0;

  expenses.forEach((expense) => {
    const amountCents = Math.round(Number(expense.amount || 0) * 100);
    if (amountCents <= 0) return;
    totalCents += amountCents;

    if (!memberMap.has(expense.payerId)) {
      memberMap.set(expense.payerId, {
        memberId: expense.payerId,
        name: expense.payerName || 'Former member',
        paidCents: 0,
        shareCents: 0,
        netCents: 0,
      });
    }
    memberMap.get(expense.payerId).paidCents += amountCents;

    const participants = Array.isArray(expense.participantIds) && expense.participantIds.length > 0
      ? expense.participantIds
      : members.map((m) => m.id);

    if (participants.length === 0) return;

    const baseShare = Math.floor(amountCents / participants.length);
    let remainder = amountCents - baseShare * participants.length;

    participants.forEach((participantId) => {
      if (!memberMap.has(participantId)) {
        memberMap.set(participantId, {
          memberId: participantId,
          name: 'Member',
          paidCents: 0,
          shareCents: 0,
          netCents: 0,
        });
      }
      const extra = remainder > 0 ? 1 : 0;
      if (remainder > 0) remainder -= 1;
      memberMap.get(participantId).shareCents += baseShare + extra;
    });
  });

  const balances = Array.from(memberMap.values()).map((entry) => {
    const netCents = entry.paidCents - entry.shareCents;
    return {
      memberId: entry.memberId,
      name: entry.name,
      paid: entry.paidCents / 100,
      share: entry.shareCents / 100,
      net: netCents / 100,
      netCents,
    };
  });

  // Simplify debts: pair debtors (netCents < 0) with creditors (netCents > 0)
  const debtors = balances
    .filter((b) => b.netCents < 0)
    .map((b) => ({ memberId: b.memberId, name: b.name, amountCents: -b.netCents }))
    .sort((a, b) => b.amountCents - a.amountCents);

  const creditors = balances
    .filter((b) => b.netCents > 0)
    .map((b) => ({ memberId: b.memberId, name: b.name, amountCents: b.netCents }))
    .sort((a, b) => b.amountCents - a.amountCents);

  const settlements = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const transferCents = Math.min(debtor.amountCents, creditor.amountCents);

    if (transferCents > 0) {
      settlements.push({
        id: `${debtor.memberId}-${creditor.memberId}`,
        fromId: debtor.memberId,
        fromName: debtor.name,
        toId: creditor.memberId,
        toName: creditor.name,
        amount: transferCents / 100,
      });
    }

    debtor.amountCents -= transferCents;
    creditor.amountCents -= transferCents;

    if (debtor.amountCents === 0) i += 1;
    if (creditor.amountCents === 0) j += 1;
  }

  return {
    totalSpent: totalCents / 100,
    balances,
    settlements,
  };
}

