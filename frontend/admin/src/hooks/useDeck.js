import { useState, useEffect, useCallback } from 'react';
import { getDeckById } from '../services/api';

/**
 * Custom hook to load a deck and its flashcards from API.
 * Returns: { deck, words, loading, error, reload }
 *
 * `words` is a normalized array where:
 * - `pos` maps from `partOfSpeech`
 * - `examples` is parsed from JSON string to array
 */
export const useDeck = (listId) => {
  const [deck, setDeck] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!listId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getDeckById(listId);
      const deckData = res.data;
      setDeck(deckData);

      // Normalize flashcard fields for frontend compatibility
      const normalized = (deckData.flashCards || []).map((fc) => ({
        id: fc.id,
        word: fc.word,
        phonetic: fc.phonetic || '',
        pos: fc.partOfSpeech || '',
        meaningVi: fc.meaningVi || '',
        meaningEn: fc.meaningEn || '',
        examples: parseExamples(fc.examples),
        imageUrl: fc.imageUrl || null,
      }));
      setWords(normalized);
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    load();
  }, [load]);

  return { deck, words, loading, error, reload: load };
};

/**
 * Parse examples from JSON string or return as-is if already an array.
 */
function parseExamples(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Generate quiz options (3 wrong + 1 correct) from a word pool.
 */
export const generateQuizOptions = (correctWord, allWords) => {
  const others = allWords.filter((w) => w.id !== correctWord.id);
  const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [...shuffled, correctWord].sort(() => Math.random() - 0.5);
  return options.map((w) => ({
    id: w.id,
    label: w.meaningVi,
    word: w.word,
    isCorrect: w.id === correctWord.id,
  }));
};

/**
 * Generate match cards (pick 6 words, produce 12 cards).
 */
export const generateMatchCards = (words) => {
  const picked = [...words].sort(() => Math.random() - 0.5).slice(0, 6);
  const cards = [];
  picked.forEach((w) => {
    cards.push({ pairId: w.id, type: 'word', text: w.word, sub: '' });
    cards.push({ pairId: w.id, type: 'meaning', text: w.meaningVi, sub: w.meaningEn });
  });
  return cards.sort(() => Math.random() - 0.5).map((c, i) => ({ ...c, uid: i }));
};

/**
 * Practice modes configuration.
 */
export const PRACTICE_MODES = [
  { key: 'study', label: 'Flashcards', icon: '🔄', prefix: 'Từ vựng' },
  { key: 'quiz', label: 'Trắc nghiệm từ vựng', icon: '✏️', prefix: 'Luyện tập' },
  { key: 'match', label: 'Tìm cặp', icon: '🔗', prefix: 'Luyện tập' },
  { key: 'fill', label: 'Dịch nghĩa / Điền từ', icon: '📝', prefix: 'Luyện tập' },
  { key: 'dictation', label: 'Nghe chính tả', icon: '🔊', prefix: 'Luyện tập' },
];
