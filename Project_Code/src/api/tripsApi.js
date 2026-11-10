import apiClient, { cloneData, simulateNetworkDelay } from './client';
import {
  mockDiscussionByTrip,
  mockExpensesByTrip,
  mockIdeasByTrip,
  mockItineraryByTrip,
  mockJoinableTrips,
  mockMembersByTrip,
  mockPackingByTrip,
  mockPollsByTrip,
  mockTrips,
  mockUpdatesByTrip,
  pushTripUpdate,
} from './mockDb';

function enrichTripForUser(trip, userId) {
  const members = mockMembersByTrip[trip.id] || [];
  const membership = members.find((m) => m.id === userId);
  const expenses = mockExpensesByTrip[trip.id] || [];
  const itinerary = mockItineraryByTrip[trip.id] || [];
  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  return {
    ...trip,
    memberCount: members.length,
    membersPreview: members.slice(0, 4).map(({ id, name }) => ({ id, name })),
    activityCount: itinerary.length,
    totalSpent,
    userRole: membership ? membership.role : 'Trip Member',
  };
}

export async function getTrips(userId) {
  // TODO: Replace mock response with real REST endpoint:
  // const response = await apiClient.get('/trips');
  // return response.data;
  void apiClient;
  await simulateNetworkDelay(220);

  const userTrips = mockTrips.filter((trip) => {
    const members = mockMembersByTrip[trip.id] || [];
    return members.some((m) => m.id === userId) || trip.createdBy === userId;
  });

  return cloneData(userTrips.map((trip) => enrichTripForUser(trip, userId)));
}

export async function getTripById(tripId, userId) {
  // TODO: Replace mock response with real REST endpoint:
  // const response = await apiClient.get(`/trips/${tripId}`);
  // return response.data;
  await simulateNetworkDelay(160);

  const trip = mockTrips.find((t) => t.id === tripId);
  if (!trip) {
    throw new Error('Trip not found.');
  }

  return cloneData(enrichTripForUser(trip, userId));
}

export async function createTrip(payload, user) {
  // TODO: Replace mock creation with real REST endpoint:
  // const response = await apiClient.post('/trips', payload);
  // return response.data;
  await simulateNetworkDelay(240);

  const randomCode = Math.floor(100 + Math.random() * 900);
  const slug = (payload.destination || 'TRIP')
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 5)
    .toUpperCase() || 'PLAN';

  const newTrip = {
    id: `trip-${Date.now()}`,
    name: payload.name.trim(),
    destination: payload.destination.trim(),
    startDate: payload.startDate,
    endDate: payload.endDate,
    budget: Number(payload.budget) || 0,
    description: payload.description?.trim() || '',
    inviteCode: `TF-${slug}-${randomCode}`,
    createdBy: user.id,
    createdAt: new Date().toISOString(),
    coordinates: null,
  };

  mockTrips.unshift(newTrip);
  mockMembersByTrip[newTrip.id] = [
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'Trip Creator',
      joinedAt: new Date().toISOString(),
    },
  ];
  mockItineraryByTrip[newTrip.id] = [];
  mockIdeasByTrip[newTrip.id] = [];
  mockPollsByTrip[newTrip.id] = [];
  mockExpensesByTrip[newTrip.id] = [];
  mockDiscussionByTrip[newTrip.id] = [];
  mockPackingByTrip[newTrip.id] = [];
  mockUpdatesByTrip[newTrip.id] = [
    {
      id: `upd-${Date.now()}`,
      text: `${user.name} created the trip workspace`,
      createdAt: new Date().toISOString(),
    },
  ];

  return cloneData(enrichTripForUser(newTrip, user.id));
}

export async function updateTrip(tripId, updates, user) {
  // TODO: Replace mock update with real REST endpoint:
  // const response = await apiClient.patch(`/trips/${tripId}`, updates);
  // return response.data;
  await simulateNetworkDelay(200);

  const index = mockTrips.findIndex((t) => t.id === tripId);
  if (index === -1) {
    throw new Error('Trip not found.');
  }

  mockTrips[index] = {
    ...mockTrips[index],
    name: updates.name !== undefined ? updates.name.trim() : mockTrips[index].name,
    destination:
      updates.destination !== undefined
        ? updates.destination.trim()
        : mockTrips[index].destination,
    startDate: updates.startDate || mockTrips[index].startDate,
    endDate: updates.endDate || mockTrips[index].endDate,
    budget: updates.budget !== undefined ? Number(updates.budget) : mockTrips[index].budget,
    description:
      updates.description !== undefined
        ? updates.description.trim()
        : mockTrips[index].description,
  };

  pushTripUpdate(tripId, `${user?.name || 'A member'} updated trip details`, 'Trip', 'overview');

  return cloneData(enrichTripForUser(mockTrips[index], user?.id));
}

export async function deleteTrip(tripId) {
  // TODO: Replace mock delete with real REST endpoint:
  // await apiClient.delete(`/trips/${tripId}`);
  await simulateNetworkDelay(200);

  const index = mockTrips.findIndex((t) => t.id === tripId);
  if (index === -1) {
    throw new Error('Trip not found.');
  }
  mockTrips.splice(index, 1);
  return { deleted: true, id: tripId };
}

export async function joinTripByCode(inviteCode, user) {
  // TODO: Replace mock invite join with real REST endpoint:
  // const response = await apiClient.post('/trips/join', { inviteCode });
  // return response.data;
  await simulateNetworkDelay(240);

  const normalized = inviteCode.trim().toUpperCase();
  if (!normalized) {
    throw new Error('Please enter an invite code.');
  }

  let trip = mockTrips.find((t) => t.inviteCode.toUpperCase() === normalized);

  if (!trip) {
    const joinableIdx = mockJoinableTrips.findIndex(
      (t) => t.inviteCode.toUpperCase() === normalized
    );
    if (joinableIdx !== -1) {
      trip = mockJoinableTrips.splice(joinableIdx, 1)[0];
      mockTrips.unshift(trip);
    }
  }

  if (!trip) {
    throw new Error('No trip matches that invite code. Try 6767.');
  }

  if (!mockMembersByTrip[trip.id]) {
    mockMembersByTrip[trip.id] = [];
  }

  const alreadyMember = mockMembersByTrip[trip.id].some((m) => m.id === user.id);
  if (alreadyMember) {
    throw new Error('You are already a member of this trip.');
  }

  mockMembersByTrip[trip.id].push({
    id: user.id,
    name: user.name,
    email: user.email,
    role: 'Trip Member',
    joinedAt: new Date().toISOString(),
  });

  pushTripUpdate(trip.id, `${user.name} joined the trip`, 'Members', 'members', trip.name);

  return cloneData(enrichTripForUser(trip, user.id));
}

export async function getRecentUpdates(tripId) {
  // TODO: Replace with real REST endpoint:
  // const response = await apiClient.get(`/trips/${tripId}/updates`);
  // return response.data;
  await simulateNetworkDelay(150);

  return cloneData(mockUpdatesByTrip[tripId] || []);
}

