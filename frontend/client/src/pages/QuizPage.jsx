import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExerciseDetailById } from '../services/api';
import { getFullUrl } from '../utils/urlUtils';
import { useAuth } from '../context/AuthContext';

// ==================== Sub-components ====================

/** Audio Player dùng chung cho Listening */
export const AudioPlayer = ({ audioUrl, label }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const audioRef = useRef(null);

  if (!audioUrl) return null;
  const fullUrl = getFullUrl(audioUrl);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
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
    }
  };

  const changeSpeed = (rate) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSpeedMenu(false);
    }
  };

  const handleReload = () => {
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
    <div className="custom-audio-player">
      <audio
        ref={audioRef}
        src={fullUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      <button className="audio-play-btn" onClick={togglePlay}>
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
      <input
        type="range"
        className="audio-progress-bar"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        style={{ '--progress': `${(currentTime / (duration || 1)) * 100}%` }}
      />
      <span className="audio-time">
        {formatTime(currentTime)}
      </span>
      <div className="audio-volume-control">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368" onClick={toggleMute} style={{cursor: 'pointer'}}>
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
          style={{ '--progress': `${volume * 100}%` }}
        />
      </div>
      <div style={{ position: 'relative' }}>
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
        </div>
    </div>
  );
};

/** Một câu hỏi MCQ (dùng lại cho mọi layout) */
export const QuestionMCQ = ({ question, answer, showAnswer, onAnswer, hideOptionsText = false, hideQuestionNumber = false, availableOptions }) => {
  if (!question) return null;

  const options = availableOptions || ['A', 'B', 'C', 'D'];
  const isCorrect = showAnswer && answer && answer === question.correctAnswer;

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
          <div className="question-number">Q{question.questionNumber}:</div>
          <p className="question-content">{question.content}</p>
        </>
      )}
      {!hideQuestionNumber && !question.content && (
        <div className="question-number">Câu {question.questionNumber}</div>
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
      {showAnswer && answer && question.explanation && (
        <div className={`explanation-box ${isCorrect ? 'correct' : 'wrong'}`}>
          <div style={{ marginBottom: '8px' }}>
            <strong>{isCorrect ? '✓ Đúng!' : '✗ Sai!'}</strong>
            <span> Đáp án: {question.correctAnswer}</span>
          </div>
          <div className="explanation-text" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
            {question.explanation}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== Layout Components ====================

/** Layout cho GRAMMAR & READING_PART5 — MCQ thuần, navigate từng câu */
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

/** Layout cho LISTENING_PART1 — Audio + Image + 1 câu MCQ, navigate từng group */
export const ListeningPart1Layout = ({ groups, currentGroupIndex, answers, showAnswer, handleAnswer }) => {
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
        <AudioPlayer audioUrl={group.audioUrl} label={`Câu ${question?.questionNumber || ''}`} />
      </div>
      <div className="mock-split-row">
        <div className="mock-left-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {group.imageUrl && (
            <div className="mock-image-container">
              <img src={getFullUrl(group.imageUrl)} alt={`Hình câu ${question?.questionNumber}`} />
            </div>
          )}
          
          <div className="transcript-translation-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {transcript && (
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
                {showTranscript && (
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
                Q{question.questionNumber}:
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

/** Layout cho LISTENING_PART2 — Audio + 1 câu MCQ (3 đáp án A,B,C) */
export const ListeningPart2Layout = ({ groups, currentGroupIndex, answers, showAnswer, handleAnswer }) => {
  const group = groups[currentGroupIndex];
  if (!group) return null;
  const question = group.questions?.[0];

  return (
    <div className="part1-mock-layout">
      <div className="mock-audio-row">
        <AudioPlayer audioUrl={group.audioUrl} label={`Câu ${question?.questionNumber || ''}`} />
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

/** Layout cho LISTENING_PART3 & PART4 — Audio + N câu MCQ, navigate theo group */
export const ListeningGroupLayout = ({ groups, currentGroupIndex, answers, showAnswer, handleAnswer }) => {
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
        <AudioPlayer audioUrl={group.audioUrl} label={`Nhóm ${currentGroupIndex + 1}`} />
      </div>
      <div className="mock-split-row" style={{ alignItems: 'flex-start', gap: '24px' }}>
        <div className="mock-left-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {group.imageUrl && (
            <div className="mock-image-container" style={{ border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', width: '100%' }}>
              <img src={getFullUrl(group.imageUrl)} alt="Hình minh hoạ" style={{ width: '100%', display: 'block' }} />
            </div>
          )}
          
          <div className="transcript-translation-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {transcript && (
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
                {showTranscript && (
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
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Layout cho READING_PART6 & PART7 — Split view: Passage (trái) + N câu MCQ (phải) */
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
              <img src={getFullUrl(group.imageUrl)} alt="Hình minh hoạ" style={{ width: '100%', display: 'block' }} />
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
              <div 
                className="english-passage-content" 
                style={{ 
                  whiteSpace: 'pre-line', 
                  fontSize: '14px', 
                  color: '#333',
                  lineHeight: '1.6',
                }}
              >
                {englishPassage}
              </div>
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
  const { user } = useAuth();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [autoNext, setAutoNext] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(120 * 60);
  const [submitNotice, setSubmitNotice] = useState('');
  const [loadError, setLoadError] = useState('');
  const autoNextTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    setLoadError('');
    getExerciseDetailById(slug)
      .then((res) => {
        setExercise(res.data);
        setCurrentIndex(0);
        setAnswers({});
        setShowAnswer(false);
        setSubmitNotice('');
        setRemainingSeconds(120 * 60);
      })
      .catch(() => {
        setExercise(null);
        setLoadError('Không thể tải đề thi. Hãy khởi động lại backend rồi thử lại.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    setShowAnswer(false);
  }, [currentIndex]);

  const exerciseType = exercise?.exerciseType || 'GRAMMAR';
  const isGrouped = exerciseType !== 'GRAMMAR' && exerciseType !== 'READING_PART5';
  const questions = exercise?.questions || [];
  const groups = exercise?.questionGroups || [];

  const allQuestions = useMemo(() => {
    if (!isGrouped) return questions;
    return groups.flatMap((group) => group.questions || []);
  }, [isGrouped, questions, groups]);

  const totalItems = isGrouped ? groups.length : questions.length;

  const handleAnswer = useCallback((questionId, option) => {
    if (answers[questionId] === option) return;
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);

    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);
    setSubmitNotice('');

    if (autoNext) {
      if (!isGrouped) {
        const question = questions.find((item) => item.id === questionId);
        if (question) {
          setShowAnswer(true);
          if (option === question.correctAnswer && currentIndex < totalItems - 1) {
            autoNextTimeoutRef.current = setTimeout(() => setCurrentIndex((index) => index + 1), 1500);
          }
        }
      } else {
        const currentGroup = groups[currentIndex];
        if (currentGroup?.questions) {
          const isAllAnswered = currentGroup.questions.every((question) => newAnswers[question.id]);
          if (isAllAnswered) {
            setShowAnswer(true);
            const allCorrect = currentGroup.questions.every((question) => newAnswers[question.id] === question.correctAnswer);
            if (allCorrect && currentIndex < totalItems - 1) {
              autoNextTimeoutRef.current = setTimeout(() => setCurrentIndex((index) => index + 1), 1500);
            }
          }
        }
      }
    }
  }, [answers, autoNext, currentIndex, totalItems, isGrouped, questions, groups]);

  const handlePrev = () => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const handleNext = () => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    setCurrentIndex((index) => Math.min(totalItems - 1, index + 1));
  };

  const handleCheckAnswer = () => setShowAnswer(true);

  const handleClear = () => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    setAnswers({});
    setShowAnswer(false);
    setSubmitNotice('');
  };

  const getItemLabel = (idx) => {
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
    if (isGrouped) {
      const groupIndex = groups.findIndex((group) => group.questions?.some((item) => item.id === question.id));
      if (groupIndex === currentIndex) return 'current';
    } else {
      const questionIndex = questions.findIndex((item) => item.id === question.id);
      if (questionIndex === currentIndex) return 'current';
    }
    if (answers[question.id]) return 'answered';
    return '';
  };

  const handleGridClick = (question) => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    if (isGrouped) {
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
    switch (exerciseType) {
      case 'LISTENING_PART1':
        return <ListeningPart1Layout groups={groups} currentGroupIndex={currentIndex} answers={answers} showAnswer={showAnswer} handleAnswer={handleAnswer} />;
      case 'LISTENING_PART2':
        return <ListeningPart2Layout groups={groups} currentGroupIndex={currentIndex} answers={answers} showAnswer={showAnswer} handleAnswer={handleAnswer} />;
      case 'LISTENING_PART3':
      case 'LISTENING_PART4':
        return <ListeningGroupLayout groups={groups} currentGroupIndex={currentIndex} answers={answers} showAnswer={showAnswer} handleAnswer={handleAnswer} />;
      case 'READING_PART6':
      case 'READING_PART7':
        return <ReadingPassageLayout groups={groups} currentGroupIndex={currentIndex} answers={answers} showAnswer={showAnswer} handleAnswer={handleAnswer} />;
      case 'GRAMMAR':
      case 'READING_PART5':
      default:
        return <GrammarLayout questions={questions} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} answers={answers} showAnswer={showAnswer} handleAnswer={handleAnswer} />;
    }
  };

  const getExerciseTitle = () => {
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
  const exerciseTypeLabel = exerciseType.replaceAll('_', ' ');

  const handleSubmit = () => {
    setShowAnswer(true);
    setSubmitNotice('Đã ghi nhận ' + answeredCount + '/' + allQuestions.length + ' câu trả lời. Bạn có thể xem đáp án hoặc làm lại bài.');
  };

  return (
    <div className="quiz-layout zen-exam-layout">
      <div className="zen-exam-topbar">
        <div className="zen-exam-brand">
          <span className="zen-exam-mark">TOEIC</span>
          <div>
            <p>Hệ thống thi trực tuyến</p>
            <strong>{partName}</strong>
          </div>
        </div>
        <div className="zen-exam-actions">
          <button className="zen-action primary" onClick={handleSubmit}>Nộp bài</button>
          <button className="zen-action" onClick={handleClear}>Làm lại</button>
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
              <div className="zen-part-card">
                <span>Đề thi online</span>
                <strong>{exerciseTypeLabel}</strong>
                <p>{currentQuestionLabel}</p>
              </div>

              <div className="zen-note">
                <strong>Lưu ý</strong>
                <p>Hãy dùng Google Chrome khi làm bài. Nếu đáp án không hiển thị đúng, bấm Ctrl + F5 để tải lại.</p>
              </div>

              <div className="zen-question-map">
                <div className="zen-map-title">Câu hỏi</div>
                <div className="question-grid zen-grid">
                  {allQuestions.map((question, index) => (
                    <button
                      key={question.id}
                      className={'grid-btn ' + getQuestionGridStatus(question)}
                      onClick={() => handleGridClick(question)}
                      aria-label={'Đi tới câu ' + (index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="zen-map-legend">
                <span><i className="legend-current"></i>Đang làm</span>
                <span><i className="legend-answered"></i>Đã chọn</span>
                <span><i></i>Chưa làm</span>
              </div>
            </div>
          )}
        </aside>

        <main className="quiz-main zen-exam-main">
          <section className="zen-exam-intro">
            <div>
              <button className="zen-back-link" onClick={() => navigate(-1)}>← Quay lại</button>
              <h1>Đề thi online</h1>
              <p>{getExerciseTitle()} • {allQuestions.length} câu • {exerciseTypeLabel}</p>
            </div>
            <div className="zen-current-chip">{currentQuestionLabel}</div>
          </section>

          {submitNotice && <div className="zen-submit-notice">{submitNotice}</div>}

          <div className="quiz-toolbar mock-toolbar zen-exam-toolbar">
            <button className="quiz-btn btn-outline mock-toolbar-btn mock-btn-check" onClick={handleCheckAnswer}>Kiểm tra đáp án</button>
            <button className="quiz-btn btn-outline mock-toolbar-btn" onClick={handleClear}>Xóa lựa chọn</button>
            <label className="toggle-switch zen-auto-next">
              <input type="checkbox" checked={autoNext} onChange={() => setAutoNext(!autoNext)} />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Tự động chuyển câu</span>
            </label>
            {(exerciseType === 'LISTENING_PART1' || exerciseType === 'LISTENING_PART2' || exerciseType === 'LISTENING_PART3' || exerciseType === 'LISTENING_PART4') && (
              <button className="quiz-btn btn-outline mock-toolbar-btn zen-dictation-btn" onClick={() => navigate('/exercises/' + slug + '/dictation')}>
                Luyện nghe chép chính tả
              </button>
            )}
          </div>

          <section className="zen-question-stage">{renderExerciseContent()}</section>

          <div className="quiz-nav-grid-container zen-bottom-nav">
            <button className="quiz-nav-btn" onClick={handlePrev} disabled={currentIndex === 0}>← Câu trước</button>
            <div className="zen-bottom-count">
              <span>{currentQuestionLabel}</span>
              <strong>{progressPercent}% hoàn thành</strong>
            </div>
            <button className="quiz-nav-btn" onClick={handleNext} disabled={currentIndex === totalItems - 1}>Câu tiếp →</button>
          </div>

          {exercise.nextTopicName && (
            <button className="quiz-finish-next-btn" onClick={() => navigate('/topics/' + exercise.nextTopicSlug)}>
              Hoàn thành và học bài tiếp theo →
            </button>
          )}
        </main>
      </div>
    </div>
  );
};

export default QuizPage;
