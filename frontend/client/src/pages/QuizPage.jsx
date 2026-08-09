import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExerciseDetailById } from '../services/api';
import { getFullUrl } from '../utils/urlUtils';
import Header from '../components/Header';

// ==================== Sub-components ====================

/** Audio Player dùng chung cho Listening */
export const AudioPlayer = ({ audioUrl, startMs = 0, endMs = null, label }) => {
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
  const segmentStart = (startMs || 0) / 1000;
  const segmentEnd = endMs ? endMs / 1000 : null;
  const segmentDuration = segmentEnd != null ? Math.max(segmentEnd - segmentStart, 0) : null;

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const syncToSegmentStart = (play = false) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = segmentStart;
    setCurrentTime(0);
    if (play) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    if (audioRef.current.currentTime < segmentStart || (segmentEnd != null && audioRef.current.currentTime >= segmentEnd)) {
      audioRef.current.currentTime = segmentStart;
    }
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(() => setIsPlaying(true)).catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    } else {
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const rawTime = audioRef.current.currentTime;
    if (segmentEnd != null && rawTime >= segmentEnd) {
      audioRef.current.pause();
      audioRef.current.currentTime = segmentEnd;
      setCurrentTime(segmentDuration || 0);
      setIsPlaying(false);
      return;
    }
    setCurrentTime(Math.max(rawTime - segmentStart, 0));
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(segmentDuration != null ? segmentDuration : audioRef.current.duration);
    if (audioRef.current.currentTime < segmentStart || audioRef.current.currentTime === 0) {
      audioRef.current.currentTime = segmentStart;
      setCurrentTime(0);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    const absolute = segmentStart + time;
    audioRef.current.currentTime = absolute;
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
    if (!audioRef.current) return;
    audioRef.current.pause();
    syncToSegmentStart(true);
    setShowSpeedMenu(false);
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
      <span className="audio-time">{formatTime(currentTime)}{segmentDuration != null ? ` / ${formatTime(segmentDuration)}` : ''}</span>
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
          {question.content !== `(${question.questionNumber})` && (
            <p className="question-content">{question.content}</p>
          )}
        </>
      )}
      {!hideQuestionNumber && !question.content && (
        <div className="question-number">Q{question.questionNumber}:</div>
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
        <AudioPlayer audioUrl={group.audioUrl} startMs={group.audioStartMs} endMs={group.audioEndMs} label={`Câu ${question?.questionNumber || ''}`} />
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
        <AudioPlayer audioUrl={group.audioUrl} startMs={group.audioStartMs} endMs={group.audioEndMs} label={`Câu ${question?.questionNumber || ''}`} />
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
        <AudioPlayer audioUrl={group.audioUrl} startMs={group.audioStartMs} endMs={group.audioEndMs} label={`Nhóm ${currentGroupIndex + 1}`} />
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
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // cho GRAMMAR/PART5: index câu hỏi; cho grouped: index group
  const [answers, setAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [autoNext, setAutoNext] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const autoNextTimeoutRef = useRef(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    getExerciseDetailById(slug)
      .then((res) => {
        setExercise(res.data);
        setCurrentIndex(0);
        setAnswers({});
        setShowAnswer(false);
      })
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [slug]);

  // Khôi phục trạng thái đáp án khi chuyển sang câu khác
  useEffect(() => {
    setShowAnswer(false);
  }, [currentIndex]);

  // Xác định loại exercise
  const exerciseType = exercise?.exerciseType || 'GRAMMAR';
  const isGrouped = exerciseType !== 'GRAMMAR' && exerciseType !== 'READING_PART5';

  // Dữ liệu câu hỏi
  const questions = exercise?.questions || [];
  const groups = exercise?.questionGroups || [];

  // Tất cả câu hỏi (flatten) — dùng cho sidebar, grid, đếm
  const allQuestions = useMemo(() => {
    if (!isGrouped) return questions;
    return groups.flatMap(g => g.questions || []);
  }, [isGrouped, questions, groups]);

  // Số lượng item để navigate (câu hỏi hoặc group)
  const totalItems = isGrouped ? groups.length : questions.length;
  const currentItem = isGrouped ? groups[currentIndex] : questions[currentIndex];

  const handleAnswer = useCallback((questionId, option) => {
    // Ngăn chặn sự kiện click kép (do label bọc radio input kích hoạt cả onChange và onClick)
    if (answers[questionId] === option) return;

    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
    }

    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);

    // Auto-next logic
    if (autoNext) {
      if (!isGrouped) {
        const q = questions.find(qq => qq.id === questionId);
        if (q) {
          setShowAnswer(true);
          if (option === q.correctAnswer) {
            if (currentIndex < totalItems - 1) {
              autoNextTimeoutRef.current = setTimeout(() => {
                setCurrentIndex((i) => i + 1);
              }, 1500); // Đợi 1.5s
            }
          }
        }
      } else {
        const currentGroup = groups[currentIndex];
        if (currentGroup && currentGroup.questions) {
          const isAllAnswered = currentGroup.questions.every(gq => newAnswers[gq.id]);
          if (isAllAnswered) {
            setShowAnswer(true);
            const allCorrect = currentGroup.questions.every(gq => newAnswers[gq.id] === gq.correctAnswer);
            if (allCorrect) {
              if (currentIndex < totalItems - 1) {
                autoNextTimeoutRef.current = setTimeout(() => {
                  setCurrentIndex((i) => i + 1);
                }, 1500);
              }
            }
          }
        }
      }
    }
  }, [answers, autoNext, currentIndex, totalItems, isGrouped, questions, groups]);

  const handlePrev = () => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    setCurrentIndex((i) => Math.max(0, i - 1));
  };
  const handleNext = () => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    setCurrentIndex((i) => Math.min(totalItems - 1, i + 1));
  };
  const handleCheckAnswer = () => setShowAnswer(true);
  const handleClear = () => { 
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    setAnswers({}); 
    setShowAnswer(false); 
  };

  // Sidebar: item status
  const getItemStatus = (idx) => {
    if (idx === currentIndex) return 'active';
    if (isGrouped) {
      const g = groups[idx];
      const allAnswered = g?.questions?.every(q => answers[q.id]);
      return allAnswered ? 'done' : '';
    } else {
      const q = questions[idx];
      return q && answers[q.id] ? 'done' : '';
    }
  };

  // Sidebar label
  const getItemLabel = (idx) => {
    if (isGrouped) {
      const g = groups[idx];
      const qNums = g?.questions?.map(q => q.questionNumber);
      if (!qNums || qNums.length === 0) return `Nhóm ${idx + 1}`;
      if (qNums.length === 1) return `Câu ${qNums[0]}`;
      return `Câu ${qNums[0]}–${qNums[qNums.length - 1]}`;
    }
    return `Câu ${questions[idx]?.questionNumber || idx + 1}`;
  };

  // Question grid status (flat, cho tất cả câu hỏi)
  const getQuestionGridStatus = (q) => {
    if (!q) return '';
    // Tìm xem câu này thuộc group/index nào đang active
    if (isGrouped) {
      const gIdx = groups.findIndex(g => g.questions?.some(gq => gq.id === q.id));
      if (gIdx === currentIndex) return 'current';
    } else {
      const qIdx = questions.findIndex(qq => qq.id === q.id);
      if (qIdx === currentIndex) return 'current';
    }
    if (answers[q.id]) return 'answered';
    return '';
  };

  // Click vào question grid → navigate đến đúng group/question
  const handleGridClick = (q) => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    if (isGrouped) {
      const gIdx = groups.findIndex(g => g.questions?.some(gq => gq.id === q.id));
      if (gIdx >= 0) setCurrentIndex(gIdx);
    } else {
      const qIdx = questions.findIndex(qq => qq.id === q.id);
      if (qIdx >= 0) setCurrentIndex(qIdx);
    }
  };

  if (loading) return (
    <div className="quiz-loading">
      <div className="spinner"></div>
      <p>Đang tải bài tập...</p>
    </div>
  );

  if (!exercise) return null;

  // Render layout phù hợp
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
        1: 'Thư điện tử/ thư tay (Email/ Letter)',
        2: 'Bài báo (Article/ Review)',
        3: 'Quảng cáo (Advertisement)',
        4: 'Thông báo/ văn bản hướng dẫn (Notice/ Announcement Information)',
        5: 'Thông báo nội bộ (Memo)'
      };
      if (mapping[exercise.orderIndex]) return mapping[exercise.orderIndex];
    }
    return 'Trắc nghiệm format TOEIC';
  };

  return (
    <div className="quiz-layout">
      <Header />
      <div className="quiz-body">
        {/* Sidebar trái */}
        <aside className={`quiz-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
          <div className="quiz-sidebar-header" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ backgroundColor: '#3b5998', color: 'white', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: 'none' }}>
            <span style={{ fontWeight: '600', fontSize: '15px' }}>{exercise.topicName || 'Luyện tập'}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={sidebarOpen ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
            </svg>
          </div>
          {sidebarOpen && (
            <div className="quiz-sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="sidebar-menu-items" style={{ padding: '0' }}>
                <div className="sidebar-item" style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                  <span><strong>Video bài giảng:</strong> Lý thuyết</span>
                </div>
                <div className="sidebar-item active" style={{ padding: '16px', backgroundColor: '#e8f0fe', borderLeft: '4px solid #3b5998', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                  <span><strong>Luyện tập:</strong> {getExerciseTitle()}</span>
                </div>
                <div className="sidebar-item" style={{ padding: '16px', borderBottom: '1px solid #eee', color: '#666', cursor: 'pointer' }} onClick={() => navigate(exercise.sectionSlug ? `/course/${exercise.sectionSlug}` : -1)}>
                  ← Quay lại chương trình học
                </div>
                
                {exercise.nextTopicName && (
                  <div className="sidebar-next-lesson" style={{ padding: '24px 16px' }}>
                    <div style={{ color: '#666', marginBottom: '12px' }}>Bài học tiếp theo:</div>
                    <div style={{ cursor: 'pointer', fontWeight: '500', paddingLeft: '16px', color: '#1a1a1a' }} onClick={() => navigate(`/topics/${exercise.nextTopicSlug}`)}>
                      {exercise.nextTopicName}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* Vùng nội dung chính */}
        <div className="quiz-main">
          {/* Breadcrumb */}
          <div className="quiz-breadcrumb">
            <span className="bc-link" onClick={() => navigate(-1)}>← Quay lại</span>
            <span className="bc-sep"> / </span>
            <span>Luyện tập: {exercise.exerciseType}</span>
          </div>

          {/* Toolbar */}
          <div className="quiz-toolbar mock-toolbar">
            <button className="quiz-btn btn-outline mock-toolbar-btn mock-btn-check" onClick={handleCheckAnswer}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Kiểm tra đáp án
            </button>
            <button className="quiz-btn btn-outline mock-toolbar-btn" onClick={handleClear}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              Xoá hết
            </button>
          </div>

          {/* Exercise Content — render theo exerciseType */}
          {renderExerciseContent()}

          {/* Navigation & Question grid */}
          <div className="quiz-nav-grid-container" style={{ background: 'white', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
            <div className="quiz-nav-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button className="quiz-nav-btn" onClick={handlePrev} disabled={currentIndex === 0} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e8f0fe', color: '#35509a', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentIndex === 0 ? 0.5 : 1 }}>
                ‹ Câu trước
              </button>

              <label className="toggle-switch" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={autoNext}
                    onChange={() => setAutoNext(!autoNext)}
                    style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer', zIndex: 2 }}
                  />
                  <div style={{ width: '40px', height: '22px', background: autoNext ? '#35509a' : '#ccc', borderRadius: '20px', position: 'relative', transition: 'background-color 0.2s' }}>
                    <div style={{ position: 'absolute', top: '2px', left: autoNext ? '20px' : '2px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></div>
                  </div>
                </div>
                <span className="toggle-label" style={{ fontSize: '14px', color: '#333' }}>Tự động chuyển câu</span>
              </label>

              <button className="quiz-nav-btn" onClick={handleNext} disabled={currentIndex === totalItems - 1} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e8f0fe', color: '#35509a', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: currentIndex === totalItems - 1 ? 'not-allowed' : 'pointer', opacity: currentIndex === totalItems - 1 ? 0.5 : 1 }}>
                Câu sau ›
              </button>
            </div>

            <div className="question-grid-inner">
              <div className="question-grid-title" style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>
                {isGrouped ? 'Danh sách đoạn văn:' : 'Danh sách bài tập:'}
              </div>
              <div className="question-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(isGrouped ? groups : questions).map((item, idx) => {
                  let isCurrent = false;
                  let isAnswered = false;
                  
                  if (isGrouped) {
                    isCurrent = idx === currentIndex;
                    isAnswered = item.questions?.length > 0 && item.questions.every(q => answers[q.id]);
                  } else {
                    isCurrent = getQuestionGridStatus(item) === 'current';
                    isAnswered = getQuestionGridStatus(item) === 'answered';
                  }
                  
                  let bgColor = 'white';
                  let textColor = '#333';
                  let borderColor = '#ccc';
                  
                  if (isCurrent) {
                    bgColor = '#35509a';
                    textColor = 'white';
                    borderColor = '#35509a';
                  } else if (isAnswered) {
                    bgColor = '#f0f4ff';
                    textColor = '#35509a';
                    borderColor = '#35509a';
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
                        setCurrentIndex(idx);
                      }}
                      style={{ 
                        width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '4px', border: `1px solid ${borderColor}`, background: bgColor,
                        color: textColor, cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s'
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Footer Next Lesson Button */}
          {exercise.nextTopicName && (
            <button 
              className="quiz-finish-next-btn"
              onClick={() => navigate(`/topics/${exercise.nextTopicSlug}`)}
              style={{
                width: '100%',
                padding: '24px',
                marginTop: '32px',
                backgroundColor: 'transparent',
                color: '#1a1a1a',
                border: 'none',
                borderTop: '1px solid #e0e0e0',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#35509a'}
              onMouseOut={(e) => e.currentTarget.style.color = '#1a1a1a'}
            >
              HOÀN THÀNH & HỌC BÀI TIẾP THEO <span style={{ fontSize: '18px' }}>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
