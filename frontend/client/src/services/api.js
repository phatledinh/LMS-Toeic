export const SERVER_URL = 'http://localhost:8080';
export const BASE_URL = `${SERVER_URL}/api/v1`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Có lỗi xảy ra');
  return data;
};

// Auth
export const login = (data) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  }).then(handleResponse);

export const register = (data) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  }).then(handleResponse);

// Sections
export const getSections = () =>
  fetch(`${BASE_URL}/courses/sections`, { headers: getAuthHeaders() }).then(handleResponse);

export const getSectionBySlug = (slug) =>
  fetch(`${BASE_URL}/courses/sections/${slug}`, { headers: getAuthHeaders() }).then(handleResponse);

// Topics
export const getTopicsBySection = (sectionId) =>
  fetch(`${BASE_URL}/courses/topics?sectionId=${sectionId}`, { headers: getAuthHeaders() }).then(handleResponse);

export const getTopicById = (id) =>
  fetch(`${BASE_URL}/courses/topics/${id}`, { headers: getAuthHeaders() }).then(handleResponse);

// Lessons
export const getLessonsByTopic = (topicId) =>
  fetch(`${BASE_URL}/courses/lessons?topicId=${topicId}`, { headers: getAuthHeaders() }).then(handleResponse);

export const getLessonById = (id) =>
  fetch(`${BASE_URL}/courses/lessons/${id}`, { headers: getAuthHeaders() }).then(handleResponse);

// Exercises
export const getExercisesByTopic = (topicId) =>
  fetch(`${BASE_URL}/courses/exercises?topicId=${topicId}`, { headers: getAuthHeaders() }).then(handleResponse);

export const getExerciseDetailById = (id) =>
  fetch(`${BASE_URL}/courses/exercises/${id}`, { headers: getAuthHeaders() }).then(handleResponse);

// Flashcards (Decks)
export const getSystemDecks = () =>
  fetch(`${BASE_URL}/decks/system`, { headers: getAuthHeaders() }).then(handleResponse);

export const getDeckById = (id) =>
  fetch(`${BASE_URL}/decks/${id}`, { headers: getAuthHeaders() }).then(handleResponse);

export const getMyDecks = () =>
  fetch(`${BASE_URL}/decks/my`, { headers: getAuthHeaders() }).then(handleResponse);

export const createMyDeck = (data) =>
  fetch(`${BASE_URL}/decks/my`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const updateMyDeck = (id, data) =>
  fetch(`${BASE_URL}/decks/my/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteMyDeck = (id) =>
  fetch(`${BASE_URL}/decks/my/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

// FlashCards (within a Deck)
export const addFlashCard = (deckId, data) =>
  fetch(`${BASE_URL}/decks/${deckId}/flashcards`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const updateFlashCard = (id, data) =>
  fetch(`${BASE_URL}/flashcards/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteFlashCard = (id) =>
  fetch(`${BASE_URL}/flashcards/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

// TTS (Text-to-Speech)
export const getTtsUrl = (text, lang = 'en') =>
  `${BASE_URL}/tts?text=${encodeURIComponent(text)}&lang=${lang}`;

// Practice
export const getPracticeTopics = (sectionSlug) =>
  fetch(`${BASE_URL}/practice/topics?sectionSlug=${sectionSlug}`, { headers: getAuthHeaders() }).then(handleResponse);

export const getPracticeNextQuestion = (sectionSlug, data) =>
  fetch(`${BASE_URL}/practice/next-question?sectionSlug=${sectionSlug}`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const submitPracticeAnswer = (data) =>
  fetch(`${BASE_URL}/practice/submit`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const getPracticeStats = (sectionSlug) =>
  fetch(`${BASE_URL}/practice/stats?sectionSlug=${sectionSlug}`, { headers: getAuthHeaders() }).then(handleResponse);

export const getPracticeProgress = (sectionSlug, days) =>
  fetch(`${BASE_URL}/practice/progress?sectionSlug=${sectionSlug}&days=${days}`, { headers: getAuthHeaders() }).then(handleResponse);

export const startPracticeSession = () =>
  fetch(`${BASE_URL}/practice/session/start`, {
    method: 'POST', headers: getAuthHeaders(),
  }).then(handleResponse);

export const endPracticeSession = () =>
  fetch(`${BASE_URL}/practice/session/end`, {
    method: 'POST', headers: getAuthHeaders(),
  }).then(handleResponse);
