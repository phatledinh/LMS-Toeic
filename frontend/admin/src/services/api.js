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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const mockResponse = async (data) => {
  await delay(100);
  return { data };
};
const mockSuccess = async () => {
  await delay(100);
  return { message: "Success" };
};

// ========== MOCK DATA ==========
let MOCK_SECTIONS = [
  { id: 1, title: 'Toeic Test 1', description: 'Test 1', slug: 'toeic-test-1', orderIndex: 1 },
  { id: 2, title: 'Toeic Test 2', description: 'Test 2', slug: 'toeic-test-2', orderIndex: 2 }
];

let MOCK_TOPICS = [
  { id: 1, sectionId: 1, title: 'Listening Part 1', slug: 'part-1', orderIndex: 1 },
  { id: 2, sectionId: 1, title: 'Listening Part 2', slug: 'part-2', orderIndex: 2 }
];

let MOCK_LESSONS = [
  { id: 1, topicId: 1, title: 'Lesson 1', content: '<p>Content 1</p>' }
];

let MOCK_EXERCISES = [
  { id: 1, topicId: 1, title: 'Exercise 1', description: 'Desc 1', type: 'PART_1' }
];

let MOCK_QUESTIONS = [
  { 
    id: 1, 
    exerciseId: 1, 
    content: 'Look at the picture.', 
    options: '["A", "B", "C", "D"]', 
    correctAnswer: 'A',
    questionType: 'MULTIPLE_CHOICE'
  }
];

let MOCK_GROUPS = [
  { id: 1, exerciseId: 1, title: 'Group 1', content: 'Group Content 1' }
];

let MOCK_FLASHCARDS = [
  { id: 1, deckId: 1, word: 'Apple', partOfSpeech: 'n', phonetic: '/ˈæpl/', meaningVi: 'Quả táo', meaningEn: 'A fruit', examples: 'I eat an apple', imageUrl: 'https://via.placeholder.com/150' }
];

let MOCK_DECKS = [
  { id: 1, listName: 'Basic Vocabulary', description: '500 words', isSystem: true, flashCards: MOCK_FLASHCARDS },
  { id: 2, listName: 'Advanced Grammar', description: 'Grammar', isSystem: true, flashCards: [] }
];

// ========== Sections ==========
export const getSections = () => mockResponse(MOCK_SECTIONS);
export const getSectionBySlug = (slug) => mockResponse(MOCK_SECTIONS.find(s => s.slug === slug));

// ========== Topics ==========
export const getTopicsBySection = (sectionId) => mockResponse(MOCK_TOPICS.filter(t => t.sectionId == sectionId));
export const getTopicById = (id) => mockResponse(MOCK_TOPICS.find(t => t.id == id));

// ========== Lessons ==========
export const getLessonsByTopic = (topicId) => mockResponse(MOCK_LESSONS.filter(l => l.topicId == topicId));
export const getLessonById = (id) => mockResponse(MOCK_LESSONS.find(l => l.id == id));

// ========== Exercises ==========
export const getExercisesByTopic = (topicId) => mockResponse(MOCK_EXERCISES.filter(e => e.topicId == topicId));
export const getExerciseDetailById = (id) => {
    const exercise = MOCK_EXERCISES.find(e => e.id == id) || MOCK_EXERCISES[0];
    const questions = MOCK_QUESTIONS.filter(q => q.exerciseId == id);
    const groups = MOCK_GROUPS.filter(g => g.exerciseId == id);
    return mockResponse({ ...exercise, questions, groups });
};

// ========== Admin: Sections ==========
export const adminCreateSection = async (data) => {
  const newSec = { id: Date.now(), ...data };
  MOCK_SECTIONS.push(newSec);
  return mockSuccess();
};
export const adminUpdateSection = async (id, data) => {
  MOCK_SECTIONS = MOCK_SECTIONS.map(s => s.id == id ? { ...s, ...data } : s);
  return mockSuccess();
};
export const adminDeleteSection = async (id) => {
  MOCK_SECTIONS = MOCK_SECTIONS.filter(s => s.id != id);
  return mockSuccess();
};

// ========== Admin: Topics ==========
export const adminCreateTopic = async (sectionId, data) => {
  const newTopic = { id: Date.now(), sectionId, ...data };
  MOCK_TOPICS.push(newTopic);
  return mockSuccess();
};
export const adminUpdateTopic = async (id, data) => {
  MOCK_TOPICS = MOCK_TOPICS.map(t => t.id == id ? { ...t, ...data } : t);
  return mockSuccess();
};
export const adminDeleteTopic = async (id) => {
  MOCK_TOPICS = MOCK_TOPICS.filter(t => t.id != id);
  return mockSuccess();
};

// ========== Admin: Exercises ==========
export const adminCreateExercise = async (topicId, data) => {
  MOCK_EXERCISES.push({ id: Date.now(), topicId, ...data });
  return mockSuccess();
};
export const adminUpdateExercise = async (id, data) => {
  MOCK_EXERCISES = MOCK_EXERCISES.map(e => e.id == id ? { ...e, ...data } : e);
  return mockSuccess();
};
export const adminDeleteExercise = async (id) => {
  MOCK_EXERCISES = MOCK_EXERCISES.filter(e => e.id != id);
  return mockSuccess();
};

export const adminAddQuestion = async (exerciseId, data) => {
  MOCK_QUESTIONS.push({ id: Date.now(), exerciseId, ...data });
  return mockSuccess();
};
export const adminDeleteQuestion = async (questionId) => {
  MOCK_QUESTIONS = MOCK_QUESTIONS.filter(q => q.id != questionId);
  return mockSuccess();
};

// ========== Admin: Exercise Question Groups ==========
export const adminAddQuestionGroup = async (exerciseId, data) => {
  MOCK_GROUPS.push({ id: Date.now(), exerciseId, ...data });
  return mockSuccess();
}
export const adminUpdateQuestionGroup = async (groupId, data) => {
  MOCK_GROUPS = MOCK_GROUPS.map(g => g.id == groupId ? { ...g, ...data } : g);
  return mockSuccess();
}
export const adminDeleteQuestionGroup = async (groupId) => {
  MOCK_GROUPS = MOCK_GROUPS.filter(g => g.id != groupId);
  return mockSuccess();
}

// ========== Admin: Lessons ==========
export const adminCreateLesson = async (topicId, data) => {
  MOCK_LESSONS.push({ id: Date.now(), topicId, ...data });
  return mockSuccess();
};
export const adminUpdateLesson = async (id, data) => {
  MOCK_LESSONS = MOCK_LESSONS.map(l => l.id == id ? { ...l, ...data } : l);
  return mockSuccess();
};
export const adminDeleteLesson = async (id) => {
  MOCK_LESSONS = MOCK_LESSONS.filter(l => l.id != id);
  return mockSuccess();
};

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
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
    },
    body: formData,
  }).then(handleResponse);
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
