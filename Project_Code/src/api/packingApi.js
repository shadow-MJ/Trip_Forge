import apiClient, { cloneData, simulateNetworkDelay } from './client';
import { mockMembersByTrip, mockPackingByTrip, pushTripUpdate } from './mockDb';

export async function getPackingItems(tripId) {
  // TODO: Replace mock response with real REST endpoint:
  // const response = await apiClient.get(`/trips/${tripId}/packing`);
  // return response.data;
  void apiClient;
  await simulateNetworkDelay(180);

  return cloneData(mockPackingByTrip[tripId] || []);
}

export async function addPackingItem(tripId, { title, assigneeId }, actorName = 'A member') {
  // TODO: Replace mock creation with real REST endpoint:
  // const response = await apiClient.post(`/trips/${tripId}/packing`, { title, assigneeId });
  // return response.data;
  await simulateNetworkDelay(180);

  if (!mockPackingByTrip[tripId]) {
    mockPackingByTrip[tripId] = [];
  }

  const members = mockMembersByTrip[tripId] || [];
  const assignee = members.find((m) => m.id === assigneeId);

  const newItem = {
    id: `pack-${Date.now()}`,
    title: title.trim(),
    assigneeId: assignee ? assignee.id : '',
    assigneeName: assignee ? assignee.name : 'Unassigned',
    packed: false,
  };

  mockPackingByTrip[tripId].push(newItem);
  pushTripUpdate(tripId, `${actorName} added "${newItem.title}" to Packing`, 'Packing', 'packing');

  return cloneData(newItem);
}

export async function togglePackingItem(tripId, itemId) {
  // TODO: Replace mock toggle with real REST endpoint:
  // const response = await apiClient.patch(`/trips/${tripId}/packing/${itemId}/toggle`);
  // return response.data;
  await simulateNetworkDelay(120);

  const list = mockPackingByTrip[tripId] || [];
  const item = list.find((i) => i.id === itemId);
  if (!item) {
    throw new Error('Packing item not found.');
  }
  item.packed = !item.packed;
  return cloneData(item);
}

export async function assignPackingItem(tripId, itemId, assigneeId) {
  // TODO: Replace mock assignment with real REST endpoint:
  // const response = await apiClient.patch(`/trips/${tripId}/packing/${itemId}`, { assigneeId });
  // return response.data;
  await simulateNetworkDelay(120);

  const list = mockPackingByTrip[tripId] || [];
  const item = list.find((i) => i.id === itemId);
  if (!item) {
    throw new Error('Packing item not found.');
  }

  const members = mockMembersByTrip[tripId] || [];
  const assignee = members.find((m) => m.id === assigneeId);

  item.assigneeId = assignee ? assignee.id : '';
  item.assigneeName = assignee ? assignee.name : 'Unassigned';

  return cloneData(item);
}

export async function deletePackingItem(tripId, itemId) {
  // TODO: Replace mock deletion with real REST endpoint:
  // await apiClient.delete(`/trips/${tripId}/packing/${itemId}`);
  await simulateNetworkDelay(140);

  const list = mockPackingByTrip[tripId] || [];
  const index = list.findIndex((i) => i.id === itemId);
  if (index === -1) {
    throw new Error('Packing item not found.');
  }
  list.splice(index, 1);
  return { deleted: true, id: itemId };
}

