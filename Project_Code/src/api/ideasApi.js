import apiClient, { cloneData, simulateNetworkDelay } from './client';
import { mockIdeasByTrip, pushTripUpdate } from './mockDb';

export async function getIdeas(tripId) {
  // TODO: Replace mock response with real REST endpoint:
  // const response = await apiClient.get(`/trips/${tripId}/ideas`);
  // return response.data;
  void apiClient;
  await simulateNetworkDelay(180);

  return cloneData(mockIdeasByTrip[tripId] || []);
}

export async function createIdea(tripId, payload, user) {
  // TODO: Replace mock creation with real REST endpoint:
  // const response = await apiClient.post(`/trips/${tripId}/ideas`, payload);
  // return response.data;
  await simulateNetworkDelay(200);

  if (!mockIdeasByTrip[tripId]) {
    mockIdeasByTrip[tripId] = [];
  }

  const newIdea = {
    id: `idea-${Date.now()}`,
    title: payload.title.trim(),
    location: payload.location?.trim() || '',
    estimatedCost: Number(payload.estimatedCost) || 0,
    notes: payload.notes?.trim() || '',
    authorId: user.id,
    authorName: user.name,
    votes: { [user.id]: 1 },
    addedToItinerary: false,
    createdAt: new Date().toISOString(),
  };

  mockIdeasByTrip[tripId].unshift(newIdea);
  pushTripUpdate(tripId, `${user.name} suggested idea "${newIdea.title}"`, 'Idea', 'ideas');

  return cloneData(newIdea);
}

export async function voteIdea(tripId, ideaId, userId, value) {
  // TODO: Replace mock vote with real REST endpoint:
  // const response = await apiClient.post(`/trips/${tripId}/ideas/${ideaId}/vote`, { value });
  // return response.data;
  await simulateNetworkDelay(120);

  const list = mockIdeasByTrip[tripId] || [];
  const idea = list.find((item) => item.id === ideaId);
  if (!idea) {
    throw new Error('Idea not found.');
  }

  const currentVote = idea.votes[userId] || 0;
  if (currentVote === value) {
    delete idea.votes[userId];
  } else {
    idea.votes[userId] = value;
  }

  return cloneData(idea);
}

export async function markIdeaAddedToItinerary(tripId, ideaId) {
  // TODO: Replace with real REST endpoint:
  // const response = await apiClient.patch(`/trips/${tripId}/ideas/${ideaId}`, { addedToItinerary: true });
  // return response.data;
  await simulateNetworkDelay(120);

  const list = mockIdeasByTrip[tripId] || [];
  const idea = list.find((item) => item.id === ideaId);
  if (!idea) {
    throw new Error('Idea not found.');
  }
  idea.addedToItinerary = true;
  return cloneData(idea);
}

