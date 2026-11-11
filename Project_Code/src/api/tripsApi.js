import apiClient, { cloneData, simulateNetworkDelay } from './client';
import {
  mockDiscussionByTrip,
  mockExpensesByTrip,
  mockIdeasByTrip,
  mockItineraryByTrip,
  mockJoinableTrips,
  mockJoinRequestsByTrip,
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
  const pendingRequests = mockJoinRequestsByTrip[trip.id] || [];
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
    pendingRequestsCount: pendingRequests.length,
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

  const members = mockMembersByTrip[trip.id] || [];
  const isMember = members.some((m) => m.id === userId) || trip.createdBy === userId;

  if (!isMember) {
    const pendingRequests = mockJoinRequestsByTrip[trip.id] || [];
    const isPending = pendingRequests.some((r) => r.userId === userId);
    if (isPending) {
      throw new Error(
        'Your request to join this trip has been submitted and is currently pending approval by the Trip Creator.'
      );
    }
    throw new Error('You do not have access to this private trip workspace.');
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

export async function requestJoinTripByCode(inviteCode, user) {
  // TODO: Replace mock invite join with real REST endpoint:
  // const response = await apiClient.post('/trips/join-request', { inviteCode });
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
    throw new Error('You are already an active member of this trip.');
  }

  if (!mockJoinRequestsByTrip[trip.id]) {
    mockJoinRequestsByTrip[trip.id] = [];
  }

  const alreadyPending = mockJoinRequestsByTrip[trip.id].some((r) => r.userId === user.id);
  if (alreadyPending) {
    throw new Error(
      `You already submitted a join request for "${trip.name}". Awaiting Trip Creator approval.`
    );
  }

  const newRequest = {
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    tripId: trip.id,
    tripName: trip.name,
    destination: trip.destination,
    userId: user.id,
    name: user.name,
    email: user.email,
    status: 'pending',
    requestedAt: new Date().toISOString(),
  };

  mockJoinRequestsByTrip[trip.id].push(newRequest);

  pushTripUpdate(
    trip.id,
    `${user.name} requested to join the trip with invite code ${trip.inviteCode}`,
    'Members',
    'members',
    trip.name
  );

  return {
    status: 'pending',
    request: cloneData(newRequest),
    trip: {
      id: trip.id,
      name: trip.name,
      destination: trip.destination,
      inviteCode: trip.inviteCode,
    },
    message: `Join request submitted for "${trip.name}"! The Trip Creator must approve before you can access the workspace.`,
  };
}

export async function joinTripByCode(inviteCode, user) {
  return requestJoinTripByCode(inviteCode, user);
}

export async function getUserPendingRequests(userId) {
  // TODO: Replace with real REST endpoint:
  // const response = await apiClient.get('/users/me/join-requests');
  // return response.data;
  await simulateNetworkDelay(140);

  const results = [];
  for (const tripId of Object.keys(mockJoinRequestsByTrip)) {
    const list = mockJoinRequestsByTrip[tripId] || [];
    for (const req of list) {
      if (req.userId === userId) {
        results.push(req);
      }
    }
  }

  return cloneData(results);
}

export async function cancelUserPendingRequest(requestId, userId) {
  // TODO: Replace with real REST endpoint:
  // const response = await apiClient.delete(`/users/me/join-requests/${requestId}`);
  // return response.data;
  await simulateNetworkDelay(160);

  for (const tripId of Object.keys(mockJoinRequestsByTrip)) {
    const list = mockJoinRequestsByTrip[tripId] || [];
    const index = list.findIndex((r) => r.id === requestId && r.userId === userId);
    if (index !== -1) {
      const [removed] = list.splice(index, 1);
      return { canceled: true, request: cloneData(removed) };
    }
  }

  throw new Error('Pending join request not found or already cancelled.');
}

export async function getRecentUpdates(tripId) {
  // TODO: Replace with real REST endpoint:
  // const response = await apiClient.get(`/trips/${tripId}/updates`);
  // return response.data;
  await simulateNetworkDelay(150);

  return cloneData(mockUpdatesByTrip[tripId] || []);
}

