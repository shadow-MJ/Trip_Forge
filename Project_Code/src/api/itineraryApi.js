import apiClient, { cloneData, simulateNetworkDelay } from './client';
import { mockItineraryByTrip, pushTripUpdate } from './mockDb';

export async function getItinerary(tripId) {
  // TODO: Replace mock response with real REST endpoint:
  // const response = await apiClient.get(`/trips/${tripId}/itinerary`);
  // return response.data;
  void apiClient;
  await simulateNetworkDelay(200);

  return cloneData(mockItineraryByTrip[tripId] || []);
}

export async function addActivity(tripId, activity, actorName = 'A member') {
  // TODO: Replace mock creation with real REST endpoint:
  // const response = await apiClient.post(`/trips/${tripId}/itinerary`, activity);
  // return response.data;
  await simulateNetworkDelay(200);

  if (!mockItineraryByTrip[tripId]) {
    mockItineraryByTrip[tripId] = [];
  }

  const newActivity = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    day: Number(activity.day) || 1,
    title: activity.title.trim(),
    time: activity.time || '09:00',
    location: activity.location?.trim() || '',
    cost: Number(activity.cost) || 0,
    notes: activity.notes?.trim() || '',
  };

  mockItineraryByTrip[tripId].push(newActivity);
  pushTripUpdate(
    tripId,
    `${actorName} added "${newActivity.title}" to Day ${newActivity.day}`,
    'Itinerary',
    'itinerary'
  );

  return cloneData(newActivity);
}

export async function updateActivity(tripId, activityId, updates, actorName = 'A member') {
  // TODO: Replace mock update with real REST endpoint:
  // const response = await apiClient.patch(`/trips/${tripId}/itinerary/${activityId}`, updates);
  // return response.data;
  await simulateNetworkDelay(180);

  const list = mockItineraryByTrip[tripId] || [];
  const index = list.findIndex((item) => item.id === activityId);
  if (index === -1) {
    throw new Error('Activity not found.');
  }

  list[index] = {
    ...list[index],
    day: updates.day !== undefined ? Number(updates.day) : list[index].day,
    title: updates.title !== undefined ? updates.title.trim() : list[index].title,
    time: updates.time !== undefined ? updates.time : list[index].time,
    location:
      updates.location !== undefined ? updates.location.trim() : list[index].location,
    cost: updates.cost !== undefined ? Number(updates.cost) || 0 : list[index].cost,
    notes: updates.notes !== undefined ? updates.notes.trim() : list[index].notes,
  };

  pushTripUpdate(
    tripId,
    `${actorName} updated itinerary item "${list[index].title}"`,
    'Itinerary',
    'itinerary'
  );

  return cloneData(list[index]);
}

export async function deleteActivity(tripId, activityId) {
  // TODO: Replace mock deletion with real REST endpoint:
  // await apiClient.delete(`/trips/${tripId}/itinerary/${activityId}`);
  await simulateNetworkDelay(160);

  const list = mockItineraryByTrip[tripId] || [];
  const index = list.findIndex((item) => item.id === activityId);
  if (index === -1) {
    throw new Error('Activity not found.');
  }
  list.splice(index, 1);
  return { deleted: true, id: activityId };
}

export async function reorderDayActivity(tripId, day, activityId, direction) {
  // TODO: Replace with real REST endpoint:
  // const response = await apiClient.patch(`/trips/${tripId}/itinerary/reorder`, { day, activityId, direction });
  // return response.data;
  await simulateNetworkDelay(100);

  const list = mockItineraryByTrip[tripId] || [];
  const dayIndices = [];
  list.forEach((item, idx) => {
    if (item.day === day) dayIndices.push(idx);
  });

  const posInDay = dayIndices.findIndex((idx) => list[idx].id === activityId);
  if (posInDay === -1) return cloneData(list);

  const swapWithPos = direction === 'up' ? posInDay - 1 : posInDay + 1;
  if (swapWithPos < 0 || swapWithPos >= dayIndices.length) {
    return cloneData(list);
  }

  const idxA = dayIndices[posInDay];
  const idxB = dayIndices[swapWithPos];
  const temp = list[idxA];
  list[idxA] = list[idxB];
  list[idxB] = temp;

  return cloneData(list);
}

