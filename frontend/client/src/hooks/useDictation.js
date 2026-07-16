import { useState, useMemo, useCallback } from 'react';

/**
 * Danh sách function words (từ chức năng) — không ẩn ở chế độ MEDIUM/HARD
 * vì chúng quá phổ biến và dễ đoán
 */
const FUNCTION_WORDS = new Set([
  // Articles
  'a', 'an', 'the',
  // Pronouns
  'i', 'me', 'my', 'mine', 'myself',
  'you', 'your', 'yours', 'yourself',
  'he', 'him', 'his', 'himself',
  'she', 'her', 'hers', 'herself',
  'it', 'its', 'itself',
  'we', 'us', 'our', 'ours', 'ourselves',
  'they', 'them', 'their', 'theirs', 'themselves',
  // Prepositions
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about',
  'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between',
  'under', 'over', 'out', 'off', 'down', 'near', 'around',
  // Conjunctions
  'and', 'but', 'or', 'nor', 'so', 'yet', 'both', 'either', 'neither',
  'if', 'when', 'while', 'because', 'since', 'although', 'though',
  'that', 'which', 'who', 'whom', 'whose', 'where', 'what', 'how',
  // Auxiliaries
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'do', 'does', 'did',
  'has', 'have', 'had', 'having',
  'will', 'would', 'shall', 'should',
  'can', 'could', 'may', 'might', 'must',
  // Others
  'not', "n't", 'no', 'yes',
  'this', 'that', 'these', 'those',
  'there', 'here',
  'very', 'too', 'also', 'just', 'only',
  'as', 'than', 'then',
]);

/**
 * Tách chuỗi thành tokens giữ nguyên dấu câu
 * Ví dụ: "Hello, world!" → [{word: "Hello", punct: ","}, {word: "world", punct: "!"}]
 */
function tokenize(sentence) {
  const tokens = [];
  // Match: (dấu câu trước)(từ)(dấu câu sau)
  const regex = /([^a-zA-Z'-]*)([a-zA-Z'-]+)([^a-zA-Z'-]*)/g;
  let match;
  while ((match = regex.exec(sentence)) !== null) {
    tokens.push({
      leading: match[1] || '',
      word: match[2],
      trailing: match[3] || '',
    });
  }
  return tokens;
}

/**
 * Kiểm tra từ có phải content word không (ngược lại function word)
 */
function isContentWord(word) {
  return !FUNCTION_WORDS.has(word.toLowerCase());
}

/**
 * Tạo danh sách blanks cho 1 câu theo chế độ
 * @param {Array} tokens - Mảng tokens đã tokenize
 * @param {string} difficulty - 'MEDIUM' | 'HARD' | 'SENTENCE'
 * @returns {Array<{type: 'text'|'blank', value: string, trailing: string, id: number}>}
 */
function createBlanksForSentence(tokens, difficulty, startId = 0) {
  if (difficulty === 'SENTENCE') {
    // Chế độ chép cả câu: toàn bộ câu = 1 blank lớn
    const fullSentence = tokens.map(t => t.leading + t.word + t.trailing).join('');
    return [{
      type: 'blank',
      value: fullSentence.trim(),
      leading: '',
      trailing: '',
      id: startId,
    }];
  }

  // Xác định tỉ lệ ẩn
  const blankRatio = difficulty === 'HARD' ? 0.6 : 0.3;

  // Tìm các content words
  const contentIndices = [];
  tokens.forEach((token, idx) => {
    if (isContentWord(token.word) && token.word.length > 1) {
      contentIndices.push(idx);
    }
  });

  // Random chọn content words để ẩn
  const numBlanks = Math.max(1, Math.round(contentIndices.length * blankRatio));
  const shuffled = [...contentIndices].sort(() => Math.random() - 0.5);
  const blankIndices = new Set(shuffled.slice(0, numBlanks));

  // Tạo segments
  let currentId = startId;
  return tokens.map((token, idx) => {
    if (blankIndices.has(idx)) {
      return {
        type: 'blank',
        value: token.word,
        leading: token.leading,
        trailing: token.trailing,
        id: currentId++,
      };
    }
    return {
      type: 'text',
      value: token.word,
      leading: token.leading,
      trailing: token.trailing,
      id: -1,
    };
  });
}

/**
 * Parse transcript từ exercise data dựa theo exerciseType
 * 
 * - Part 1: ghép optionA + optionB + optionC + optionD từ question
 * - Part 2: ghép content + optionA + optionB + optionC từ question  
 * - Part 3/4: parse passage từ group (lấy phần trước ---)
 */
export function parseTranscript(exerciseType, group) {
  if (!group) return [];

  if (exerciseType === 'LISTENING_PART1') {
    // Part 1: mỗi group có 1 question, transcript = 4 options
    const q = group.questions?.[0];
    if (!q) return [];
    const lines = [];
    
    // Helper to extract translation from explanation
    const getTransForLine = (expl, prefix) => {
      if (!expl) return '';
      const lines = expl.split('\n').map(l => l.trim());
      const idx = lines.findIndex(l => l.startsWith(prefix));
      if (idx !== -1) {
        let trans = lines[idx].substring(prefix.length).trim();
        if (!trans && lines[idx+1]) trans = lines[idx+1].trim();
        return trans;
      }
      return '';
    };

    const expl = q.explanation || '';
    const transA = getTransForLine(expl, '(A)');
    const transB = getTransForLine(expl, '(B)');
    const transC = getTransForLine(expl, '(C)');
    const transD = getTransForLine(expl, '(D)');

    if (q.optionA) lines.push(transA ? `(A) ${q.optionA} --- ${transA}` : `(A) ${q.optionA}`);
    if (q.optionB) lines.push(transB ? `(B) ${q.optionB} --- ${transB}` : `(B) ${q.optionB}`);
    if (q.optionC) lines.push(transC ? `(C) ${q.optionC} --- ${transC}` : `(C) ${q.optionC}`);
    if (q.optionD) lines.push(transD ? `(D) ${q.optionD} --- ${transD}` : `(D) ${q.optionD}`);
    
    return lines;
  }

  if (exerciseType === 'LISTENING_PART2') {
    // Part 2: mỗi group có 1 question, transcript = câu hỏi + 3 options
    const q = group.questions?.[0];
    if (!q) return [];
    const lines = [];

    const getTransForLine = (expl, prefix) => {
      if (!expl) return '';
      const lines = expl.split('\n').map(l => l.trim());
      const idx = lines.findIndex(l => l.startsWith(prefix));
      if (idx !== -1) {
        let trans = lines[idx].substring(prefix.length).trim();
        if (!trans && lines[idx+1]) trans = lines[idx+1].trim();
        return trans;
      }
      return '';
    };

    const getContentTrans = (expl) => {
      if (!expl) return '';
      const lines = expl.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length > 1 && lines[0].startsWith('Đáp án đúng:')) {
        return lines[1];
      }
      return '';
    };

    const expl = q.explanation || '';
    const contentTrans = getContentTrans(expl);
    const transA = getTransForLine(expl, '(A)');
    const transB = getTransForLine(expl, '(B)');
    const transC = getTransForLine(expl, '(C)');

    if (q.content) lines.push(contentTrans ? `${q.content} --- ${contentTrans}` : q.content);
    if (q.optionA) lines.push(transA ? `(A) ${q.optionA} --- ${transA}` : `(A) ${q.optionA}`);
    if (q.optionB) lines.push(transB ? `(B) ${q.optionB} --- ${transB}` : `(B) ${q.optionB}`);
    if (q.optionC) lines.push(transC ? `(C) ${q.optionC} --- ${transC}` : `(C) ${q.optionC}`);
    return lines;
  }

  // Part 3/4: parse passage
  if (!group.passage) return [];
  const parts = group.passage.split('---');
  let transcript = parts[0] ? parts[0].trim() : '';
  let translation = parts[1] ? parts[1].trim() : '';

  // Bỏ dòng "Transcript" ở đầu
  if (transcript.toLowerCase().startsWith('transcript')) {
    transcript = transcript.substring('transcript'.length).trim();
  }
  if (translation.toLowerCase().startsWith('dịch nghĩa')) {
    translation = translation.substring('dịch nghĩa'.length).trim();
  }

  // Tách thành từng câu
  const engLines = transcript.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const vieLines = translation.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  return engLines.map((eng, i) => {
    const vie = vieLines[i] || '';
    return vie ? `${eng} --- ${vie}` : eng;
  });
}

/**
 * Hook chính: parse transcript và tạo blanks theo chế độ
 * 
 * @param {string} exerciseType - Loại exercise (LISTENING_PART1..4)
 * @param {Object} group - ExerciseQuestionGroup data
 * @param {string} difficulty - 'MEDIUM' | 'HARD' | 'SENTENCE'
 */
export function useDictation(exerciseType, group, difficulty = 'MEDIUM') {
  // Parse transcript thành danh sách câu
  const sentences = useMemo(
    () => parseTranscript(exerciseType, group),
    [exerciseType, group]
  );

  // Tạo blanks cho từng câu (regenerate khi difficulty thay đổi)
  const sentenceSegments = useMemo(() => {
    let globalId = 0;
    return sentences.map(sentence => {
      // Chỉ lấy phần tiếng Anh để tạo blanks
      const englishPart = sentence.split('---')[0].trim();
      const tokens = tokenize(englishPart);
      const segments = createBlanksForSentence(tokens, difficulty, globalId);
      // Cập nhật globalId
      segments.forEach(seg => {
        if (seg.type === 'blank') globalId = seg.id + 1;
      });
      return segments;
    });
  }, [sentences, difficulty]);

  // Tổng số blanks
  const totalBlanks = useMemo(() => {
    let count = 0;
    sentenceSegments.forEach(segs => {
      segs.forEach(seg => {
        if (seg.type === 'blank') count++;
      });
    });
    return count;
  }, [sentenceSegments]);

  // Kiểm tra đáp án 1 blank
  const checkAnswer = useCallback((blankId, userInput) => {
    for (const segs of sentenceSegments) {
      for (const seg of segs) {
        if (seg.type === 'blank' && seg.id === blankId) {
          const expected = seg.value.trim();
          const input = (userInput || '').trim();
          return {
            correct: input.toLowerCase() === expected.toLowerCase(),
            expected,
            userAnswer: input,
          };
        }
      }
    }
    return { correct: false, expected: '', userAnswer: '' };
  }, [sentenceSegments]);

  // Kiểm tra tất cả blanks của 1 câu
  const checkSentence = useCallback((sentenceIdx, userInputs) => {
    const segs = sentenceSegments[sentenceIdx];
    if (!segs) return [];

    return segs
      .filter(seg => seg.type === 'blank')
      .map(seg => {
        const userInput = userInputs[seg.id] || '';
        const expected = seg.value.trim();
        return {
          id: seg.id,
          correct: userInput.trim().toLowerCase() === expected.toLowerCase(),
          expected,
          userAnswer: userInput.trim(),
        };
      });
  }, [sentenceSegments]);

  // Tính stats
  const getStats = useCallback((userInputs) => {
    let total = 0;
    let correct = 0;
    let wrong = 0;
    let remaining = 0;

    sentenceSegments.forEach(segs => {
      segs.forEach(seg => {
        if (seg.type === 'blank') {
          total++;
          const input = userInputs[seg.id];
          if (!input || input.trim() === '') {
            remaining++;
          } else if (input.trim().toLowerCase() === seg.value.trim().toLowerCase()) {
            correct++;
          } else {
            wrong++;
          }
        }
      });
    });

    return { total, correct, wrong, remaining };
  }, [sentenceSegments]);

  return {
    sentences,
    sentenceSegments,
    totalBlanks,
    checkAnswer,
    checkSentence,
    getStats,
  };
}

export default useDictation;
