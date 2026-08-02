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
export const getSections = () =>
  fetch(`${BASE_URL}/admin/courses/sections`, { headers: getAuthHeaders() }).then(handleResponse);

export const getSectionBySlug = (slug) =>
  fetch(`${BASE_URL}/courses/sections/${slug}`, { headers: getAuthHeaders() }).then(handleResponse);

// ========== Topics ==========
export const getTopicsBySection = async (sectionId) => {
  const res = await getSections();
  const section = (res.data || []).find((item) => String(item.id) === String(sectionId));
  return { data: section?.topics || [] };
};

export const getTopicById = async (id) => {
  const res = await getSections();
  const topic = (res.data || [])
    .flatMap((section) => section.topics || [])
    .find((item) => String(item.id) === String(id));
  return { data: topic };
};

// ========== Lessons ==========
export const getLessonsByTopic = (topicId) => mockResponse(MOCK_LESSONS.filter(l => l.topicId == topicId));
export const getLessonById = (id) => mockResponse(MOCK_LESSONS.find(l => l.id == id));

// ========== Exercises ==========
export const getExercisesByTopic = async (topicId) => {
  const topicRes = await getTopicById(topicId);
  return { data: topicRes.data?.exercises || [] };
};

export const getExerciseDetailById = (id) =>
  fetch(`${BASE_URL}/exercises/${id}`, { headers: getAuthHeaders() }).then(handleResponse);

// ========== Admin: Sections ==========
export const adminCreateSection = (data) =>
  fetch(`${BASE_URL}/admin/courses/sections`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ isActive: true, ...data }),
  }).then(handleResponse);

export const adminUpdateSection = (id, data) =>
  fetch(`${BASE_URL}/admin/courses/sections/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ isActive: true, ...data }),
  }).then(handleResponse);

export const adminDeleteSection = (id) =>
  fetch(`${BASE_URL}/admin/courses/sections/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

// ========== Admin: Topics ==========
export const adminCreateTopic = (sectionId, data) =>
  fetch(`${BASE_URL}/admin/courses/topics`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ isActive: true, sectionId: Number(sectionId), ...data }),
  }).then(handleResponse);

export const adminUpdateTopic = (id, data) =>
  fetch(`${BASE_URL}/admin/courses/topics/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ isActive: true, ...data }),
  }).then(handleResponse);

export const adminDeleteTopic = (id) =>
  fetch(`${BASE_URL}/admin/courses/topics/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

// ========== Admin: Exercises ==========
export const adminCreateExercise = (topicId, data) =>
  fetch(`${BASE_URL}/admin/courses/exercises`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({
      isActive: true,
      totalQuestions: 0,
      orderIndex: 1,
      topicId: Number(topicId),
      ...data,
    }),
  }).then(handleResponse);

export const adminUpdateExercise = (id, data) =>
  fetch(`${BASE_URL}/admin/courses/exercises/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({
      isActive: true,
      ...data,
    }),
  }).then(handleResponse);

export const adminDeleteExercise = (id) =>
  fetch(`${BASE_URL}/admin/courses/exercises/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

export const adminAddQuestion = (exerciseId, data) =>
  fetch(`${BASE_URL}/admin/courses/exercises/${exerciseId}/questions`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminDeleteQuestion = (questionId) =>
  fetch(`${BASE_URL}/admin/courses/exercises/questions/${questionId}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

// ========== Admin: Exercise Question Groups ==========
export const adminAddQuestionGroup = (exerciseId, data) =>
  fetch(`${BASE_URL}/admin/courses/exercises/${exerciseId}/question-groups`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminUpdateQuestionGroup = (groupId, data) =>
  fetch(`${BASE_URL}/admin/courses/exercises/question-groups/${groupId}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminDeleteQuestionGroup = (groupId) =>
  fetch(`${BASE_URL}/admin/courses/exercises/question-groups/${groupId}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

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

// ========== Admin: Users ==========
export const adminGetUsers = () =>
  fetch(`${BASE_URL}/admin/users`, {
    headers: getAuthHeaders(),
  }).then(handleResponse);

export const adminCreateUser = (data) =>
  fetch(`${BASE_URL}/admin/users`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminUpdateUser = (id, data) =>
  fetch(`${BASE_URL}/admin/users/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  }).then(handleResponse);

export const adminSetUserActive = (id, isActive) =>
  fetch(`${BASE_URL}/admin/users/${id}/active`, {
    method: 'PATCH', headers: getAuthHeaders(), body: JSON.stringify({ isActive }),
  }).then(handleResponse);

export const adminDeleteUser = (id) =>
  fetch(`${BASE_URL}/admin/users/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);
