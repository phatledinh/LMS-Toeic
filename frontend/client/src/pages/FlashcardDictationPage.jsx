import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDeck } from '../hooks/useDeck';
import { getTtsUrl } from '../services/api';
import DeckSidebar from '../components/DeckSidebar';

// Custom AudioPlayer for Dictation
const DictationAudioPlayer = ({ audioUrl, autoPlay, word }) => {
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
    // Fallback to Web Speech API
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

const FlashcardDictationPage = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { deck, words, loading, error } = useDeck(listId);
  const inputRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [history, setHistory] = useState([]);
  const [showMeaning, setShowMeaning] = useState(true);
  const [autoReplay, setAutoReplay] = useState(false);
  const [skipped, setSkipped] = useState(new Set());
  const [filter, setFilter] = useState('all');

  const word = words && words.length > 0 ? words[currentIndex] : null;

  const handleCheck = () => {
    if (!word || !input.trim()) return;
    const trimmedInput = input.trim();
    const correct = trimmedInput.toLowerCase() === word.word.toLowerCase();
    
    setIsCorrect(correct);
    
    // Add to history if not exists (only on FIRST check)
    if (!checked) {
      setChecked(true);
      if (!history.find(h => h.wordId === word.id)) {
        setHistory([...history, { wordId: word.id, text: trimmedInput, isCorrect: correct }]);
      }
    }
    
    // Auto move to next word if correct
    if (correct) {
      setShowAnswer(false);
      setTimeout(() => {
        goNext();
      }, 1500);
    }
  };

  const handleShowAnswer = () => {
    if (!word) return;
    setShowAnswer(true);
    setInput(word.word);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  const goNext = () => {
    if (words && currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setInput('');
      setChecked(false);
      setIsCorrect(false);
      setShowAnswer(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setInput('');
      setChecked(false);
      setIsCorrect(false);
      setShowAnswer(false);
    }
  };

  const handleSkip = () => {
    if (!word) return;
    setSkipped(new Set([...skipped, word.id]));
    goNext();
  };

  if (loading) return <div className="fqp-container"><p style={{padding:32}}>Đang tải...</p></div>;
  if (error) return <div className="fqp-container"><p className="error-msg" style={{padding:32}}>{error}</p></div>;
  if (!words || !words.length) return <div className="fqp-container"><p style={{padding:32}}>Không có từ vựng</p></div>;

  return (
    <div className="fc-preview-layout">
      <DeckSidebar deck={deck} activeMode="dictation" />
      <main className="fc-preview-main">
        {/* Top Navigation Bar */}
        <header className="fqp-top-nav">
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
              <i className="fa-solid fa-caret-down"></i>
            </div>
          </div>
        </header>

        {/* Sub Navigation */}
        <div className="fqp-sub-nav">
          <div></div>
          <div className="fqp-sub-nav-links">
            <button onClick={goPrev} disabled={currentIndex === 0} style={{background: 'none', border: 'none', color: 'inherit', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentIndex === 0 ? 0.5 : 1}}>
              <i className="fa-solid fa-chevron-left" style={{marginRight: '4px'}}></i> Bài trước
            </button>
            <button onClick={goNext} disabled={currentIndex === words.length - 1} style={{background: 'none', border: 'none', color: 'inherit', cursor: currentIndex === words.length - 1 ? 'not-allowed' : 'pointer', opacity: currentIndex === words.length - 1 ? 0.5 : 1}}>
              Bài sau <i className="fa-solid fa-chevron-right" style={{marginLeft: '4px'}}></i>
            </button>
            <button className="fqp-bookmark">
              <i className="fa-regular fa-book-open"></i>
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="fqp-content">
          <div className="fqp-dict-container">
            <div className="fqp-dict-box">
              {/* Left Column */}
              <div className="fqp-dict-left">
                <div className="fqp-dict-info-box">
                  <p>• List gồm <strong>{words.length} từ</strong></p>
                  <p>• Để check đáp án, bạn gõ từ bạn nghe được và bấm Enter.</p>
                  <p>• Từ vựng sẽ xuất hiện dưới đây sau khi bạn check đáp án lần đầu.</p>
                </div>
                
                {/* History List */}
                <div className="fqp-dict-history">
                  {history.map((h, i) => (
                    <span key={i} className={`fqp-dict-history-word ${h.isCorrect ? 'correct' : 'wrong'}`}>
                      {h.text}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Right Column */}
              <div className="fqp-dict-right">
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px', width: '100%', alignItems: 'flex-start'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <span style={{fontSize: '14px', color: '#374151'}}>Chọn chế độ luyện tập:</span>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{padding: '6px 12px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', backgroundColor: 'white'}}>
                      <option value="all">Tất cả</option>
                      <option value="not_skipped">Trừ các từ đã bỏ qua</option>
                      <option value="wrong">Chỉ những từ làm sai</option>
                    </select>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', marginTop: '8px', paddingLeft: '2px'}}>
                    <Link to="#" style={{color: '#2563eb', textDecoration: 'none'}}>Lựa chọn từ để luyện</Link>
                    <Link to="#" style={{color: '#2563eb', textDecoration: 'none'}}>Xem danh sách các từ bỏ qua / sai</Link>
                  </div>
                </div>
                
                {/* Player Area */}
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '500px', margin: '0 auto', width: '100%', flex: 1, justifyContent: 'center'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginBottom: '24px'}}>
                    <DictationAudioPlayer audioUrl={getTtsUrl(word.word)} autoPlay={true} />
                  </div>
                  
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'flex-start', marginBottom: '24px'}}>
                    <span style={{fontSize: '14px', color: '#4b5563'}}>Audio (US)</span>
                  </div>

                  <div style={{width: '100%', textAlign: 'center', marginBottom: '32px'}}>
                    {showMeaning ? (
                      <>
                        <h2 style={{fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '12px', lineHeight: '1.4'}}>{word.meaningVi}</h2>
                        <p style={{fontSize: '16px', color: '#4b5563', fontStyle: 'italic', marginBottom: '8px'}}>= {word.meaningEn}</p>
                        <p style={{fontSize: '14px', color: '#6b7280', fontStyle: 'italic'}}>{word.phonetic}</p>
                      </>
                    ) : (
                      <h2 style={{fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '12px'}}>...</h2>
                    )}
                  </div>

                  {/* Move Input Box Here */}
                  <div className="fqp-dict-input-wrap" style={{width: '100%', marginBottom: '24px'}}>
                    <input
                      ref={inputRef}
                      type="text"
                      className={`fqp-dict-input ${checked && !showAnswer ? (isCorrect ? 'correct' : 'wrong') : ''} ${showAnswer ? 'show-answer' : ''}`}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={checked && isCorrect}
                    />
                  </div>

                  <div className="fqp-dict-btn-group">
                    <button className="fqp-dict-btn" onClick={handleCheck} disabled={checked && isCorrect}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                      Check kết quả
                    </button>
                    {checked && !isCorrect && !showAnswer && (
                      <button className="fqp-dict-btn" onClick={handleShowAnswer}>
                        Hiện đáp án
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom nav inside right column */}
                <div style={{marginTop: '32px', display: 'flex', flexDirection: 'column', width: '100%'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151'}}>
                        <input type="checkbox" checked={showMeaning} onChange={e => setShowMeaning(e.target.checked)} />
                        Hiện nghĩa tiếng Việt
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151'}}>
                        <input type="checkbox" checked={autoReplay} onChange={e => setAutoReplay(e.target.checked)} />
                        Auto replay
                      </label>
                    </div>
                    <button onClick={goNext} disabled={currentIndex === words.length - 1} style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px'}}>
                      Từ tiếp theo <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                    </button>
                  </div>
                  <div style={{textAlign: 'center', marginTop: '8px'}}>
                    <button onClick={handleSkip} style={{display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer'}}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                      Đã biết, bỏ qua và không test từ này nữa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="fqp-footer">
            <button className="fqp-finish-btn" onClick={() => navigate('/flashcards')}>
              HOÀN THÀNH & HỌC BÀI TIẾP THEO <i className="fa-solid fa-arrow-right" style={{marginLeft: '8px'}}></i>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FlashcardDictationPage;
