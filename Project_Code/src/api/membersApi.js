import apiClient, { cloneData, simulateNetworkDelay } from './client';
import {
  mockJoinRequestsByTrip,
  mockMembersByTrip,
  mockTrips,
  pushTripUpdate,
} from './mockDb';

export async function getMembers(tripId) {
  // TODO: Replace mock response with real REST endpoint:
  // const response = await apiClient.get(`/trips/${tripId}/members`);
  // return response.data;
  void apiClient;
  await simulateNetworkDelay(160);

  return cloneData(mockMembersByTrip[tripId] || []);
}

export async function getPendingJoinRequests(tripId) {
  // TODO: Replace with real REST endpoint:
  // const response = await apiClient.get(`/trips/${tripId}/join-requests`);
  // return response.data;
  await simulateNetworkDelay(120);
  return cloneData(mockJoinRequestsByTrip[tripId] || []);
}

export async function approveJoinRequest(tripId, requestId, approverName = 'Trip Creator') {
  // TODO: Replace with real REST endpoint:
  // const response = await apiClient.post(`/trips/${tripId}/join-requests/${requestId}/approve`);
  // return response.data;
  await simulateNetworkDelay(180);

  const requests = mockJoinRequestsByTrip[tripId] || [];
  const reqIndex = requests.findIndex((r) => r.id === requestId);
  if (reqIndex === -1) {
    throw new Error('Join request not found or already processed.');
  }

  const [req] = requests.splice(reqIndex, 1);

  if (!mockMembersByTrip[tripId]) {
    mockMembersByTrip[tripId] = [];
  }

  const alreadyMember = mockMembersByTrip[tripId].some((m) => m.id === req.userId);
  let newMember = null;
  if (!alreadyMember) {
    newMember = {
      id: req.userId,
      name: req.name,
      email: req.email,
      role: 'Trip Member',
      joinedAt: new Date().toISOString(),
    };
    mockMembersByTrip[tripId].push(newMember);
  }

  pushTripUpdate(
    tripId,
    `${approverName} approved ${req.name}'s request to join the trip`,
    'Members',
    'members'
  );

  return { approved: true, member: newMember, request: req };
}

export async function rejectJoinRequest(tripId, requestId, approverName = 'Trip Creator') {
  // TODO: Replace with real REST endpoint:
  // const response = await apiClient.post(`/trips/${tripId}/join-requests/${requestId}/reject`);
  // return response.data;
  await simulateNetworkDelay(160);

  const requests = mockJoinRequestsByTrip[tripId] || [];
  const reqIndex = requests.findIndex((r) => r.id === requestId);
  if (reqIndex === -1) {
    throw new Error('Join request not found or already processed.');
  }

  const [req] = requests.splice(reqIndex, 1);
  pushTripUpdate(
    tripId,
    `${approverName} declined a join request from ${req.name}`,
    'Members',
    'members'
  );

  return { rejected: true, requestId };
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
