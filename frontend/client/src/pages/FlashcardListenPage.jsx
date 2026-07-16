import { useRef, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDeck } from '../hooks/useDeck';
import { getTtsUrl } from '../services/api';
import DeckSidebar from '../components/DeckSidebar';

// Reusable Audio Player for Listen Practice
const ListenAudioPlayer = ({ audioUrl, autoPlay, word }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioUrl && autoPlay && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Auto-play failed', e));
      setIsPlaying(true);
    }
  }, [audioUrl, autoPlay]);

  if (!audioUrl) return null;

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
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
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
      audioRef.current.play();
      setIsPlaying(true);
      setShowSpeedMenu(false);
    }
  };

  const handleError = () => {
    if (window.speechSynthesis && word) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word.word);
      u.lang = 'en-US';
      u.rate = playbackRate;
      u.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(u);
    }
  };

  const speedOptions = [0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2];

  return (
    <div className="custom-audio-player">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onError={handleError}
      />
      <button className="audio-play-btn" onClick={togglePlay}>
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
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
      <span className="audio-time">{formatTime(currentTime)}</span>
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
        </div>
          {showSpeedMenu && (
            <div className="audio-speed-menu">
              <div className="speed-menu-header">Speed</div>
              {speedOptions.map(rate => (
                <div key={rate} className={`speed-option ${playbackRate === rate ? 'active' : ''}`} onClick={() => changeSpeed(rate)}>
                  {playbackRate === rate && <span className="speed-check">●</span>}
                  <span className="speed-label">{rate === 1 ? 'Normal' : `${rate}x`}</span>
                </div>
              ))}
              <div className="speed-option reload-btn" onClick={handleReload}>Reload File</div>
            </div>
          )}
        </div>
    </div>
  );
};

const FlashcardListenPage = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { deck, words, loading, error } = useDeck(listId);

  const [displayedWords, setDisplayedWords] = useState([]);
  const [targetWord, setTargetWord] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState(new Set());
  const [correctAttempt, setCorrectAttempt] = useState(null);
  const [autoNext, setAutoNext] = useState(true);

  // Initialize game when words are loaded
  useEffect(() => {
    if (words && words.length > 0 && displayedWords.length === 0) {
      setupNewRound(words);
    }
  }, [words]);

  const setupNewRound = (allWords, currentDisplay = []) => {
    let nextDisplay = [...currentDisplay];

    // If grid is empty, pick 9 random words
    if (nextDisplay.length === 0) {
      const shuffled = [...allWords].sort(() => 0.5 - Math.random());
      nextDisplay = shuffled.slice(0, Math.min(9, allWords.length));
    } 

    setDisplayedWords(nextDisplay);
    
    // Pick random target from current display
    const newTarget = nextDisplay[Math.floor(Math.random() * nextDisplay.length)];
    setTargetWord(newTarget);
    setWrongAttempts(new Set());
    setCorrectAttempt(null);
  };

  const handleWordClick = (word) => {
    // Prevent interaction if already correct
    if (correctAttempt) return;

    if (word.id === targetWord.id) {
      // Correct!
      setCorrectAttempt(word.id);
      
      setTimeout(() => {
        // Replace this word with a new random word not currently displayed
        const notDisplayed = words.filter(w => !displayedWords.some(dw => dw.id === w.id));
        const newWord = notDisplayed.length > 0 
          ? notDisplayed[Math.floor(Math.random() * notDisplayed.length)]
          : words[Math.floor(Math.random() * words.length)]; // Fallback if deck < 9 words
          
        const newDisplay = displayedWords.map(dw => dw.id === word.id ? newWord : dw);
        setupNewRound(words, newDisplay);
      }, 1000);
    } else {
      // Wrong!
      setWrongAttempts(prev => new Set(prev).add(word.id));
    }
  };

  if (loading) return <div className="fqp-container"><p style={{padding:32}}>Đang tải...</p></div>;
  if (error) return <div className="fqp-container"><p className="error-msg" style={{padding:32}}>{error}</p></div>;
  if (!words || !words.length) return <div className="fqp-container"><p style={{padding:32}}>Không có từ vựng</p></div>;

  return (
    <div className="fc-preview-layout">
      <DeckSidebar deck={deck} activeMode="listen" />
      <main className="fc-preview-main" style={{display: 'flex', flexDirection: 'column'}}>
        {/* Top Navigation Bar */}
        <header className="fqp-top-nav" style={{position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #e5e7eb', backgroundColor: 'white'}}>
          <nav className="fqp-breadcrumb" aria-label="Breadcrumb">
            <Link to="#">Complete TOEIC</Link>
            <i className="fa-solid fa-chevron-right"></i>
            <Link to="/flashcards">Từ vựng TOEIC</Link>
            <i className="fa-solid fa-chevron-right"></i>
            <span>{deck?.listName || 'List 20'}</span>
          </nav>
          
          <div className="fqp-top-right">
            <Link to="#">Tài khoản luyện thi</Link>
            <Link to="#">Chương trình học</Link>
            <Link to="#">Đề thi online</Link>
            <Link to="/flashcards">Flashcards</Link>
            <Link to="#">Blog</Link>
            <Link to="#">Kích hoạt tài khoản</Link>
            <div className="fqp-profile">
              <div className="fqp-profile-avatar">
                <i className="fa-solid fa-user"></i>
              </div>
              <span className="fqp-profile-badge">11</span>
            </div>
          </div>
        </header>

        {/* Practice Content */}
        <div style={{flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{width: '100%', maxWidth: '896px', display: 'flex', flexDirection: 'column', gap: '24px'}}>
            
            {/* Audio & Grid Card */}
            <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', overflow: 'hidden'}}>
              
              {/* Audio Player Header */}
              <div style={{padding: '24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '16px'}}>
                {targetWord && (
                  <ListenAudioPlayer audioUrl={getTtsUrl(targetWord.word)} autoPlay={true} word={targetWord} />
                )}
              </div>

              {/* Vocabulary Grid */}
              <div className="vocab-grid">
                {displayedWords.map((w, idx) => {
                  let cellClass = "vocab-cell";
                  if (correctAttempt === w.id) cellClass += " correct";
                  else if (wrongAttempts.has(w.id)) cellClass += " wrong";

                  return (
                    <div key={`${w.id}-${idx}`} className={cellClass} onClick={() => handleWordClick(w)}>
                      <div className="vocab-cell-word">{w.word}</div>
                      <div className="vocab-cell-meaning">({w.meaningVi})</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', padding: '20px'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6'}}>
                <button style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#eff6ff', color: '#1e3a8a', borderRadius: '4px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer'}}>
                  <i className="fa-solid fa-chevron-left" style={{fontSize: '12px'}}></i> Câu trước
                </button>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={autoNext} onChange={() => setAutoNext(!autoNext)} />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label" style={{fontSize: '14px', color: '#374151'}}>Tự động chuyển câu</span>
                  </label>
                </div>
                <button style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#eff6ff', color: '#1e3a8a', borderRadius: '4px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer'}}>
                  Câu sau <i className="fa-solid fa-chevron-right" style={{fontSize: '12px'}}></i>
                </button>
              </div>
              
              <div>
                <div style={{fontWeight: 600, color: '#1f2937', marginBottom: '12px', fontSize: '14px'}}>Danh sách bài tập:</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                  <button style={{width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#1e3a8a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 500, border: 'none'}}>1</button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Action */}
        <div style={{backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '16px', display: 'flex', justifyContent: 'center', position: 'sticky', bottom: 0}}>
          <button style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#1f2937', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer', transition: 'color 0.2s'}}>
            HOÀN THÀNH & HỌC BÀI TIẾP THEO <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

      </main>
    </div>
  );
};

export default FlashcardListenPage;
