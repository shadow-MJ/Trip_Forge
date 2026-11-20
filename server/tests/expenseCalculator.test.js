import { describe, it, expect } from 'vitest';
import { calculateExpenseSummary } from '../src/utils/expenseCalculator.js';

describe('expense calculator', () => {
  it('splits cents with the leftover-cent rule', () => {
    const result = calculateExpenseSummary([
      { payerId:'u1', payerName:'One', amountCents:100, participantIds:['u1','u2','u3'] },
    ], [{id:'u1',name:'One'}, {id:'u2',name:'Two'}, {id:'u3',name:'Three'}]);
    expect(result.totalSpent).toBe(1);
    expect(Math.round(result.balances.find(b=>b.memberId==='u1').share * 100)).toBe(34);
    expect(Math.round(result.balances.find(b=>b.memberId==='u2').share * 100)).toBe(33);
    expect(Math.round(result.balances.find(b=>b.memberId==='u3').share * 100)).toBe(33);
  });
});
