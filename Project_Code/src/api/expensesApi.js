import apiClient, { cloneData, simulateNetworkDelay } from './client';
import { formatCurrency } from '../utils/formatters';
import { mockExpensesByTrip, mockMembersByTrip, pushTripUpdate } from './mockDb';

export async function getExpenses(tripId) {
  // TODO: Replace mock response with real REST endpoint:
  // const response = await apiClient.get(`/trips/${tripId}/expenses`);
  // return response.data;
  void apiClient;
  await simulateNetworkDelay(180);

  return cloneData(mockExpensesByTrip[tripId] || []);
}

export async function addExpense(tripId, payload, actorName = 'A member') {
  // TODO: Replace mock creation with real REST endpoint:
  // const response = await apiClient.post(`/trips/${tripId}/expenses`, payload);
  // return response.data;
  await simulateNetworkDelay(200);

  if (!mockExpensesByTrip[tripId]) {
    mockExpensesByTrip[tripId] = [];
  }

  const members = mockMembersByTrip[tripId] || [];
  const payer = members.find((m) => m.id === payload.payerId);

  const newExpense = {
    id: `exp-${Date.now()}`,
    title: payload.title.trim(),
    amount: Number(payload.amount),
    payerId: payload.payerId,
    payerName: payer?.name || payload.payerName || 'Member',
    participantIds: payload.participantIds,
    date: payload.date || new Date().toISOString().slice(0, 10),
  };

  mockExpensesByTrip[tripId].unshift(newExpense);
  pushTripUpdate(
    tripId,
    `${actorName} added expense "${newExpense.title}" (${formatCurrency(newExpense.amount)})`,
    'Expense',
    'expenses'
  );

  return cloneData(newExpense);
}

export async function deleteExpense(tripId, expenseId) {
  // TODO: Replace mock deletion with real REST endpoint:
  // await apiClient.delete(`/trips/${tripId}/expenses/${expenseId}`);
  await simulateNetworkDelay(160);

  const list = mockExpensesByTrip[tripId] || [];
  const index = list.findIndex((e) => e.id === expenseId);
  if (index === -1) {
    throw new Error('Expense not found.');
  }
  list.splice(index, 1);
  return { deleted: true, id: expenseId };
}

