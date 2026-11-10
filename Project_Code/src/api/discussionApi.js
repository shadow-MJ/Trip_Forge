import apiClient, { cloneData, simulateNetworkDelay } from './client';
import { mockDiscussionByTrip, mockMembersByTrip, pushTripUpdate } from './mockDb';

export async function getDiscussionPosts(tripId) {
  // TODO: Replace mock response with real REST endpoint:
  // const response = await apiClient.get(`/trips/${tripId}/discussion`);
  // return response.data;
  void apiClient;
  await simulateNetworkDelay(220);

  return cloneData(mockDiscussionByTrip[tripId] || []);
}

export async function createDiscussionPost(tripId, content, user) {
  // TODO: Replace mock creation with real REST endpoint:
  // const response = await apiClient.post(`/trips/${tripId}/discussion`, { content });
  // return response.data;
  await simulateNetworkDelay(200);

  if (!mockDiscussionByTrip[tripId]) {
    mockDiscussionByTrip[tripId] = [];
  }

  const members = mockMembersByTrip[tripId] || [];
  const membership = members.find((m) => m.id === user.id);

  const newPost = {
    id: `post-${Date.now()}`,
    authorId: user.id,
    authorName: user.name,
    authorRole: membership ? membership.role : 'Trip Member',
    content: content.trim(),
    createdAt: new Date().toISOString(),
    replies: [],
  };

  mockDiscussionByTrip[tripId].unshift(newPost);
  pushTripUpdate(tripId, `${user.name} posted a new note in Discussion`, 'Discussion', 'discussion');

  return cloneData(newPost);
}

export async function addDiscussionReply(tripId, postId, content, user) {
  // TODO: Replace mock reply with real REST endpoint:
  // const response = await apiClient.post(`/trips/${tripId}/discussion/${postId}/replies`, { content });
  // return response.data;
  await simulateNetworkDelay(180);

  const posts = mockDiscussionByTrip[tripId] || [];
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    throw new Error('Discussion post not found.');
  }

  const members = mockMembersByTrip[tripId] || [];
  const membership = members.find((m) => m.id === user.id);

  const reply = {
    id: `rep-${Date.now()}`,
    authorId: user.id,
    authorName: user.name,
    authorRole: membership ? membership.role : 'Trip Member',
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  post.replies.push(reply);
  pushTripUpdate(
    tripId,
    `${user.name} replied to ${post.authorName}'s post in Discussion`,
    'Discussion',
    'discussion'
  );

  return cloneData(reply);
}

