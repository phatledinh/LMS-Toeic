export const SERVER_URL = 'http://localhost:8080';
export const BASE_URL = `${SERVER_URL}/api/v1`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const loginApi = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Có lỗi xảy ra');
  return json;
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

// ========== Sections ==========
export const getSections = () => fetch(`${BASE_URL}/courses/sections`, { headers: getAuthHeaders() }).then(handleResponse);
export const getSectionBySlug = (slug) => fetch(`${BASE_URL}/courses/sections/${slug}`, { headers: getAuthHeaders() }).then(handleResponse);

// ========== Topics ==========
export const getTopicsBySection = (sectionId) => fetch(`${BASE_URL}/courses/topics?sectionId=${sectionId}`, { headers: getAuthHeaders() }).then(handleResponse);
export const getTopicById = (id) => fetch(`${BASE_URL}/courses/topics/${id}`, { headers: getAuthHeaders() }).then(handleResponse);

// ========== Lessons ==========
export const getLessonsByTopic = (topicId) => fetch(`${BASE_URL}/courses/lessons?topicId=${topicId}`, { headers: getAuthHeaders() }).then(handleResponse);
export const getLessonById = (id) => fetch(`${BASE_URL}/courses/lessons/${id}`, { headers: getAuthHeaders() }).then(handleResponse);

// ========== Exercises ==========
export const getExercisesByTopic = (topicId) => fetch(`${BASE_URL}/courses/exercises?topicId=${topicId}`, { headers: getAuthHeaders() }).then(handleResponse);
export const getExerciseDetailById = (id) => fetch(`${BASE_URL}/courses/exercises/${id}`, { headers: getAuthHeaders() }).then(handleResponse);

// ========== Admin: Sections ==========
export const adminCreateSection = (data) =>
  fetch(`${BASE_URL}/admin/courses/sections`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminUpdateSection = (id, data) =>
  fetch(`${BASE_URL}/admin/courses/sections/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminDeleteSection = (id) =>
  fetch(`${BASE_URL}/admin/courses/sections/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

// ========== Admin: Topics ==========
export const adminCreateTopic = (sectionId, data) =>
  fetch(`${BASE_URL}/admin/courses/topics`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ ...data, sectionId }),
  }).then(handleResponse);

export const adminUpdateTopic = (id, data) =>
  fetch(`${BASE_URL}/admin/courses/topics/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminDeleteTopic = (id) =>
  fetch(`${BASE_URL}/admin/courses/topics/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

// ========== Admin: Exercises ==========
export const adminCreateExercise = (topicId, data) =>
  fetch(`${BASE_URL}/admin/courses/exercises`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ ...data, topicId }),
  }).then(handleResponse);

export const adminUpdateExercise = (id, data) =>
  fetch(`${BASE_URL}/admin/courses/exercises/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminDeleteExercise = (id) =>
  fetch(`${BASE_URL}/admin/courses/exercises/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

export const adminAddQuestion = (exerciseId, data) =>
  fetch(`${BASE_URL}/admin/courses/questions`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ ...data, exerciseId }),
  }).then(handleResponse);

export const adminDeleteQuestion = (questionId) =>
  fetch(`${BASE_URL}/admin/courses/questions/${questionId}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

// ========== Admin: Exercise Question Groups ==========
export const adminAddQuestionGroup = (exerciseId, data) =>
  fetch(`${BASE_URL}/admin/courses/question-groups`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ ...data, exerciseId }),
  }).then(handleResponse);

export const adminUpdateQuestionGroup = (groupId, data) =>
  fetch(`${BASE_URL}/admin/courses/question-groups/${groupId}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminDeleteQuestionGroup = (groupId) =>
  fetch(`${BASE_URL}/admin/courses/question-groups/${groupId}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

// ========== Admin: Lessons ==========
export const adminCreateLesson = (topicId, data) =>
  fetch(`${BASE_URL}/admin/courses/lessons`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ ...data, topicId }),
  }).then(handleResponse);

export const adminUpdateLesson = (id, data) =>
  fetch(`${BASE_URL}/admin/courses/lessons/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminDeleteLesson = (id) =>
  fetch(`${BASE_URL}/admin/courses/lessons/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

// ========== Decks (Flashcard Lists) ==========
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

// ========== FlashCards (within a Deck) ==========
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

// ========== TTS (Text-to-Speech) ==========
export const getTtsUrl = (text, lang = 'en') =>
  `${BASE_URL}/tts?text=${encodeURIComponent(text)}&lang=${lang}`;

// ========== File Upload ==========
export const uploadAudio = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${SERVER_URL}/api/admin/media/audio`, {
    method: 'POST',
    headers: {
      ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
    },
    body: formData,
  }).then(handleResponse);

  return response.data ?? response;
};

export const getAudioJob = async (jobId) => {
  const response = await fetch(`${SERVER_URL}/api/admin/media/audio/jobs/${jobId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  }).then(handleResponse);

  return response.data ?? response;
};

export const uploadFile = async (file, fileName) => {
  const formData = new FormData();
  formData.append('file', file);
  if (fileName) formData.append('fileName', fileName);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
    },
    body: formData,
  }).then(handleResponse);

  return response.data ?? response;
};

// ========== Admin: Decks & Flashcards ==========
export const adminCreateSystemDeck = (data) =>
  fetch(`${BASE_URL}/admin/decks`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminUpdateSystemDeck = (id, data) =>
  fetch(`${BASE_URL}/admin/decks/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminDeleteSystemDeck = (id) =>
  fetch(`${BASE_URL}/admin/decks/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

export const adminAddSystemFlashcard = (deckId, data) =>
  fetch(`${BASE_URL}/admin/decks/${deckId}/flashcards`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminUpdateSystemFlashcard = (id, data) =>
  fetch(`${BASE_URL}/admin/flashcards/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminDeleteSystemFlashcard = (id) =>
  fetch(`${BASE_URL}/admin/flashcards/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);
