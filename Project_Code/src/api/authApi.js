import apiClient, { AUTH_TOKEN_KEY, cloneData, simulateNetworkDelay } from './client';
import { mockUsers } from './mockDb';

const ACTIVE_USER_KEY = 'tripforge_user';

export async function login({ email, password }) {
  // TODO: Replace mock login with real REST endpoint:
  // const response = await apiClient.post('/auth/login', { email, password });
  // return response.data;
  void apiClient;
  await simulateNetworkDelay(260);

  const normalizedEmail = email.trim().toLowerCase();
  const matched = mockUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!matched || matched.password !== password) {
    throw new Error('Invalid email or password. Try ranatonmoy33@gmail.com / tonmoy1234.');
  }

  const safeUser = {
    id: matched.id,
    name: matched.name,
    email: matched.email,
    bio: matched.bio,
    university: matched.university,
    department: matched.department || '',
    createdAt: matched.createdAt,
  };
  const token = `mock-jwt-${matched.id}-${Date.now()}`;

  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(safeUser));
  } catch {
    // Ignore storage access errors
  }

  return { user: cloneData(safeUser), token };
}

export async function register({
  name,
  email,
  password,
  university = '',
  department = '',
}) {
  // TODO: Replace mock registration with real REST endpoint:
  // const response = await apiClient.post('/auth/register', { name, email, password, university, department });
  // return response.data;
  await simulateNetworkDelay(280);

  const normalizedEmail = email.trim().toLowerCase();
  const exists = mockUsers.some((u) => u.email.toLowerCase() === normalizedEmail);
  if (exists) {
    throw new Error('An account with this email address already exists.');
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    bio: 'Ready to plan the next group trip.',
    university: university.trim(),
    department: department.trim(),
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);

  const safeUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    bio: newUser.bio,
    university: newUser.university,
    department: newUser.department,
    createdAt: newUser.createdAt,
  };
  const token = `mock-jwt-${newUser.id}-${Date.now()}`;

  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(safeUser));
  } catch {
    // Ignore storage access errors
  }

  return { user: cloneData(safeUser), token };
}

export async function getCurrentUser() {
  // TODO: Replace with real REST endpoint:
  // const response = await apiClient.get('/auth/me');
  // return response.data;
  await simulateNetworkDelay(100);

  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const saved = localStorage.getItem(ACTIVE_USER_KEY);
    if (!token || !saved) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export async function updateProfile(userId, updates) {
  // TODO: Replace with real REST endpoint:
  // const response = await apiClient.patch('/auth/profile', updates);
  // return response.data;
  await simulateNetworkDelay(200);

  const idx = mockUsers.findIndex((u) => u.id === userId);
  if (idx !== -1) {
    mockUsers[idx] = {
      ...mockUsers[idx],
      name: updates.name?.trim() || mockUsers[idx].name,
      bio: updates.bio !== undefined ? updates.bio.trim() : mockUsers[idx].bio,
      university:
        updates.university !== undefined ? updates.university.trim() : mockUsers[idx].university,
      department:
        updates.department !== undefined
          ? updates.department.trim()
          : mockUsers[idx].department || '',
    };
  }

  let currentSaved = null;
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    currentSaved = raw ? JSON.parse(raw) : null;
  } catch {
    currentSaved = null;
  }

  const nextUser = {
    ...(currentSaved || {}),
    id: userId,
    name: updates.name?.trim() || currentSaved?.name || 'TripForge User',
    email: currentSaved?.email || mockUsers[idx]?.email || '',
    bio: updates.bio !== undefined ? updates.bio.trim() : currentSaved?.bio || '',
    university:
      updates.university !== undefined
        ? updates.university.trim()
        : currentSaved?.university || '',
    department:
      updates.department !== undefined
        ? updates.department.trim()
        : currentSaved?.department || '',
    createdAt: currentSaved?.createdAt || new Date().toISOString(),
  };

  try {
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(nextUser));
  } catch {
    // Ignore storage access errors
  }

  return cloneData(nextUser);
}

export async function logout() {
  // TODO: Replace with real REST endpoint if server revokes tokens:
  // await apiClient.post('/auth/logout');
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(ACTIVE_USER_KEY);
  } catch {
    // Ignore storage access errors
  }
}

