import apiClient, { cloneData, simulateNetworkDelay } from './client';
import { mockNotifications, notifyUnreadBadgeSync } from './mockDb';

export async function getNotifications() {
  // TODO: Replace mock response with real REST endpoint:
  // const response = await apiClient.get('/notifications');
  // return response.data;
  void apiClient;
  await simulateNetworkDelay(160);

  return cloneData(mockNotifications);
}

export async function getUnreadNotificationCount() {
  // TODO: Replace mock count with real REST endpoint:
  // const response = await apiClient.get('/notifications/unread-count');
  // return response.data;
  await simulateNetworkDelay(80);

  return mockNotifications.filter((n) => !n.read).length;
}

export async function markNotificationAsRead(notificationId) {
  // TODO: Replace mock update with real REST endpoint:
  // const response = await apiClient.patch(`/notifications/${notificationId}/read`);
  // return response.data;
  await simulateNetworkDelay(100);

  const target = mockNotifications.find((n) => n.id === notificationId);
  if (target) {
    target.read = true;
    notifyUnreadBadgeSync();
  }
  return cloneData(target || null);
}

export async function markAllNotificationsAsRead() {
  // TODO: Replace mock update with real REST endpoint:
  // await apiClient.patch('/notifications/read-all');
  await simulateNetworkDelay(120);

  mockNotifications.forEach((n) => {
    n.read = true;
  });
  notifyUnreadBadgeSync();
  return cloneData(mockNotifications);
}

