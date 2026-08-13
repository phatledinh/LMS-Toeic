import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getExerciseDetailById } from '../services/api';
import { getFullUrl } from '../utils/urlUtils';
import { useAuth } from '../context/AuthContext';
import { ZENLISH_TEST_2_INTROS } from '../data/zenlishTestIntros';

// ==================== Sub-components ====================

const EXERCISE_PART_LABELS = {
  LISTENING_PART1: 'Part 1',
  LISTENING_PART2: 'Part 2',
  LISTENING_PART3: 'Part 3',
  LISTENING_PART4: 'Part 4',
  READING_PART5: 'Part 5',
  READING_PART6: 'Part 6',
  READING_PART7: 'Part 7',
  GRAMMAR: 'Grammar',
};

const isGroupedExerciseType = (exerciseType) => exerciseType !== 'GRAMMAR' && exerciseType !== 'READING_PART5';
const isListeningExerciseType = (exerciseType) => exerciseType?.startsWith('LISTENING_PART');
const isReadingExerciseType = (exerciseType) => exerciseType?.startsWith('READING_PART');

const SECTION_INTROS = {
  LISTENING: {
    title: 'LISTENING',
    text: 'Directions: This is the Listening section of the test. You will hear several questions and conversations. Each recording will be played only one time. Mark the best answer for each question.',
  },
  READING: {
    title: 'READING',
    text: 'Directions: This is the Reading section of the test. Read each question carefully and choose the best answer. You may move between Reading questions before submitting your test.',
  },
};

const getExerciseIntro = (exercise) => {
  if (exercise?.sectionSlug === 'test-2-2026') {
    return ZENLISH_TEST_2_INTROS[exercise.exerciseType] || null;
  }
  return null;
};

/** Audio Player dÃ¹ng chung cho Listening */
const parseListeningPassage = (passage) => {
  if (!passage) return { transcript: '', translation: '' };
  const parts = passage.split('---');
  let transcript = parts[0] ? parts[0].trim() : '';
  let translation = parts[1] ? parts[1].trim() : '';

  if (transcript.startsWith('Transcript')) {
    transcript = transcript.substring('Transcript'.length).trim();
  }
  if (translation.startsWith('Dịch nghĩa')) {
    translation = translation.substring('Dịch nghĩa'.length).trim();
  }
  return { transcript, translation };
};

const buildQuestionAudioText = (question, availableOptions = ['A', 'B', 'C', 'D']) => {
  if (!question) return '';
  const parts = [`Question ${question.questionNumber || ''}.`];
  if (question.content) parts.push(question.content);
  availableOptions.forEach((option) => {
    const text = question[`option${option}`];
    if (text) parts.push(`${option}. ${text}`);
  });
  return parts.join(' ');
};

const buildListeningFallbackText = (group, availableOptions = ['A', 'B', 'C', 'D']) => {
  const { transcript } = parseListeningPassage(group?.passage);
  const questionText = (group?.questions || [])
    .map((question) => buildQuestionAudioText(question, availableOptions))
    .filter(Boolean)
    .join(' ');
  return [transcript, questionText].filter(Boolean).join(' ');
};

const containsHtml = (value = '') => /<\/?[a-z][\s\S]*>/i.test(value);

const RichText = ({ html, className, style }) => {
  if (!html) return null;

  if (!containsHtml(html)) {
    return (
      <div className={className} style={style}>
        {html}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
};

const htmlToPlainText = (value = '') => String(value)
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/p>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const questionContentStartsWithNumber = (question) => {
  if (!question?.content || !question?.questionNumber) return false;
  const plainContent = htmlToPlainText(question.content);
  const escapedNumber = String(question.questionNumber).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escapedNumber}\\s*[.)]\\s*`).test(plainContent);
};

const TOEIC_SECTION_MAX_SCORE = 495;
const TOEIC_SECTION_MIN_SCORE = 5;
const TOEIC_SCORE_STEP = 5;

const calculateSectionScore = (correctCount, totalCount) => {
  if (totalCount <= 0) return 0;
  const maxSteps = (TOEIC_SECTION_MAX_SCORE - TOEIC_SECTION_MIN_SCORE) / TOEIC_SCORE_STEP;
  const earnedSteps = Math.round((correctCount / totalCount) * maxSteps);
  return TOEIC_SECTION_MIN_SCORE + earnedSteps * TOEIC_SCORE_STEP;
};

export const AudioPlayer = ({ audioUrl, label, fallbackText, autoPlay = false, locked = false, onEnded }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const audioRef = useRef(null);
  const speechShouldCompleteRef = useRef(false);

  const cleanFallbackText = (fallbackText || '')
    .replace(/^Transcript/i, '')
    .split('---')[0]
    .trim();
  const hasAudioUrl = Boolean(audioUrl);
  const fullUrl = hasAudioUrl ? getFullUrl(audioUrl) : null;

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const finishPlayback = useCallback(() => {
    speechShouldCompleteRef.current = false;
    setIsPlaying(false);
    if (onEnded) onEnded();
  }, [onEnded]);

  const playFallbackSpeech = useCallback(() => {
    if (!cleanFallbackText || !window.speechSynthesis) return;
    speechShouldCompleteRef.current = false;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanFallbackText);
    utterance.lang = 'en-US';
    utterance.rate = playbackRate;
    utterance.volume = isMuted ? 0 : volume;
    utterance.onend = () => {
      if (speechShouldCompleteRef.current) {
        finishPlayback();
      } else {
        setIsPlaying(false);
      }
    };
    utterance.onerror = () => setIsPlaying(false);
    speechShouldCompleteRef.current = true;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }, [cleanFallbackText, finishPlayback, isMuted, playbackRate, volume]);

  const playAudio = useCallback(() => {
    if (!audioRef.current) return;
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    } else {
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    if (window.speechSynthesis) {
      speechShouldCompleteRef.current = false;
      window.speechSynthesis.cancel();
    }
  }, [fullUrl, cleanFallbackText]);

  useEffect(() => {
    if (!autoPlay) return;
    if (hasAudioUrl) {
      playAudio();
      return;
    }
    playFallbackSpeech();
  }, [autoPlay, hasAudioUrl, playAudio, playFallbackSpeech]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        speechShouldCompleteRef.current = false;
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!hasAudioUrl && !cleanFallbackText) return null;

  const togglePlay = () => {
    if (!hasAudioUrl && cleanFallbackText && window.speechSynthesis) {
      if (isPlaying) {
        speechShouldCompleteRef.current = false;
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        playFallbackSpeech();
      }
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        playAudio();
      }
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e) => {
    const vol = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    setVolume(vol);
    if (vol > 0 && isMuted) {
      setIsMuted(false);
    } else if (vol === 0 && !isMuted) {
      setIsMuted(true);
    }
    if (!hasAudioUrl && isPlaying && window.speechSynthesis) {
      speechShouldCompleteRef.current = false;
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = previousVolume > 0 ? previousVolume : 1;
        setVolume(previousVolume > 0 ? previousVolume : 1);
        setIsMuted(false);
      } else {
        setPreviousVolume(volume);
        audioRef.current.volume = 0;
        setVolume(0);
        setIsMuted(true);
      }
    } else if (!hasAudioUrl) {
      if (isMuted) {
        setVolume(previousVolume > 0 ? previousVolume : 1);
        setIsMuted(false);
      } else {
        setPreviousVolume(volume);
        setVolume(0);
        setIsMuted(true);
      }
      if (isPlaying && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      }
    }
  };

  const changeSpeed = (rate) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSpeedMenu(false);
    }
    if (!hasAudioUrl && isPlaying && window.speechSynthesis) {
      speechShouldCompleteRef.current = false;
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleReload = () => {
    if (!hasAudioUrl && cleanFallbackText && window.speechSynthesis) {
      speechShouldCompleteRef.current = false;
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setShowSpeedMenu(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Error reloading audio:", error);
          setIsPlaying(false);
        });
      } else {
        setIsPlaying(true);
      }
      setShowSpeedMenu(false);
    }
  };

  const speedOptions = [0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2];

  return (
    <div className={`custom-audio-player ${locked ? 'audio-player-locked' : ''}`}>
      <audio
        ref={audioRef}
        src={fullUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={finishPlayback}
      />
      <button className="audio-play-btn" onClick={togglePlay} disabled={locked} title={locked ? 'Audio tự phát trong phần Listening' : (hasAudioUrl ? label : 'Play transcript with browser TTS')}>
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>
      {hasAudioUrl ? (
        <input
          type="range"
          className="audio-progress-bar"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          disabled={locked}
          style={{ '--progress': `${(currentTime / (duration || 1)) * 100}%` }}
        />
      ) : (
        <div className="audio-progress-bar" style={{ '--progress': isPlaying ? '100%' : '0%', opacity: 0.65 }} />
      )}
      <span className="audio-time">
        {hasAudioUrl ? formatTime(currentTime) : 'TTS'}
      </span>
      <div className="audio-volume-control">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368" onClick={locked ? undefined : toggleMute} style={{cursor: locked ? 'default' : 'pointer'}}>
          {isMuted || volume === 0 ? (
             <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          ) : (
             <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          )}
        </svg>
        <input
          type="range"
          className="audio-volume-bar"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          disabled={locked}
          style={{ '--progress': `${volume * 100}%` }}
        />
      </div>
      {!locked && <div style={{ position: 'relative' }}>
        <div className="audio-gear-btn" onClick={() => setShowSpeedMenu(!showSpeedMenu)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
          </svg>
        </div>
          {showSpeedMenu && (
            <div className="audio-speed-menu">
              <div className="speed-menu-header">Speed</div>
              {speedOptions.map(rate => (
                <div 
                  key={rate} 
                  className={`speed-option ${playbackRate === rate ? 'active' : ''}`}
                  onClick={() => changeSpeed(rate)}
                >
                  {playbackRate === rate && <span className="speed-check">●</span>}
                  <span className="speed-label">{rate === 1 ? 'Normal' : `${rate}x`}</span>
                </div>
              ))}
              <div className="speed-option reload-btn" onClick={handleReload}>
                Reload File
              </div>
            </div>
          )}
        </div>}
    </div>
  );
};

/** Một câu hỏi MCQ (dùng lại cho mọi layout) */
const ListeningPartIntroLayout = ({ intro, firstGroup, onComplete, enableAudio = true }) => {
  const completedRef = useRef(false);
  const fallbackText = htmlToPlainText(intro?.html || intro?.text || '');

  const completeIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    completedRef.current = false;
  }, [intro]);

  return (
    <div className="listening-part-intro">
      <div className="listening-intro-paper">
        {!intro?.html && <h2>{intro?.title || 'LISTENING'}</h2>}
        {intro?.html ? (
          <RichText html={intro.html} className="part-intro-html" />
        ) : (
          <p>{intro?.text}</p>
        )}
        {!intro?.html && firstGroup?.imageUrl && (
          <div className="listening-intro-image">
            <img src={getFullUrl(firstGroup.imageUrl)} alt={intro?.title || 'Listening part'} />
          </div>
        )}
      </div>
      {enableAudio && (
        <div className="listening-intro-audio">
          <AudioPlayer
            audioUrl={intro?.audioUrl}
            label={intro?.title || 'Intro'}
            fallbackText={fallbackText}
            autoPlay={true}
            locked={true}
            onEnded={completeIntro}
          />
        </div>
      )}
      <div className="listening-intro-actions">
        <button className="listening-intro-start" onClick={completeIntro}>
          BẮT ĐẦU
        </button>
      </div>
    </div>
  );
};
export const QuestionMCQ = ({
  question,
  answer,
  showAnswer,
  onAnswer,
  hideOptionsText = false,
  hideQuestionNumber = false,
  availableOptions,
  questionNumberFormat = 'q',
  inlineQuestionContent = false,
}) => {
  if (!question) return null;

  const options = availableOptions || ['A', 'B', 'C', 'D'];
  const isCorrect = showAnswer && answer && answer === question.correctAnswer;
  const questionNumberText = questionNumberFormat === 'dot'
    ? `${question.questionNumber}.`
    : `Q${question.questionNumber}:`;
  const contentIncludesQuestionNumber = questionContentStartsWithNumber(question);

  const getOptionClass = (opt) => {
    if (!showAnswer) {
      return answer === opt ? 'option-selected' : '';
    }
    if (opt === question.correctAnswer) return 'option-correct';
    if (answer === opt && opt !== question.correctAnswer) return 'option-wrong';
    return '';
  };

  return (
    <div className="group-question-item">
      {!hideQuestionNumber && question.content && (
        <>
          {inlineQuestionContent ? (
            <div className="question-number reading-inline-question">
              {!contentIncludesQuestionNumber && <span>{questionNumberText}</span>}
              <RichText html={question.content} className="question-content" />
            </div>
          ) : (
            <>
              {!contentIncludesQuestionNumber && <div className="question-number">{questionNumberText}</div>}
              <RichText html={question.content} className="question-content" />
            </>
          )}
        </>
      )}
      {!hideQuestionNumber && !question.content && (
        <div className="question-number">
          {questionNumberFormat === 'dot' ? `${question.questionNumber}.` : `Câu ${question.questionNumber}`}
        </div>
      )}

      <div className="options-list">
        {options.map((opt) => {
          const text = question[`option${opt}`];
          if (!availableOptions && !text) return null;
          return (
            <label
              key={opt}
              className={`option-item ${getOptionClass(opt)}`}
              onClick={() => onAnswer(question.id, opt)}
            >
              <span className="option-radio">
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  checked={answer === opt}
                  onChange={() => onAnswer(question.id, opt)}
                />
              </span>
              <span className="option-letter">{opt}.</span>
              {(!hideOptionsText) && <span className="option-text">{text}</span>}
            </label>
          );
        })}
      </div>

      {/* Giải thích */}
      {showAnswer && question.explanation && (
        <div className={`explanation-box ${isCorrect ? 'correct' : 'wrong'}`}>
          <div style={{ marginBottom: '8px' }}>
            <strong>{isCorrect ? '✓ Đúng!' : '✗ Sai!'}</strong>
            <span> Đáp án: {question.correctAnswer}</span>
          </div>
          <RichText
            html={question.explanation}
            className="explanation-text"
            style={{ whiteSpace: containsHtml(question.explanation) ? 'normal' : 'pre-line', lineHeight: '1.6' }}
          />
        </div>
      )}
    </div>
  );
};

// ==================== Layout Components ====================

/** Layout cho GRAMMAR & READING_PART5 - MCQ thuần, navigate từng câu */
const SHOW_LISTENING_TRANSCRIPT_HELP = false;

export const GrammarLayout = ({ questions, currentIndex, setCurrentIndex, answers, showAnswer, handleAnswer }) => {
  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <>
      <div className="question-card">
        <QuestionMCQ
          question={currentQ}
          answer={answers[currentQ.id]}
          showAnswer={showAnswer}
          onAnswer={handleAnswer}
        />
      </div>
    </>
  );
};

export const ReadingPart5Layout = ({ questions, currentIndex, answers, showAnswer, handleAnswer }) => {
  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="part1-mock-layout reading-part5-layout">
      <div className="mock-split-row reading-split-row">
        <div className="mock-left-col reading-prompt-col">
          <h2 className="toeic-question-label">Câu hỏi</h2>
        </div>
        <div className="mock-right-col reading-answer-col">
          <div className="mock-question-container">
            <QuestionMCQ
              question={currentQ}
              answer={answers[currentQ.id]}
              showAnswer={showAnswer}
              onAnswer={handleAnswer}
              hideOptionsText={false}
              hideQuestionNumber={false}
              availableOptions={['A', 'B', 'C', 'D']}
              questionNumberFormat="dot"
              inlineQuestionContent={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/** Layout cho LISTENING_PART1 - Audio + Image + 1 câu MCQ, navigate từng group */
export const ListeningPart1Layout = ({ groups, currentGroupIndex, answers, showAnswer, handleAnswer, autoPlay = false, lockedAudio = false, onAudioEnded }) => {
  const group = groups[currentGroupIndex];
  const [showTranscript, setShowTranscript] = useState(false);

  // Reset toggle states when group changes
  useEffect(() => {
    setShowTranscript(false);
  }, [currentGroupIndex]);

  if (!group) return null;
  const question = group.questions?.[0];

  // Extract transcript and translation from passage
  const parsePassage = (passage) => {
    if (!passage) return { transcript: '', translation: '' };
    const parts = passage.split('---');
    let transcript = parts[0] ? parts[0].trim() : '';
    let translation = parts[1] ? parts[1].trim() : '';
    
    if (transcript.startsWith('Transcript')) {
      transcript = transcript.substring('Transcript'.length).trim();
    }
    if (translation.startsWith('Dịch nghĩa')) {
      translation = translation.substring('Dịch nghĩa'.length).trim();
    }
    return { transcript, translation };
  };

  let { transcript, translation } = parsePassage(group.passage);

  // Fallback cho Part 1: Tạo transcript từ các option của câu hỏi
  if (!transcript && question) {
    const opts = ['A', 'B', 'C', 'D'].map(opt => question[`option${opt}`]).filter(Boolean);
    if (opts.length > 0) {
      transcript = opts.join('\n');
    }
  }

  return (
    <div className="part1-mock-layout">
      <div className="mock-audio-row">
        <AudioPlayer audioUrl={group.audioUrl} label={`Câu ${question?.questionNumber || ''}`} fallbackText={buildListeningFallbackText(group, ['A', 'B', 'C', 'D']) || transcript} autoPlay={autoPlay} locked={lockedAudio} onEnded={onAudioEnded} />
      </div>
      <div className="mock-split-row">
        <div className="mock-left-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 className="toeic-question-label">Câu hỏi</h2>
          {group.imageUrl && (
            <div className="mock-image-container">
              <img src={getFullUrl(group.imageUrl)} alt={`Hình câu ${question?.questionNumber}`} />
            </div>
          )}
          
          <div className="transcript-translation-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {(SHOW_LISTENING_TRANSCRIPT_HELP || showAnswer) && transcript && (
              <div className="toggle-item">
                <div 
                  className="toggle-header" 
                  onClick={() => setShowTranscript(!showTranscript)}
                  style={{ 
                    cursor: 'pointer', 
                    color: '#35509a', 
                    fontWeight: '500', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: '15px',
                    userSelect: 'none'
                  }}
                >
                  <span>Transcript</span>
                  <span style={{ fontSize: '10px' }}>{showTranscript ? '▼' : '▶'}</span>
                </div>
                {(showTranscript || showAnswer) && (
                  <div 
                    className="toggle-content" 
                    style={{ 
                      backgroundColor: '#E7EAF3', 
                      padding: '16px', 
                      borderRadius: '8px',
                      marginTop: '8px',
                      whiteSpace: 'pre-line', 
                      fontSize: '14px', 
                      color: '#333',
                      lineHeight: '1.6',
                      border: '1px solid #d1d5e5'
                    }}
                  >
                    {transcript}
                  </div>
                )}
              </div>
            )}
            

          </div>
        </div>
        <div className="mock-right-col">
          {question && (
            <div className="mock-question-container">
              <div className="mock-qnum-title">
                {question.questionNumber}.
              </div>
              <QuestionMCQ
                question={question}
                answer={answers[question.id]}
                showAnswer={showAnswer}
                onAnswer={handleAnswer}
                hideOptionsText={true}
                hideQuestionNumber={true}
                availableOptions={['A', 'B', 'C', 'D']}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/** Layout cho LISTENING_PART2 - Audio + 1 câu MCQ (3 đáp án A,B,C) */
export const ListeningPart2Layout = ({ groups, currentGroupIndex, answers, showAnswer, handleAnswer, autoPlay = false, lockedAudio = false, onAudioEnded }) => {
  const group = groups[currentGroupIndex];
  if (!group) return null;
  const question = group.questions?.[0];

  return (
    <div className="part1-mock-layout">
      <div className="mock-audio-row">
        <AudioPlayer audioUrl={group.audioUrl} label={`Câu ${question?.questionNumber || ''}`} fallbackText={buildListeningFallbackText(group, ['A', 'B', 'C']) || group.passage || question?.content} autoPlay={autoPlay} locked={lockedAudio} onEnded={onAudioEnded} />
      </div>
      <div className="mock-split-row" style={{ display: 'block' }}>
        <div className="mock-question-container" style={{ width: '100%' }}>
          {question && (
            <QuestionMCQ
              question={question}
              answer={answers[question.id]}
              showAnswer={showAnswer}
              onAnswer={handleAnswer}
              hideOptionsText={true}
              hideQuestionNumber={false}
              availableOptions={['A', 'B', 'C']}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/** Layout cho LISTENING_PART3 & PART4 - Audio + N câu MCQ, navigate theo group */
export const ListeningGroupLayout = ({ groups, currentGroupIndex, answers, showAnswer, handleAnswer, autoPlay = false, lockedAudio = false, onAudioEnded }) => {
  const group = groups[currentGroupIndex];
  const [showTranscript, setShowTranscript] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Reset toggle states when group changes
  useEffect(() => {
    setShowTranscript(false);
    setShowTranslation(false);
  }, [currentGroupIndex]);

  if (!group) return null;

  // Extract transcript and translation from passage
  const parsePassage = (passage) => {
    if (!passage) return { transcript: '', translation: '' };
    const parts = passage.split('---');
    let transcript = parts[0] ? parts[0].trim() : '';
    let translation = parts[1] ? parts[1].trim() : '';
    
    if (transcript.startsWith('Transcript')) {
      transcript = transcript.substring('Transcript'.length).trim();
    }
    if (translation.startsWith('Dịch nghĩa')) {
      translation = translation.substring('Dịch nghĩa'.length).trim();
    }
    return { transcript, translation };
  };

  const { transcript, translation } = parsePassage(group.passage);

  return (
    <div className="part1-mock-layout" style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '0' }}>
      <div className="mock-audio-row" style={{ paddingBottom: '16px', marginBottom: '16px' }}>
        <AudioPlayer audioUrl={group.audioUrl} label={`Nhóm ${currentGroupIndex + 1}`} fallbackText={buildListeningFallbackText(group, ['A', 'B', 'C', 'D']) || transcript} autoPlay={autoPlay} locked={lockedAudio} onEnded={onAudioEnded} />
      </div>
      <div
        className={`mock-split-row ${!group.imageUrl && !SHOW_LISTENING_TRANSCRIPT_HELP ? 'listening-no-left' : ''}`}
        style={{ alignItems: 'flex-start', gap: '24px' }}
      >
        <div className="mock-left-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {group.imageUrl && (
            <div className="mock-image-container" style={{ border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', width: '100%' }}>
              <img src={getFullUrl(group.imageUrl)} alt="Hình minh họa" style={{ width: '100%', display: 'block' }} />
            </div>
          )}
          
          <div className="transcript-translation-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {(SHOW_LISTENING_TRANSCRIPT_HELP || showAnswer) && transcript && (
              <div className="toggle-item">
                <div 
                  className="toggle-header" 
                  onClick={() => setShowTranscript(!showTranscript)}
                  style={{ 
                    cursor: 'pointer', 
                    color: '#35509a', 
                    fontWeight: '500', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: '15px',
                    userSelect: 'none'
                  }}
                >
                  <span>Transcript</span>
                  <span style={{ fontSize: '10px' }}>{showTranscript ? '▼' : '▶'}</span>
                </div>
                {(showTranscript || showAnswer) && (
                  <div 
                    className="toggle-content" 
                    style={{ 
                      backgroundColor: '#E7EAF3', 
                      padding: '16px', 
                      borderRadius: '8px',
                      marginTop: '8px',
                      whiteSpace: 'pre-line', 
                      fontSize: '14px', 
                      color: '#333',
                      lineHeight: '1.6',
                      border: '1px solid #d1d5e5'
                    }}
                  >
                    {transcript}
                  </div>
                )}
              </div>
            )}
            
            {(SHOW_LISTENING_TRANSCRIPT_HELP || showAnswer) && translation && (
              <div className="toggle-item">
                <div 
                  className="toggle-header" 
                  onClick={() => setShowTranslation(!showTranslation)}
                  style={{ 
                    cursor: 'pointer', 
                    color: '#35509a', 
                    fontWeight: '500', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: '15px',
                    userSelect: 'none'
                  }}
                >
                  <span>Dịch nghĩa</span>
                  <span style={{ fontSize: '10px' }}>{showTranslation ? '▼' : '▶'}</span>
                </div>
                {(showTranslation || showAnswer) && (
                  <div 
                    className="toggle-content" 
                    style={{ 
                      backgroundColor: '#E7EAF3', 
                      padding: '16px', 
                      borderRadius: '8px',
                      marginTop: '8px',
                      whiteSpace: 'pre-line', 
                      fontSize: '14px', 
                      color: '#333',
                      lineHeight: '1.6',
                      border: '1px solid #d1d5e5'
                    }}
                  >
                    {translation}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mock-right-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {group.questions?.map((q) => (
            <div className="mock-question-container" key={q.id}>
              <QuestionMCQ
                question={q}
                answer={answers[q.id]}
                showAnswer={showAnswer}
                onAnswer={handleAnswer}
                hideOptionsText={false}
                hideQuestionNumber={false}
                availableOptions={['A', 'B', 'C', 'D']}
                questionNumberFormat="dot"
                inlineQuestionContent={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Layout cho READING_PART6 & PART7 - Split view: Passage (trái) + N câu MCQ (phải) */
export const ReadingPassageLayout = ({ groups, currentGroupIndex, answers, showAnswer, handleAnswer }) => {
  const group = groups[currentGroupIndex];
  const [showTranslation, setShowTranslation] = useState(false);

  // Reset toggle states when group changes
  useEffect(() => {
    setShowTranslation(false);
  }, [currentGroupIndex]);

  if (!group) return null;

  // Extract english passage and translation from passage
  const parsePassage = (passage) => {
    if (!passage) return { englishPassage: '', translation: '' };
    const parts = passage.split('---');
    let englishPassage = parts[0] ? parts[0].trim() : '';
    let translation = parts[1] ? parts[1].trim() : '';
    
    if (translation.startsWith('Dịch nghĩa')) {
      translation = translation.substring('Dịch nghĩa'.length).trim();
    }
    return { englishPassage, translation };
  };

  const { englishPassage, translation } = parsePassage(group.passage);

  return (
    <div className="part1-mock-layout" style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '0' }}>
      <div className="mock-split-row" style={{ alignItems: 'flex-start', gap: '24px' }}>
        <div className="mock-left-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {group.imageUrl && (
            <div className="mock-image-container" style={{ border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', width: '100%' }}>
              <img src={getFullUrl(group.imageUrl)} alt="Hình minh họa" style={{ width: '100%', display: 'block' }} />
            </div>
          )}
          
          <div className="transcript-translation-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {group.contentBlocks && group.contentBlocks.length > 0 ? (
              <div className="group-content-blocks" style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {group.contentBlocks.sort((a,b) => a.orderIndex - b.orderIndex).map(block => {
                  if (block.blockType === 'IMAGE') {
                    return <img key={block.id} src={getFullUrl(block.imageUrl)} alt="Visual" style={{maxWidth:'100%', borderRadius:'4px'}}/>;
                  } else {
                    return <div key={block.id} className="block-text" style={{whiteSpace: 'pre-wrap', fontSize: '14px', color: '#333', lineHeight: '1.6'}}>{block.content}</div>;
                  }
                })}
              </div>
            ) : englishPassage && (
              <RichText
                html={englishPassage}
                className="english-passage-content"
                style={{
                  whiteSpace: containsHtml(englishPassage) ? 'normal' : 'pre-line',
                  fontSize: '14px',
                  color: '#333',
                  lineHeight: '1.6',
                }}
              />
            )}
            
            {translation && (
              <div className="toggle-item">
                <div 
                  className="toggle-header" 
                  onClick={() => setShowTranslation(!showTranslation)}
                  style={{ 
                    cursor: 'pointer', 
                    color: '#35509a', 
                    fontWeight: '500', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: '15px',
                    userSelect: 'none'
                  }}
                >
                  <span>Dịch nghĩa</span>
                  <span style={{ fontSize: '10px' }}>{showTranslation ? '▼' : '▶'}</span>
                </div>
                {showTranslation && (
                  <div 
                    className="toggle-content" 
                    style={{ 
                      backgroundColor: '#E7EAF3', 
                      padding: '16px', 
                      borderRadius: '8px',
                      marginTop: '8px',
                      whiteSpace: 'pre-line', 
                      fontSize: '14px', 
                      color: '#333',
                      lineHeight: '1.6',
                      border: '1px solid #d1d5e5'
                    }}
                  >
                    {translation}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mock-right-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {group.questions?.map((q) => (
            <div className="mock-question-container" key={q.id}>
              <QuestionMCQ
                question={q}
                answer={answers[q.id]}
                showAnswer={showAnswer}
                onAnswer={handleAnswer}
                hideOptionsText={false}
                hideQuestionNumber={false}
                availableOptions={['A', 'B', 'C', 'D']}
                questionNumberFormat="dot"
                inlineQuestionContent={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// ==================== Main QuizPage ====================

const QuizPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [exercise, setExercise] = useState(null);
  const [combinedExercises, setCombinedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerReviewMode, setAnswerReviewMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(120 * 60);
  const [submitNotice, setSubmitNotice] = useState('');
  const [submitResult, setSubmitResult] = useState(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [incompleteModalOpen, setIncompleteModalOpen] = useState(false);
  const [showPartBreakdown, setShowPartBreakdown] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    setLoadError('');
    const query = new URLSearchParams(location.search);
    const requestedMinutes = Number(query.get('time')) || 120;

    if (slug === 'combined') {
      const ids = (query.get('ids') || '')
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);

      if (ids.length === 0) {
        setExercise(null);
        setCombinedExercises([]);
        setLoadError('Chưa chọn part nào để làm bài.');
        setLoading(false);
        return;
      }

      Promise.all(ids.map((id) => getExerciseDetailById(id).then((res) => res.data)))
        .then((items) => {
          setCombinedExercises(items);
          setExercise({
            id: 'combined',
            exerciseType: 'COMBINED',
            topicName: query.get('test') || 'TOEIC Full Test',
            title: 'Đề thi TOEIC tổng hợp',
          });
          setCurrentIndex(0);
          setAnswers({});
          setShowAnswer(false);
          setAnswerReviewMode(false);
          setSubmitNotice('');
          setSubmitResult(null);
          setResultModalOpen(false);
          setIncompleteModalOpen(false);
          setShowPartBreakdown(false);
          setRemainingSeconds(requestedMinutes * 60);
        })
        .catch(() => {
          setExercise(null);
          setCombinedExercises([]);
          setLoadError('Không thể tải bài test tổng hợp. Hãy kiểm tra dữ liệu Part 1-7 rồi thử lại.');
        })
        .finally(() => setLoading(false));
      return;
    }

    getExerciseDetailById(slug)
      .then((res) => {
        setCombinedExercises([]);
        setExercise(res.data);
        setCurrentIndex(0);
        setAnswers({});
        setShowAnswer(false);
        setAnswerReviewMode(false);
        setSubmitNotice('');
        setSubmitResult(null);
        setResultModalOpen(false);
        setIncompleteModalOpen(false);
        setShowPartBreakdown(false);
        setRemainingSeconds(requestedMinutes * 60);
      })
      .catch(() => {
        setExercise(null);
        setCombinedExercises([]);
        setLoadError('Không thể tải đề thi. Hãy khởi động lại backend rồi thử lại.');
      })
      .finally(() => setLoading(false));
  }, [slug, location.search]);

  useEffect(() => {
    setShowAnswer(false);
  }, [currentIndex]);

  const exerciseType = exercise?.exerciseType || 'GRAMMAR';
  const isCombined = exerciseType === 'COMBINED';
  const isGrouped = !isCombined && isGroupedExerciseType(exerciseType);
  const questions = exercise?.questions || [];
  const groups = exercise?.questionGroups || [];

  const combinedItems = useMemo(() => {
    if (!isCombined) return [];

    const hasSkillIntro = {
      LISTENING: false,
      READING: false,
    };

    return combinedExercises.flatMap((item) => {
      const itemType = item.exerciseType || 'GRAMMAR';
      const partLabel = EXERCISE_PART_LABELS[itemType] || itemType.replaceAll('_', ' ');
      const skill = isListeningExerciseType(itemType) ? 'LISTENING' : (itemType.startsWith('READING') ? 'READING' : null);
      const itemsForExercise = [];
      const intro = getExerciseIntro(item);

      if (intro) {
        itemsForExercise.push({
          kind: 'intro',
          exerciseType: itemType,
          partLabel,
          intro,
          firstGroup: item.questionGroups?.[0],
          questions: [],
        });
      } else if (skill && !hasSkillIntro[skill]) {
        hasSkillIntro[skill] = true;
        itemsForExercise.push({
          kind: 'intro',
          exerciseType: skill,
          partLabel: skill,
          intro: SECTION_INTROS[skill],
          firstGroup: item.questionGroups?.[0],
          questions: [],
        });
      }

      if (isGroupedExerciseType(itemType)) {
        const groupItems = (item.questionGroups || []).flatMap((group) => {
          if (itemType === 'LISTENING_PART1' || itemType === 'LISTENING_PART2') {
            return (group.questions || []).map((question) => ({
              kind: 'group',
              exerciseType: itemType,
              partLabel,
              group: {
                ...group,
                questions: [question],
              },
              questions: [question],
            }));
          }

          return [{
          kind: 'group',
          exerciseType: itemType,
          partLabel,
          group,
          questions: group.questions || [],
          }];
        });

        return [...itemsForExercise, ...groupItems];
      }

      const questionItems = (item.questions || []).map((question) => ({
        kind: 'question',
        exerciseType: itemType,
        partLabel,
        question,
        questions: [question],
      }));

      return [...itemsForExercise, ...questionItems];
    });
  }, [isCombined, combinedExercises]);

  const currentCombinedItem = isCombined ? combinedItems[currentIndex] : null;
  const currentCombinedQuestions = currentCombinedItem?.questions || [];

  const allQuestions = useMemo(() => {
    if (isCombined) return combinedItems.flatMap((item) => item.questions || []);
    if (!isGrouped) return questions;
    return groups.flatMap((group) => group.questions || []);
  }, [isCombined, combinedItems, isGrouped, questions, groups]);

  const questionPartGroups = useMemo(() => {
    const groupMap = new Map();

    const addQuestion = (question, exerciseType, partLabel) => {
      if (!question) return;
      if (!groupMap.has(partLabel)) {
        groupMap.set(partLabel, {
          partLabel,
          exerciseType,
          questions: [],
        });
      }
      groupMap.get(partLabel).questions.push(question);
    };

    if (isCombined) {
      combinedItems.forEach((item) => {
        if (!item?.questions?.length) return;
        const partLabel = item.partLabel || EXERCISE_PART_LABELS[item.exerciseType] || item.exerciseType;
        item.questions.forEach((question) => addQuestion(question, item.exerciseType, partLabel));
      });
      return Array.from(groupMap.values());
    }

    const partLabel = EXERCISE_PART_LABELS[exerciseType] || exerciseType.replaceAll('_', ' ');
    allQuestions.forEach((question) => addQuestion(question, exerciseType, partLabel));
    return Array.from(groupMap.values());
  }, [allQuestions, combinedItems, exerciseType, isCombined]);

  const totalItems = isCombined ? combinedItems.length : (isGrouped ? groups.length : questions.length);

  const handleAnswer = useCallback((questionId, option) => {
    if (submitResult) return;
    if (answers[questionId] === option) return;

    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);
    setSubmitNotice('');
  }, [answers, submitResult]);

  const findReviewIndex = useCallback((startIndex, direction) => {
    if (!isCombined) return Math.max(0, Math.min(totalItems - 1, startIndex));
    let nextIndex = startIndex;
    while (nextIndex >= 0 && nextIndex < totalItems) {
      const item = combinedItems[nextIndex];
      if (item?.kind !== 'intro' && item?.questions?.length > 0) return nextIndex;
      nextIndex += direction;
    }
    return currentIndex;
  }, [combinedItems, currentIndex, isCombined, totalItems]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((index) => {
      const target = index - 1;
      return answerReviewMode ? findReviewIndex(target, -1) : Math.max(0, target);
    });
  }, [answerReviewMode, findReviewIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((index) => {
      const target = index + 1;
      return answerReviewMode ? findReviewIndex(target, 1) : Math.min(totalItems - 1, target);
    });
  }, [answerReviewMode, findReviewIndex, totalItems]);

  const handleListeningEnded = useCallback(() => {
    if (submitResult) return;
    handleNext();
  }, [handleNext, submitResult]);

  const getItemLabel = (idx) => {
    if (isCombined) {
      const item = combinedItems[idx];
      if (item?.kind === 'intro') return item.partLabel + ' • Hướng dẫn';
      const questionNumbers = item?.questions?.map((question) => question.questionNumber);
      if (!item || !questionNumbers || questionNumbers.length === 0) return 'Mục ' + (idx + 1);
      const questionLabel = questionNumbers.length === 1
        ? 'Câu ' + questionNumbers[0]
        : 'Câu ' + questionNumbers[0] + '-' + questionNumbers[questionNumbers.length - 1];
      return item.partLabel + ' • ' + questionLabel;
    }

    if (isGrouped) {
      const group = groups[idx];
      const questionNumbers = group?.questions?.map((question) => question.questionNumber);
      if (!questionNumbers || questionNumbers.length === 0) return 'Nhóm ' + (idx + 1);
      if (questionNumbers.length === 1) return 'Câu ' + questionNumbers[0];
      return 'Câu ' + questionNumbers[0] + '-' + questionNumbers[questionNumbers.length - 1];
    }
    return 'Câu ' + (questions[idx]?.questionNumber || idx + 1);
  };

  const getQuestionGridStatus = (question) => {
    if (!question) return '';
    if (isCombined) {
      const itemIndex = combinedItems.findIndex((item) => item.questions?.some((itemQuestion) => itemQuestion.id === question.id));
      if (itemIndex === currentIndex) return 'current';
    } else if (isGrouped) {
      const groupIndex = groups.findIndex((group) => group.questions?.some((item) => item.id === question.id));
      if (groupIndex === currentIndex) return 'current';
    } else {
      const questionIndex = questions.findIndex((item) => item.id === question.id);
      if (questionIndex === currentIndex) return 'current';
    }
    if (answers[question.id]) return 'answered';
    return '';
  };

  const isQuestionNavigable = (question) => {
    if (!question) return false;
    if (answerReviewMode) return true;
    const activeExerciseType = isCombined ? currentCombinedItem?.exerciseType : exerciseType;
    if (isListeningExerciseType(activeExerciseType)) return false;

    if (isCombined) {
      const item = combinedItems.find((combinedItem) => combinedItem.questions?.some((itemQuestion) => itemQuestion.id === question.id));
      return isReadingExerciseType(item?.exerciseType);
    }
    return isReadingExerciseType(exerciseType);
  };

  const handleGridClick = (question) => {
    if (!isQuestionNavigable(question)) return;
    if (isCombined) {
      const itemIndex = combinedItems.findIndex((item) => item.questions?.some((itemQuestion) => itemQuestion.id === question.id));
      if (itemIndex >= 0) setCurrentIndex(itemIndex);
    } else if (isGrouped) {
      const groupIndex = groups.findIndex((group) => group.questions?.some((item) => item.id === question.id));
      if (groupIndex >= 0) setCurrentIndex(groupIndex);
    } else {
      const questionIndex = questions.findIndex((item) => item.id === question.id);
      if (questionIndex >= 0) setCurrentIndex(questionIndex);
    }
  };

  if (loading) return (
    <div className="quiz-loading zen-quiz-loading">
      <div className="spinner"></div>
      <p>Đang tải đề thi...</p>
    </div>
  );

  if (loadError) return (
    <main className="online-tests-page">
      <div className="online-tests-error">
        {loadError}
      </div>
      <section className="online-tests-toolbar">
        <div>
          <strong>Đề thi chưa tải được</strong>
          <span>Backend cần chạy phiên bản mới có API /api/v1/exercises/:id.</span>
        </div>
        <button onClick={() => navigate('/online-tests')}>Quay lại danh sách đề</button>
      </section>
    </main>
  );

  if (!exercise) return null;

  const renderExerciseContent = () => {
    if (isCombined) {
      const item = currentCombinedItem;
      if (!item) return null;

      if (item.kind === 'intro') {
        return (
          <ListeningPartIntroLayout
            intro={item.intro}
            firstGroup={item.firstGroup}
            onComplete={handleListeningEnded}
            enableAudio={isListeningExerciseType(item.exerciseType)}
          />
        );
      }

      switch (item.exerciseType) {
        case 'LISTENING_PART1':
          return <ListeningPart1Layout groups={[item.group]} currentGroupIndex={0} answers={answers} showAnswer={answerReviewMode} handleAnswer={handleAnswer} autoPlay={!answerReviewMode} lockedAudio={!answerReviewMode} onAudioEnded={answerReviewMode ? undefined : handleListeningEnded} />;
        case 'LISTENING_PART2':
          return <ListeningPart2Layout groups={[item.group]} currentGroupIndex={0} answers={answers} showAnswer={answerReviewMode} handleAnswer={handleAnswer} autoPlay={!answerReviewMode} lockedAudio={!answerReviewMode} onAudioEnded={answerReviewMode ? undefined : handleListeningEnded} />;
        case 'LISTENING_PART3':
        case 'LISTENING_PART4':
          return <ListeningGroupLayout groups={[item.group]} currentGroupIndex={0} answers={answers} showAnswer={answerReviewMode} handleAnswer={handleAnswer} autoPlay={!answerReviewMode} lockedAudio={!answerReviewMode} onAudioEnded={answerReviewMode ? undefined : handleListeningEnded} />;
        case 'READING_PART6':
        case 'READING_PART7':
          return <ReadingPassageLayout groups={[item.group]} currentGroupIndex={0} answers={answers} showAnswer={answerReviewMode} handleAnswer={handleAnswer} />;
        case 'READING_PART5':
          return <ReadingPart5Layout questions={[item.question]} currentIndex={0} answers={answers} showAnswer={answerReviewMode} handleAnswer={handleAnswer} />;
        case 'GRAMMAR':
        default:
          return <GrammarLayout questions={[item.question]} currentIndex={0} setCurrentIndex={setCurrentIndex} answers={answers} showAnswer={answerReviewMode} handleAnswer={handleAnswer} />;
      }
    }

    switch (exerciseType) {
      case 'LISTENING_PART1':
        return <ListeningPart1Layout groups={groups} currentGroupIndex={currentIndex} answers={answers} showAnswer={answerReviewMode} handleAnswer={handleAnswer} />;
      case 'LISTENING_PART2':
        return <ListeningPart2Layout groups={groups} currentGroupIndex={currentIndex} answers={answers} showAnswer={answerReviewMode} handleAnswer={handleAnswer} />;
      case 'LISTENING_PART3':
      case 'LISTENING_PART4':
        return <ListeningGroupLayout groups={groups} currentGroupIndex={currentIndex} answers={answers} showAnswer={answerReviewMode} handleAnswer={handleAnswer} />;
      case 'READING_PART6':
      case 'READING_PART7':
        return <ReadingPassageLayout groups={groups} currentGroupIndex={currentIndex} answers={answers} showAnswer={answerReviewMode} handleAnswer={handleAnswer} />;
      case 'READING_PART5':
        return <ReadingPart5Layout questions={questions} currentIndex={currentIndex} answers={answers} showAnswer={answerReviewMode} handleAnswer={handleAnswer} />;
      case 'GRAMMAR':
      default:
        return <GrammarLayout questions={questions} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} answers={answers} showAnswer={answerReviewMode} handleAnswer={handleAnswer} />;
    }
  };

  const getExerciseTitle = () => {
    if (isCombined) return 'Bài test TOEIC tổng hợp';

    if (exercise.topicSlug === 'topic-part6-luyen-tap-hinh-thuc-van-ban') {
      const mapping = {
        1: 'Thư điện tử / thư tay',
        2: 'Bài báo / bài đánh giá',
        3: 'Quảng cáo',
        4: 'Thông báo / hướng dẫn',
        5: 'Thông báo nội bộ'
      };
      if (mapping[exercise.orderIndex]) return mapping[exercise.orderIndex];
    }
    return 'Trắc nghiệm format TOEIC';
  };

  const answeredCount = allQuestions.filter((question) => answers[question.id]).length;
  const progressPercent = allQuestions.length > 0 ? Math.round((answeredCount / allQuestions.length) * 100) : 0;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeText = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  const currentQuestionLabel = getItemLabel(currentIndex);
  const partName = exercise.topicName || exercise.title || 'Đề thi TOEIC online';
  const exerciseTypeLabel = isCombined ? 'Listening + Reading' : exerciseType.replaceAll('_', ' ');
  const currentItemIsIntro = currentCombinedItem?.kind === 'intro';
  const currentDisplayType = isCombined ? currentCombinedItem?.exerciseType : exerciseType;
  const currentPartHeading = (() => {
    if (currentItemIsIntro) return currentCombinedItem?.intro?.title || 'HƯỚNG DẪN';
    const match = currentDisplayType?.match(/PART(\d)/);
    return match ? `PART ${match[1]}` : 'PART 1';
  })();
  const currentItemIsListening = isCombined
    ? isListeningExerciseType(currentCombinedItem?.exerciseType)
    : isListeningExerciseType(exerciseType);
  const currentItemIsReading = isCombined
    ? isReadingExerciseType(currentCombinedItem?.exerciseType)
    : isReadingExerciseType(exerciseType);
  const reviewPrevIndex = answerReviewMode ? findReviewIndex(currentIndex - 1, -1) : Math.max(0, currentIndex - 1);
  const reviewNextIndex = answerReviewMode ? findReviewIndex(currentIndex + 1, 1) : Math.min(totalItems - 1, currentIndex + 1);
  const disablePrevNav = answerReviewMode ? reviewPrevIndex === currentIndex : currentIndex === 0;
  const disableNextNav = answerReviewMode ? reviewNextIndex === currentIndex : currentIndex === totalItems - 1;
  const showDictationButton = !isCombined && (
    exerciseType === 'LISTENING_PART1' ||
    exerciseType === 'LISTENING_PART2' ||
    exerciseType === 'LISTENING_PART3' ||
    exerciseType === 'LISTENING_PART4'
  );
  const handleRestart = () => {
    setAnswers({});
    setShowAnswer(false);
    setAnswerReviewMode(false);
    setSubmitResult(null);
    setResultModalOpen(false);
    setIncompleteModalOpen(false);
    setShowPartBreakdown(false);
    setCurrentIndex(0);
    setRemainingSeconds(120 * 60);
  };

  const handleSubmit = (force = false) => {
    if (!force && answeredCount < allQuestions.length) {
      setIncompleteModalOpen(true);
      return;
    }

    const correctCount = allQuestions.filter((question) => answers[question.id] === question.correctAnswer).length;
    const totalCount = allQuestions.length;
    const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    const answered = answeredCount;

    const listeningQuestions = allQuestions.filter((question) => {
      if (!isCombined) return exerciseType.startsWith('LISTENING');
      const item = combinedItems.find((combinedItem) => combinedItem.questions?.some((itemQuestion) => itemQuestion.id === question.id));
      return item?.exerciseType?.startsWith('LISTENING');
    });
    const readingQuestions = allQuestions.filter((question) => {
      if (!isCombined) return exerciseType.startsWith('READING');
      const item = combinedItems.find((combinedItem) => combinedItem.questions?.some((itemQuestion) => itemQuestion.id === question.id));
      return item?.exerciseType?.startsWith('READING');
    });

    const listeningCorrect = listeningQuestions.filter((question) => answers[question.id] === question.correctAnswer).length;
    const readingCorrect = readingQuestions.filter((question) => answers[question.id] === question.correctAnswer).length;
    const listeningScore = calculateSectionScore(listeningCorrect, listeningQuestions.length);
    const readingScore = calculateSectionScore(readingCorrect, readingQuestions.length);
    const partBreakdown = Array.from({ length: 7 }, (_, index) => {
      const partNumber = index + 1;
      const partQuestions = allQuestions.filter((question) => {
        if (!isCombined) return exerciseType === `LISTENING_PART${partNumber}` || exerciseType === `READING_PART${partNumber}`;
        const item = combinedItems.find((combinedItem) => combinedItem.questions?.some((itemQuestion) => itemQuestion.id === question.id));
        return item?.exerciseType === `LISTENING_PART${partNumber}` || item?.exerciseType === `READING_PART${partNumber}`;
      });
      return {
        part: partNumber,
        correct: partQuestions.filter((question) => answers[question.id] === question.correctAnswer).length,
        total: partQuestions.length,
      };
    });

    setShowAnswer(false);
    setAnswerReviewMode(false);
    setSubmitResult({
      correctCount,
      totalCount,
      answered,
      score,
      listeningCorrect,
      listeningTotal: listeningQuestions.length,
      listeningScore,
      readingCorrect,
      readingTotal: readingQuestions.length,
      readingScore,
      totalToeicScore: listeningScore + readingScore,
      partBreakdown,
    });
    setSubmitNotice('');
    setIncompleteModalOpen(false);
    setShowPartBreakdown(false);
    setResultModalOpen(true);
  };

  return (
    <div className={`quiz-layout zen-exam-layout toeic-exam-skin ${currentItemIsReading && !currentItemIsIntro ? 'reading-exam-skin' : ''} ${answerReviewMode ? 'answer-review-skin' : ''}`}>
      <div className="zen-exam-topbar">
        <div className="zen-exam-brand">
          <span className="zen-exam-mark">TOEIC</span>
          <div>
            <p>Hệ thống thi trực tuyến</p>
            <strong>{partName}</strong>
          </div>
        </div>
        <div className="zen-exam-actions">
          {answerReviewMode ? (
            <>
              <button className="zen-action review" onClick={handleRestart}>Làm lại</button>
              <button className="zen-action review" onClick={() => navigate('/online-tests')}>Thoát</button>
            </>
          ) : (
            <>
              <button className="zen-action primary" onClick={() => handleSubmit()}>Nộp bài</button>
              <div className="toeic-header-timer">{timeText}</div>
            </>
          )}
          <div className="toeic-header-user">{user?.fullName || 'Guest (khách)'}</div>
          <button
            className="toeic-header-grid"
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Mở bảng câu hỏi"
          >
            <span></span><span></span><span></span>
            <span></span><span></span><span></span>
            <span></span><span></span><span></span>
          </button>
          <button className="zen-action subtle" onClick={() => navigate(-1)}>Thoát</button>
        </div>
      </div>

      <div className="zen-exam-status">
        <div className="zen-status-card timer">
          <span>Thời gian còn lại</span>
          <strong>{timeText}</strong>
        </div>
        <div className="zen-status-card">
          <span>Thí sinh</span>
          <strong>{user?.fullName || 'Guest (khách)'}</strong>
        </div>
        <div className="zen-status-card">
          <span>Tiến độ</span>
          <strong>{answeredCount}/{allQuestions.length} câu</strong>
        </div>
        <div className="zen-status-progress" aria-label={'Đã làm ' + progressPercent + '%'}>
          <span style={{ width: progressPercent + '%' }}></span>
        </div>
      </div>

      <div className="quiz-body zen-exam-body">
        <aside className={'quiz-sidebar zen-exam-sidebar ' + (sidebarOpen ? 'open' : 'collapsed')}>
          <button className="zen-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span>{sidebarOpen ? 'Ẩn bảng câu hỏi' : 'Hiện'}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={sidebarOpen ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
            </svg>
          </button>

          {sidebarOpen && (
            <div className="zen-sidebar-content">
              <div className="toeic-drawer-map">
                {questionPartGroups.map((partGroup) => (
                  <section className="toeic-drawer-part" key={partGroup.partLabel}>
                    <div className="toeic-drawer-title">{partGroup.partLabel}</div>
                    <div className="toeic-drawer-grid">
                      {partGroup.questions.map((question) => {
                        const navigable = isQuestionNavigable(question);
                        return (
                          <button
                            key={question.id}
                            className={'toeic-drawer-question ' + getQuestionGridStatus(question) + (!navigable ? ' locked' : '')}
                            onClick={() => handleGridClick(question)}
                            disabled={!navigable}
                            aria-label={(navigable ? 'Đi tới câu ' : 'Câu Listening bị khóa ') + question.questionNumber}
                          >
                            {question.questionNumber}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="quiz-main zen-exam-main">
          <section className="zen-exam-intro">
            <div>
              <button className="zen-back-link" onClick={() => navigate(-1)}>← Quay lại</button>
              <h1>{currentPartHeading}</h1>
              <p>{getExerciseTitle()} • {allQuestions.length} câu • {exerciseTypeLabel}</p>
            </div>
            {(answerReviewMode || currentItemIsReading) && !currentItemIsIntro && (
              <div className="reading-top-nav">
                <button className="reading-nav-btn" onClick={handlePrev} disabled={disablePrevNav}>
                  <span className="reading-nav-icon">←</span>
                  <span>Câu trước</span>
                </button>
                <button className="reading-nav-btn" onClick={handleNext} disabled={disableNextNav}>
                  <span>Câu tiếp</span>
                  <span className="reading-nav-icon">→</span>
                </button>
              </div>
            )}
            <div className="toeic-score-box">{answeredCount}/200</div>
          </section>

          {submitNotice && <div className="zen-submit-notice">{submitNotice}</div>}

          {showDictationButton && (
            <div className="quiz-toolbar mock-toolbar zen-exam-toolbar">
              <button className="quiz-btn btn-outline mock-toolbar-btn zen-dictation-btn" onClick={() => navigate('/exercises/' + slug + '/dictation')}>
                Luyện nghe chép chính tả
              </button>
            </div>
          )}

          <section className="zen-question-stage">{renderExerciseContent()}</section>

          {!currentItemIsListening && !currentItemIsReading && !currentItemIsIntro && (
            <div className="quiz-nav-grid-container zen-bottom-nav">
              <button className="quiz-nav-btn" onClick={handlePrev} disabled={disablePrevNav}>← Câu trước</button>
              <div className="zen-bottom-count">
                <span>{currentQuestionLabel}</span>
                <strong>{progressPercent}% hoàn thành</strong>
              </div>
              <button className="quiz-nav-btn" onClick={handleNext} disabled={disableNextNav}>Câu tiếp →</button>
            </div>
          )}

          {exercise.nextTopicName && (
            <button className="quiz-finish-next-btn" onClick={() => navigate('/topics/' + exercise.nextTopicSlug)}>
              Hoàn thành và học bài tiếp theo →
            </button>
          )}
        </main>
      </div>

      {incompleteModalOpen && (
        <div className="toeic-result-overlay" role="dialog" aria-modal="true" aria-labelledby="toeic-incomplete-title">
          <section className="toeic-result-modal toeic-incomplete-modal">
            <div className="toeic-result-title" id="toeic-incomplete-title">HOÀN THÀNH BÀI KIỂM TRA</div>
            <div className="toeic-result-body toeic-incomplete-body">
              <p>Bạn đã hoàn thành {answeredCount}/{allQuestions.length} câu hỏi. Hoàn thành tất cả trước khi gửi bài.</p>
            </div>
            <div className="toeic-result-actions toeic-incomplete-actions">
              <button className="toeic-result-submit-now" type="button" onClick={() => handleSubmit(true)}>
                GỬI BÀI NGAY
              </button>
              <button className="toeic-result-close" type="button" onClick={() => setIncompleteModalOpen(false)}>
                ĐÓNG
              </button>
            </div>
          </section>
        </div>
      )}

      {submitResult && resultModalOpen && (
        <div className="toeic-result-overlay" role="dialog" aria-modal="true" aria-labelledby="toeic-result-title">
          <section className="toeic-result-modal">
            <div className="toeic-result-title" id="toeic-result-title">HOÀN THÀNH BÀI KIỂM TRA</div>
            <div className="toeic-result-body">
              <p>Bài kiểm tra của bạn đã được xử lý. Hãy chụp lại màn hình kết quả vì nó sẽ chỉ hiển thị 1 lần. Kết quả:</p>
              <p><strong>Số câu đúng: {submitResult.correctCount}/{submitResult.totalCount}</strong></p>
              <p><strong>Listening: {submitResult.listeningCorrect}/{submitResult.listeningTotal} - {submitResult.listeningScore} điểm</strong></p>
              <p><strong>Reading: {submitResult.readingCorrect}/{submitResult.readingTotal} - {submitResult.readingScore} điểm</strong></p>
              <p><strong>Tổng điểm: {submitResult.totalToeicScore} điểm</strong></p>
              {showPartBreakdown && (
                <div className="toeic-part-breakdown">
                  {submitResult.partBreakdown?.map((part) => (
                    <p key={part.part}><strong>Part {part.part}: {part.correct}/{part.total}</strong></p>
                  ))}
                </div>
              )}
              <button className="toeic-result-link" type="button" onClick={() => setShowPartBreakdown(true)}>
                Xem số câu đúng mỗi part
              </button>
            </div>
            <div className="toeic-result-actions">
              <button
                className="toeic-result-answer"
                type="button"
                onClick={() => {
                  setShowAnswer(true);
                  setAnswerReviewMode(true);
                  if (currentCombinedItem?.kind === 'intro') {
                    setCurrentIndex(findReviewIndex(currentIndex + 1, 1));
                  }
                  setResultModalOpen(false);
                }}
              >
                XEM ĐÁP ÁN
              </button>
              <button className="toeic-result-close" type="button" onClick={() => navigate('/online-tests')}>
                ĐÓNG
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
