import apiClient, { cloneData, simulateNetworkDelay } from './client';
import { mockPollsByTrip, pushTripUpdate } from './mockDb';

export async function getPolls(tripId) {
  // TODO: Replace mock response with real REST endpoint:
  // const response = await apiClient.get(`/trips/${tripId}/polls`);
  // return response.data;
  void apiClient;
  await simulateNetworkDelay(180);

  return cloneData(mockPollsByTrip[tripId] || []);
}

export async function createPoll(tripId, { question, options }, user) {
  // TODO: Replace mock creation with real REST endpoint:
  // const response = await apiClient.post(`/trips/${tripId}/polls`, { question, options });
  // return response.data;
  await simulateNetworkDelay(200);

  if (!mockPollsByTrip[tripId]) {
    mockPollsByTrip[tripId] = [];
  }

  const cleanOptions = options
    .map((opt) => opt.trim())
    .filter(Boolean)
    .map((text, index) => ({
      id: `opt-${Date.now()}-${index}`,
      text,
      voterIds: [],
    }));

  if (cleanOptions.length < 2) {
    throw new Error('Please provide at least two poll options.');
  }

  const newPoll = {
    id: `poll-${Date.now()}`,
    question: question.trim(),
    createdBy: user.id,
    createdByName: user.name,
    status: 'open',
    createdAt: new Date().toISOString(),
    options: cleanOptions,
  };

  mockPollsByTrip[tripId].unshift(newPoll);
  pushTripUpdate(tripId, `${user.name} created poll "${newPoll.question}"`, 'Poll', 'polls');

  return cloneData(newPoll);
}

export async function votePoll(tripId, pollId, optionId, userId) {
  // TODO: Replace mock vote with real REST endpoint:
  // const response = await apiClient.post(`/trips/${tripId}/polls/${pollId}/vote`, { optionId });
  // return response.data;
  await simulateNetworkDelay(140);

  const list = mockPollsByTrip[tripId] || [];
  const poll = list.find((p) => p.id === pollId);
  if (!poll) {
    throw new Error('Poll not found.');
  }
  if (poll.status === 'closed') {
    throw new Error('This poll is closed.');
  }

  const alreadyVoted = poll.options.some((opt) => opt.voterIds.includes(userId));
  if (alreadyVoted) {
    throw new Error('You have already voted in this poll.');
  }

  const targetOption = poll.options.find((opt) => opt.id === optionId);
  if (!targetOption) {
    throw new Error('Poll option not found.');
  }

  targetOption.voterIds.push(userId);
  return cloneData(poll);
}

export async function closePoll(tripId, pollId, actorName = 'A member') {
  // TODO: Replace mock close with real REST endpoint:
  // const response = await apiClient.patch(`/trips/${tripId}/polls/${pollId}/close`);
  // return response.data;
  await simulateNetworkDelay(160);

  const list = mockPollsByTrip[tripId] || [];
  const poll = list.find((p) => p.id === pollId);
  if (!poll) {
    throw new Error('Poll not found.');
  }

  poll.status = 'closed';
  pushTripUpdate(tripId, `${actorName} closed poll "${poll.question}"`, 'Poll', 'polls');

  return cloneData(poll);
}

