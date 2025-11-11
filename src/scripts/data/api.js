import { getAccessToken } from '../utils/auth';
import { BASE_URL } from '../config';

const ENDPOINTS = {
  // AUTH
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,

  // STORIES
  STORIES: `${BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  STORY_GUEST: `${BASE_URL}/stories/guest`,

  // NOTIFICATIONS
  SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
};

// ======================= AUTH =======================

export async function registerUser({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const json = await response.json();
  return { ...json, ok: response.ok };
}

export async function loginUser({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();
  return { ...json, ok: response.ok };
}

// ======================= STORIES =======================

export async function getAllStories({ page = 1, size = 100, location = 0 } = {}) {
  const token = getAccessToken();
  const url = new URL(ENDPOINTS.STORIES);
  url.searchParams.set('page', page);
  url.searchParams.set('size', size);
  url.searchParams.set('location', location);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await response.json();
  return { ...json, ok: response.ok };
}

export async function getStoryDetail(id) {
  const token = getAccessToken();

  const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await response.json();
  return { ...json, ok: response.ok };
}

export async function addNewStory({ description, photo, lat, lon }) {
  const token = getAccessToken();
  const formData = new FormData();

  formData.append('description', description);
  formData.append('photo', photo);
  if (lat) formData.append('lat', lat);
  if (lon) formData.append('lon', lon);

  const response = await fetch(ENDPOINTS.STORIES, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const json = await response.json();
  return { ...json, ok: response.ok };
}

export async function addNewStoryGuest({ description, photo, lat, lon }) {
  const formData = new FormData();

  formData.append('description', description);
  formData.append('photo', photo);
  if (lat) formData.append('lat', lat);
  if (lon) formData.append('lon', lon);

  const response = await fetch(ENDPOINTS.STORY_GUEST, {
    method: 'POST',
    body: formData,
  });

  const json = await response.json();
  return { ...json, ok: response.ok };
}

// ======================= NOTIFICATIONS =======================

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const token = getAccessToken();
  const body = JSON.stringify({ endpoint, keys: { p256dh, auth } });

  const response = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  const json = await response.json();
  return { ...json, ok: response.ok };
}

export async function unsubscribePushNotification({ endpoint }) {
  const token = getAccessToken();
  const body = JSON.stringify({ endpoint });

  const response = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  const json = await response.json();
  return { ...json, ok: response.ok };
}
