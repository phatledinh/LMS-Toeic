import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExerciseDetailById, getExercisesByTopic } from '../services/api';
import { getFullUrl } from '../utils/urlUtils';
import { AudioPlayer } from './QuizPage';
import { useSilenceDetection } from '../hooks/useSilenceDetection';
import { useDictation, parseTranscript } from '../hooks/useDictation';
import Header from '../components/Header';

// ==================== DictationPage ====================

const DictationPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Exercise data
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [siblingExercises, setSiblingExercises] = useState([]);

  // Dictation state
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [activeTab, setActiveTab] = useState('dictation'); // 'dictation' | 'transcript'
  const [userInputs, setUserInputs] = useState({});
  const [checkedSentences, setCheckedSentences] = useState(new Set());
  const [showAnswerSentences, setShowAnswerSentences] = useState(new Set());
  const [autoReplay, setAutoReplay] = useState(false);
  const [autoNext, setAutoNext] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Transcript state
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [repeatTranscript, setRepeatTranscript] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);

  // Audio state
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  // Refs
  const blankRefs = useRef({});
  const audioRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const transcriptRefs = useRef({});

  // Fetch exercise
  useEffect(() => {
    setLoading(true);
    getExerciseDetailById(slug)
      .then(res => {
        setExercise(res.data);
        setCurrentGroupIndex(0);
        setCurrentSentenceIndex(0);
        setUserInputs({});
        setCheckedSentences(new Set());
        setShowAnswerSentences(new Set());
        setIsAudioStarted(false);

        if (res.data && res.data.topicId) {
          getExercisesByTopic(res.data.topicId)
            .then(exList => {
              setSiblingExercises((exList.data || []).sort((a, b) => a.orderIndex - b.orderIndex));
            })
            .catch(err => console.error('Error fetching sibling exercises:', err));
        }
      })
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [slug]);

  // Dữ liệu
  const exerciseType = exercise?.exerciseType || 'LISTENING_PART3';
  const groups = exercise?.questionGroups || [];
  const currentGroup = groups[currentGroupIndex] || null;
  const audioUrl = currentGroup ? getFullUrl(currentGroup.audioUrl) : null;

  // Silence detection
  const { segments, loading: segmentsLoading, error: segmentsError } = useSilenceDetection(audioUrl);

  // Dictation logic
  const { sentences, sentenceSegments, totalBlanks, checkSentence, getStats } = useDictation(
    exerciseType,
    currentGroup,
    difficulty
  );

  // Reset khi chuyển group hoặc difficulty
  useEffect(() => {
    setCurrentSentenceIndex(0);
    setUserInputs({});
    setCheckedSentences(new Set());
    setShowAnswerSentences(new Set());
    setIsAudioStarted(false);
  }, [currentGroupIndex, difficulty]);

  // Reset isAudioStarted khi chuyển câu
  useEffect(() => {
    setIsAudioStarted(false);
  }, [currentSentenceIndex]);

  // Tổng số câu trong tất cả groups
  const allSentenceCounts = useMemo(() => {
    return groups.map(g => {
      const transcript = parseTranscript(exerciseType, g);
      return transcript.length;
    });
  }, [groups, exerciseType]);

  // === Audio Control ===

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setAudioProgress(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  }, []);

  const handleSliderChange = useCallback((e) => {
    const newTime = parseFloat(e.target.value);
    setAudioProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  }, []);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '00:00';
    const m = Math.floor(time / 60).toString().padStart(2, '0');
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const playCurrentSentence = useCallback(() => {
    if (!audioRef.current || !segments.length) return;
    
    setIsAudioStarted(true);

    const offset = Math.max(0, segments.length - sentences.length);
    const audioSegmentIndex = currentSentenceIndex + offset;
    
    const segment = segments[audioSegmentIndex] || segments[currentSentenceIndex];
    if (!segment) return;

    if (pauseTimerRef.current) {
      clearInterval(pauseTimerRef.current);
    }

    const audio = audioRef.current;
    audio.currentTime = segment.start;
    audio.play().catch(e => console.log('Play failed:', e));

    pauseTimerRef.current = setInterval(() => {
      if (audio.currentTime >= segment.end - 0.05) {
        audio.pause();
        clearInterval(pauseTimerRef.current);
        pauseTimerRef.current = null;

        // Auto next in Transcript tab when audio finishes
        if (activeTab === 'transcript' && autoNext) {
          if (currentSentenceIndex < sentences.length - 1) {
            setTimeout(() => {
              setCurrentSentenceIndex(prev => prev + 1);
            }, 500);
          }
        }
      }
    }, 50);
  }, [segments, currentSentenceIndex, sentences.length, activeTab, autoNext]);

  // Auto-play khi chuyển câu
  useEffect(() => {
    if (segments.length > 0 && currentSentenceIndex < segments.length) {
      // Delay nhỏ để UI render xong
      const timer = setTimeout(() => playCurrentSentence(), 300);
      return () => clearTimeout(timer);
    }
  }, [currentSentenceIndex, segments]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearInterval(pauseTimerRef.current);
    };
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    if (activeTab === 'transcript' && transcriptRefs.current[currentSentenceIndex]) {
      transcriptRefs.current[currentSentenceIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentSentenceIndex, activeTab]);

  // === Navigation ===

  const goNextSentence = useCallback(() => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
    }
  }, [currentSentenceIndex, sentences.length]);

  const goPrevSentence = useCallback(() => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(prev => prev - 1);
    }
  }, [currentSentenceIndex]);

  // === Dictation Actions ===

  const handleCheck = useCallback(() => {
    checkSentence(currentSentenceIndex, userInputs);
    setCheckedSentences(prev => new Set([...prev, currentSentenceIndex]));

    // Check if all answers in this sentence are correct
    const segs = sentenceSegments[currentSentenceIndex];
    let allCorrect = true;
    if (segs) {
      segs.forEach(seg => {
        if (seg.type === 'blank') {
          const input = (userInputs[seg.id] || '').trim().toLowerCase();
          const expected = seg.value.trim().toLowerCase();
          if (input !== expected) {
            allCorrect = false;
          }
        }
      });
    }

    // Auto replay nếu bật
    if (autoReplay) {
      setTimeout(() => playCurrentSentence(), 500);
    }

    // Auto next nếu bật và trả lời đúng hết
    if (autoNext && allCorrect) {
      setTimeout(() => goNextSentence(), 1500);
    }
  }, [currentSentenceIndex, userInputs, checkSentence, autoReplay, autoNext, playCurrentSentence, goNextSentence, sentenceSegments]);

  // Auto-check as the user types when autoNext is enabled
  useEffect(() => {
    if (!autoNext) return;
    const segs = sentenceSegments[currentSentenceIndex];
    if (!segs) return;
    
    let allCorrect = true;
    let hasBlanks = false;
    segs.forEach(seg => {
      if (seg.type === 'blank') {
        hasBlanks = true;
        const input = (userInputs[seg.id] || '').trim().toLowerCase();
        const expected = seg.value.trim().toLowerCase();
        if (input !== expected) {
          allCorrect = false;
        }
      }
    });

    if (hasBlanks && allCorrect && !checkedSentences.has(currentSentenceIndex)) {
      handleCheck();
    }
  }, [userInputs, autoNext, sentenceSegments, currentSentenceIndex, checkedSentences, handleCheck]);

  const handleShowAnswer = useCallback(() => {
    // Điền đáp án đúng vào tất cả blanks của câu hiện tại
    const segs = sentenceSegments[currentSentenceIndex];
    if (!segs) return;

    const newInputs = { ...userInputs };
    segs.forEach(seg => {
      if (seg.type === 'blank') {
        newInputs[seg.id] = seg.value;
      }
    });
    setUserInputs(newInputs);
    setCheckedSentences(prev => new Set([...prev, currentSentenceIndex]));
    setShowAnswerSentences(prev => new Set([...prev, currentSentenceIndex]));
  }, [currentSentenceIndex, sentenceSegments, userInputs]);

  const handleClearAll = useCallback(() => {
    const segs = sentenceSegments[currentSentenceIndex];
    if (!segs) return;

    const newInputs = { ...userInputs };
    segs.forEach(seg => {
      if (seg.type === 'blank') {
        delete newInputs[seg.id];
      }
    });
    setUserInputs(newInputs);
    setCheckedSentences(prev => {
      const next = new Set(prev);
      next.delete(currentSentenceIndex);
      return next;
    });
    setShowAnswerSentences(prev => {
      const next = new Set(prev);
      next.delete(currentSentenceIndex);
      return next;
    });
  }, [currentSentenceIndex, sentenceSegments, userInputs]);

  const handleInputChange = useCallback((blankId, value) => {
    setUserInputs(prev => ({ ...prev, [blankId]: value }));
  }, []);

  // === Focus Management ===

  const focusNextBlank = useCallback((currentBlankId) => {
    const segs = sentenceSegments[currentSentenceIndex];
    if (!segs) return;

    const blanks = segs.filter(s => s.type === 'blank');
    const currentIdx = blanks.findIndex(b => b.id === currentBlankId);
    if (currentIdx < blanks.length - 1) {
      const nextId = blanks[currentIdx + 1].id;
      blankRefs.current[nextId]?.focus();
    }
  }, [sentenceSegments, currentSentenceIndex]);

  const handleBlankKeyDown = useCallback((e, blankId) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      focusNextBlank(blankId);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleCheck();
    }
  }, [focusNextBlank, handleCheck]);

  // === Global Keyboard Shortcuts ===

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Bỏ qua nếu đang focus vào input
      const isInputFocused = document.activeElement?.tagName === 'INPUT';

      if (e.key === 'l' || e.key === 'L') {
        if (!isInputFocused) {
          e.preventDefault();
          playCurrentSentence();
        }
      } else if (e.key === 'ArrowLeft' && e.shiftKey) {
        e.preventDefault();
        goPrevSentence();
      } else if (e.key === 'ArrowRight' && e.shiftKey) {
        e.preventDefault();
        goNextSentence();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playCurrentSentence, goPrevSentence, goNextSentence]);

  // === Render Helpers ===

  const isCurrentChecked = checkedSentences.has(currentSentenceIndex);
  const isCurrentShowAnswer = showAnswerSentences.has(currentSentenceIndex);

  const getBlankStatus = (blankId, expectedValue) => {
    if (!isCurrentChecked) return '';
    const input = (userInputs[blankId] || '').trim();
    if (!input) return '';
    // return correct or wrong. No 'show-answer' status needed anymore
    return input.toLowerCase() === expectedValue.trim().toLowerCase() ? 'correct' : 'wrong';
  };

  const getGroupGridStatus = (idx) => {
    if (idx === currentGroupIndex) return 'active';
    // optionally mark done if all sentences in group are checked, but for now just active is enough
    return '';
  };

  // === Loading ===

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="spinner"></div>
        <p>Đang tải bài tập...</p>
      </div>
    );
  }

  if (!exercise) return null;

  const renderDictationArea = () => {
    const segs = sentenceSegments[currentSentenceIndex];
    if (!segs || segs.length === 0) {
      return <div className="dictation-area-empty">Không có dữ liệu transcript cho câu này.</div>;
    }

    const shouldShow = isAudioStarted || isCurrentChecked || isCurrentShowAnswer;
    if (!shouldShow) {
      return null;
    }

    return (
      <div className="dictation-area" style={{ 
        backgroundColor: '#fff', 
        padding: '32px 24px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
        border: '1px solid #eaeaea', 
        margin: '24px auto',
        maxWidth: '800px',
        textAlign: 'center'
      }}>
        <div className="dictation-sentence-display" style={{ fontSize: '18px', lineHeight: '2', color: '#333' }}>
          {segs.map((seg, idx) => {
            if (seg.type === 'text') {
              return (
                <span key={idx} className="dictation-text">
                  {seg.leading}{seg.value}{seg.trailing}
                </span>
              );
            }

            // Blank
            const status = getBlankStatus(seg.id, seg.value);
            const inputWidth = difficulty === 'SENTENCE'
              ? '100%'
              : `${Math.max(seg.value.length * 10 + 20, 60)}px`;

            return (
              <span key={idx} className="dictation-blank-wrapper">
                <span className="dictation-leading">{seg.leading}</span>
                <input
                  ref={el => { blankRefs.current[seg.id] = el; }}
                  type="text"
                  className={`dictation-blank ${status}`}
                  style={{ 
                    width: inputWidth,
                    border: 'none',
                    borderBottom: status === 'correct' ? '2px solid #10b981' : status === 'wrong' ? '2px solid #ef4444' : '1px solid #ccc',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    textAlign: 'center',
                    fontSize: 'inherit',
                    padding: '0 4px',
                    margin: '0 4px',
                    color: status === 'correct' ? '#10b981' : status === 'wrong' ? '#ef4444' : 'inherit'
                  }}
                  value={userInputs[seg.id] || ''}
                  onChange={(e) => handleInputChange(seg.id, e.target.value)}
                  onKeyDown={(e) => handleBlankKeyDown(e, seg.id)}
                  autoComplete="off"
                  spellCheck="false"
                />
                <span className="dictation-trailing">{seg.trailing}</span>
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTranscriptView = () => {
    return (
      <div className="dictation-transcript-view" style={{ borderTop: '1px solid #eee', paddingTop: '12px' }}>
        {/* Controls Row */}
        <div className="transcript-controls-row" style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #eee', marginBottom: '16px', flexWrap: 'wrap' }}>
          <label className="dict2-toggle-switch-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333', cursor: 'pointer' }}>
            <div className="dict2-toggle-switch">
              <input type="checkbox" checked={autoNext} onChange={() => setAutoNext(!autoNext)} />
              <span className="dict2-toggle-slider"></span>
            </div>
            <span style={{fontWeight: 500}}>Tự động chuyển câu</span>
          </label>
          <label className="dict2-toggle-switch-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333', cursor: 'pointer' }}>
            <div className="dict2-toggle-switch">
              <input type="checkbox" checked={showSubtitles} onChange={() => setShowSubtitles(!showSubtitles)} />
              <span className="dict2-toggle-slider"></span>
            </div>
            <span style={{fontWeight: 500}}>Hiện subtitles</span>
          </label>
          <label className="dict2-toggle-switch-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333', cursor: 'pointer' }}>
            <div className="dict2-toggle-switch">
              <input type="checkbox" checked={repeatTranscript} onChange={() => setRepeatTranscript(!repeatTranscript)} />
              <span className="dict2-toggle-slider"></span>
            </div>
            <span style={{fontWeight: 500}}>Repeat</span>
          </label>
          <label className="dict2-toggle-switch-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333', cursor: 'pointer' }}>
            <div className="dict2-toggle-switch">
              <input type="checkbox" checked={highlightMode} onChange={() => setHighlightMode(!highlightMode)} />
              <span className="dict2-toggle-slider"></span>
            </div>
            <span style={{fontWeight: 500}}>Highlight</span>
          </label>
          <button style={{ fontSize: '13px', padding: '6px 12px', border: '1px solid #3b5998', borderRadius: '4px', backgroundColor: '#f0f4ff', color: '#3b5998', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Lưu/khôi phục highlight
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="transcript-content" style={{ padding: '0 16px' }}>
          {showSubtitles && sentences.map((sentence, idx) => {
            // Check if sentence has '---' or newline for translation
            let eng = sentence;
            let vie = '';
            if (sentence.includes('---')) {
              const parts = sentence.split('---');
              eng = parts[0].trim();
              vie = parts[1].trim();
            } else if (sentence.includes('\n')) {
              const parts = sentence.split('\n');
              eng = parts[0].trim();
              vie = parts.slice(1).join(' ').trim();
            }

            return (
              <div 
                key={idx} 
                ref={el => transcriptRefs.current[idx] = el}
                className={`transcript-sentence-block ${idx === currentSentenceIndex ? 'active' : ''}`}
                style={{ 
                  marginBottom: '24px', 
                  paddingBottom: '24px', 
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: idx === currentSentenceIndex && highlightMode ? '#fef08a' : 'transparent',
                  transition: 'background-color 0.3s ease-in-out',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentSentenceIndex(idx)}
              >
                <div style={{ fontSize: '15px', color: '#334155', lineHeight: '1.6', fontWeight: 400 }}>{eng}</div>
                {vie && (
                  <div style={{ fontSize: '14px', fontStyle: 'italic', color: '#64748b', marginTop: '6px', lineHeight: '1.5' }}>
                    {vie}
                  </div>
                )}
              </div>
            );
          })}
          {!showSubtitles && (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
              Subtitles đang bị ẩn. Bật "Hiện subtitles" để xem transcript.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="dict2-layout">
      {/* Hidden audio element */}
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          preload="auto" 
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      )}

      <div className="dict2-body">
        {/* Sidebar */}
        <aside className="dict2-sidebar" style={{ display: sidebarOpen ? 'flex' : 'none' }}>
          <div className="dict2-sidebar-header">
            <h2 title={exercise.topicName}>{exercise.topicName || 'ETS 2023 Test 1'}</h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => setSidebarOpen(false)}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </div>
          <div className="dict2-sidebar-items">
            {siblingExercises.length > 1 ? (
              siblingExercises.map((ex, idx) => (
                <div
                  key={ex.id}
                  className={`dict2-sidebar-item ${ex.id === parseInt(slug) ? 'active' : ''}`}
                  onClick={() => {
                    if (ex.id !== parseInt(slug)) {
                      navigate(`/dictation/${ex.id}`);
                    }
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M15.5 6.5a2 2 0 0 1 2.8 2.8l-8 8H7.5v-2.8l8-8z"></path>
                  </svg>
                  <span><strong style={{ fontWeight: 600 }}>Luyện tập:</strong> Part {idx + 1}</span>
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((part) => (
                <div key={part} className={`dict2-sidebar-item ${part === 1 ? 'active' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M15.5 6.5a2 2 0 0 1 2.8 2.8l-8 8H7.5v-2.8l8-8z"></path>
                  </svg>
                  <span><strong style={{ fontWeight: 600 }}>Luyện tập:</strong> Part {part}</span>
                </div>
              ))
            )}
          </div>
          <div className="dict2-sidebar-footer">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1); }} style={{ color: '#64748b' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Quay lại chương học
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dict2-main">
          {/* Breadcrumb */}
          <div className="dict2-breadcrumb-bar">
            <div className="dict2-breadcrumb-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {!sidebarOpen && (
                <div style={{ cursor: 'pointer' }} onClick={() => setSidebarOpen(true)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </div>
              )}
              <a href="#" onClick={(e) => { e.preventDefault(); goPrevSentence(); }} style={{ opacity: currentSentenceIndex === 0 ? 0.5 : 1, pointerEvents: currentSentenceIndex === 0 ? 'none' : 'auto', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                Bài trước
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); goNextSentence(); }} style={{ opacity: currentSentenceIndex >= sentences.length - 1 ? 0.5 : 1, pointerEvents: currentSentenceIndex >= sentences.length - 1 ? 'none' : 'auto', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                Bài sau
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </a>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px', color: '#64748b' }}>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>

            <div className="dict2-breadcrumb-links" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1); }} style={{ color: '#4f46e5', textDecoration: 'none' }}>Complete TOEIC</a>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1); }} style={{ color: '#4f46e5', textDecoration: 'none' }}>Luyện nghe chép chính tả TOEIC</a>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              <span style={{ color: '#334155' }}>{exercise.topicName || 'ETS 2023 Test 1'}</span>
            </div>
          </div>

          <div className="dict2-content-area">
            {/* Main Exercise Card */}
            <div className="dict2-card">
              <div className="dict2-card-header">
                <h1>{exercise.topicName || 'Luyện nghe'} - Nhóm {currentGroupIndex + 1} - câu {currentSentenceIndex + 1}</h1>
                <div className="dict2-badges">
                  <span className={`dict2-badge ${activeTab === 'dictation' ? 'primary' : 'secondary'}`} style={{ cursor: 'pointer' }} onClick={() => setActiveTab('dictation')}>Luyện nghe chép chính tả</span>
                  <span className={`dict2-badge ${activeTab === 'transcript' ? 'primary' : 'secondary'}`} style={{ cursor: 'pointer' }} onClick={() => setActiveTab('transcript')}>Luyện nghe có transcript</span>
                </div>
              </div>

              {/* Audio Player Section */}
              <div className="dict2-audio-section">
                <button className="dict2-icon-btn" onClick={playCurrentSentence} disabled={segmentsLoading || segments.length === 0}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>
                <input 
                  className="dict2-audio-slider flex-1" 
                  style={{ flex: 1, cursor: 'pointer' }} 
                  type="range" 
                  min="0"
                  max={audioDuration || 100}
                  value={audioProgress}
                  onChange={handleSliderChange}
                />
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', width: '40px', textAlign: 'right' }}>
                  {formatTime(audioProgress)}
                </span>
                <button className="dict2-icon-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></button>
                <input 
                  className="dict2-audio-slider" 
                  style={{ width: '80px', cursor: 'pointer' }} 
                  type="range" 
                  min="0"
                  max="100"
                  defaultValue="80" 
                  onChange={(e) => { if (audioRef.current) audioRef.current.volume = e.target.value / 100; }} 
                />
                <button className="dict2-icon-btn" style={{ marginLeft: '8px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></button>
              </div>

              {segmentsLoading && (
                <div style={{ padding: '8px 16px', color: '#f59e0b', fontSize: '14px', backgroundColor: '#fef3c7', borderRadius: '4px', marginBottom: '16px' }}>
                  ⏳ Đang tải và phân tích đoạn âm thanh, vui lòng chờ...
                </div>
              )}
              {segmentsError && (
                <div style={{ padding: '8px 16px', color: '#ef4444', fontSize: '14px', backgroundColor: '#fee2e2', borderRadius: '4px', marginBottom: '16px' }}>
                  ❌ Lỗi phân tích âm thanh: {segmentsError}. Bạn không thể nghe được audio.
                </div>
              )}

              {/* Dictation / Transcript Content */}
              {activeTab === 'transcript' && renderTranscriptView()}

              {/* Interaction Section Top */}
              {activeTab === 'dictation' && (
                <div className="dict2-interaction-section" style={{ borderBottom: 'none', paddingBottom: '0' }}>
                  <div className="dict2-mode-select">
                    <span>Chọn chế độ:</span>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                      <option value="MEDIUM">Điền từ (trung bình)</option>
                      <option value="HARD">Điền từ (khó)</option>
                      <option value="SENTENCE">Chép cả câu</option>
                    </select>
                  </div>
                  
                  <div className="dict2-btn-group">
                    <button className="dict2-btn" onClick={goPrevSentence} disabled={currentSentenceIndex === 0}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg> Câu trước
                    </button>
                    <button className="dict2-btn" onClick={playCurrentSentence} disabled={segmentsLoading || segments.length === 0}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Nghe lại
                    </button>
                    <button className={`dict2-btn primary`} onClick={handleCheck}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> {isCurrentChecked ? 'Đã kiểm tra' : 'Kiểm tra'}
                    </button>
                    <button className="dict2-btn" onClick={goNextSentence} disabled={currentSentenceIndex >= sentences.length - 1}>
                      Câu sau <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Dictation Area Rendered Here */}
              {activeTab === 'dictation' && renderDictationArea()}

              {/* Interaction Section Bottom */}
              {activeTab === 'dictation' && (
                <div className="dict2-interaction-section" style={{ borderTop: 'none', paddingTop: '0' }}>
                  <div className="dict2-btn-group" style={{ marginTop: '0' }}>
                    <button className="dict2-btn" onClick={handleClearAll}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Xoá hết
                    </button>
                    <button className="dict2-btn" onClick={handleShowAnswer}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> Đáp án
                    </button>
                  </div>

                  <div className="dict2-toggle-row" style={{ marginTop: '16px' }}>
                    <label className="dict2-toggle-switch">
                      <input type="checkbox" checked={autoReplay} onChange={() => setAutoReplay(!autoReplay)} />
                      <span className="dict2-toggle-slider"></span>
                    </label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px' }}><path d="M17 2.1l4 4-4 4"/><path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4"/><path d="M21 11.8v2a4 4 0 0 1-4 4H4.2"/></svg>
                    <span style={{ fontWeight: 500, color: '#333' }}>Tự động phát lại câu</span>
                  </div>
                </div>
              )}

              <div className="dict2-shortcuts-hint">
                <div>Phím tắt: ấn [space] hoặc [tab] để chuyển sang ô trống tiếp theo; [enter] để nộp đáp án hoặc chuyển sang câu tiếp theo; [alt+tab]/[del]/[backspace] để về ô trống trước.</div>
                <div>Ấn [\] để phát lại câu; ấn [shift+sang trái] để chuyển câu trước, ấn [shift+sang phải] để chuyển câu sau.</div>
              </div>
            </div>

            {/* Question Navigation Card */}
            <div className="dict2-card dict2-nav-card">
              <div className="dict2-nav-card-top">
                <button className="dict2-btn" onClick={() => setCurrentGroupIndex(prev => prev > 0 ? prev - 1 : 0)} disabled={currentGroupIndex === 0}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg> Câu trước
                </button>
                <div className="dict2-toggle-row" style={{ marginTop: 0, fontWeight: 500, color: '#334155' }}>
                  {/* Keep Tự động chuyển câu here if needed or empty space to center */}
                </div>
                <button className="dict2-btn" onClick={() => setCurrentGroupIndex(prev => prev < groups.length - 1 ? prev + 1 : prev)} disabled={currentGroupIndex >= groups.length - 1}>
                  Câu sau <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
              
              <div>
                <h3 className="dict2-grid-title">Danh sách bài tập:</h3>
                <div className="dict2-grid">
                  {groups.map((_, idx) => {
                    const status = getGroupGridStatus(idx);
                    let classNames = "dict2-grid-btn";
                    if (status === 'active') classNames += " active";
                    else if (status === 'done') classNames += " done";

                    return (
                      <button key={idx} className={classNames} onClick={() => setCurrentGroupIndex(idx)}>
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="dict2-bottom-bar">
            <button className="dict2-finish-btn" onClick={() => navigate(-1)}>
              HOÀN THÀNH & HỌC BÀI TIẾP THEO 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DictationPage;
