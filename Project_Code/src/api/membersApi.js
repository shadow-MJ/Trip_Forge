import apiClient, { cloneData, simulateNetworkDelay } from './client';
import { mockMembersByTrip, mockTrips, pushTripUpdate } from './mockDb';

export async function getMembers(tripId) {
  // TODO: Replace mock response with real REST endpoint:
  // const response = await apiClient.get(`/trips/${tripId}/members`);
  // return response.data;
  void apiClient;
  await simulateNetworkDelay(160);

  return cloneData(mockMembersByTrip[tripId] || []);
}

export async function regenerateInviteCode(tripId, actorName = 'Trip Creator') {
  // TODO: Replace mock regeneration with real REST endpoint:
  // const response = await apiClient.post(`/trips/${tripId}/invite-code`);
  // return response.data;
  await simulateNetworkDelay(180);

  const trip = mockTrips.find((t) => t.id === tripId);
  if (!trip) {
    throw new Error('Trip not found.');
  }

  const slug =
    (trip.destination || 'TRIP')
      .replace(/[^a-zA-Z]/g, '')
      .slice(0, 5)
      .toUpperCase() || 'PLAN';
  const suffix = Math.floor(100 + Math.random() * 900);
  trip.inviteCode = `TF-${slug}-${suffix}`;

  pushTripUpdate(tripId, `${actorName} refreshed the trip invite code`, 'Members', 'members');

  return { inviteCode: trip.inviteCode };
}

export async function removeMember(tripId, memberId) {
  // TODO: Replace mock removal with real REST endpoint:
  // await apiClient.delete(`/trips/${tripId}/members/${memberId}`);
  await simulateNetworkDelay(180);

  const list = mockMembersByTrip[tripId] || [];
  const target = list.find((m) => m.id === memberId);
  if (!target) {
    throw new Error('Member not found.');
  }
  if (target.role === 'Trip Creator') {
    throw new Error('The Trip Creator cannot be removed.');
  }

  mockMembersByTrip[tripId] = list.filter((m) => m.id !== memberId);
  return { removed: true, memberId };
}

