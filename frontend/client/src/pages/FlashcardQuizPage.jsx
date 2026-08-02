import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDeck, generateQuizOptions } from '../hooks/useDeck';
import DeckSidebar from '../components/DeckSidebar';
import { getTtsUrl } from '../services/api';

const FlashcardQuizPage = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { deck, words, loading, error } = useDeck(listId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedWrongIds, setSelectedWrongIds] = useState([]);
  const [autoNext, setAutoNext] = useState(true);
  const [results, setResults] = useState({});
  const [showResult, setShowResult] = useState(false);

  const options = useMemo(() => {
    if (!words.length) return [];
    return generateQuizOptions(words[currentIndex], words);
  }, [words, currentIndex]);

  if (loading) return <div className="fqp-container"><p style={{padding:32}}>Đang tải...</p></div>;
  if (error) return <div className="fqp-container"><p className="error-msg" style={{padding:32}}>{error}</p></div>;
  if (!words.length) return <div className="fqp-container"><p style={{padding:32}}>Không có từ vựng</p></div>;

  const word = words[currentIndex];

  const playAudio = () => {
    const audio = new Audio(getTtsUrl(word.word));
    audio.play().catch(() => {
      if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(word.word);
        u.lang = 'en-US';
        window.speechSynthesis.speak(u);
      }
    });
  };

  const handleSelect = (opt) => {
    if (answered) return;
    if (selectedWrongIds.includes(opt.id)) return;

    if (opt.isCorrect) {
      setAnswered(true);
      if (!(currentIndex in results)) {
        setResults({ ...results, [currentIndex]: true });
      }
      if (autoNext) {
        setTimeout(() => goNext(), 1200);
      }
    } else {
      setSelectedWrongIds([...selectedWrongIds, opt.id]);
      if (!(currentIndex in results)) {
        setResults({ ...results, [currentIndex]: false });
      }
    }
  };

  const goNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswered(false);
      setSelectedWrongIds([]);
    } else {
      setShowResult(true);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setAnswered(false);
      setSelectedWrongIds([]);
    }
  };

  const jumpToQuestion = (index) => {
    setCurrentIndex(index);
    setAnswered(false);
    setSelectedWrongIds([]);
  };

  const correctCount = Object.values(results).filter(Boolean).length;

  if (showResult) {
    return (
      <div className="fqp-container">
        <div className="fc-result-card" style={{margin: 'auto'}}>
          <h2>🎉 Hoàn thành!</h2>
          <p className="fc-result-score">{correctCount} / {words.length} câu đúng</p>
          <div className="fc-result-bar-bg">
            <div className="fc-result-bar-fill" style={{ width: `${(correctCount / words.length) * 100}%` }} />
          </div>
          <div className="fc-result-actions">
            <button className="quiz-btn btn-outline" onClick={() => { setCurrentIndex(0); setResults({}); setShowResult(false); setAnswered(false); setSelectedWrongIds([]); }}>Làm lại</button>
            <button className="quiz-btn btn-primary" onClick={() => navigate('/flashcards')}>Quay lại</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fc-preview-layout">
      <DeckSidebar deck={deck} activeMode="quiz" />
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
          
          <button className="fqp-mobile-menu">
            <i className="fa-solid fa-bars"></i>
          </button>
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
              <i className="fa-regular fa-bookmark"></i>
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="fqp-content">
          <div className="fqp-max-w">
            {/* Flashcard Question Area */}
            <div className="fqp-quiz-card">
              <h2 className="fqp-quiz-word">
                {word.word}
                <button className="fc-card-audio" onClick={playAudio} style={{fontSize:'20px'}}>🔊</button>
              </h2>
              <p className="fqp-quiz-hint">Hint: ={word.meaningEn}</p>
              
              <div className="fqp-options">
                {options.map((opt) => {
                  let cls = 'fqp-option-btn';
                  if (answered && opt.isCorrect) cls += ' correct';
                  else if (selectedWrongIds.includes(opt.id)) cls += ' wrong';

                  return (
                    <button key={opt.id} className={cls} onClick={() => handleSelect(opt)}>
                      {opt.label}{answered && opt.isCorrect ? ` (${opt.word})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation and Question List */}
            <div className="fqp-nav-card">
              <div className="fqp-nav-controls">
                <button className="fqp-nav-btn" onClick={goPrev} disabled={currentIndex === 0}>
                  <i className="fa-solid fa-chevron-left" style={{marginRight: '8px'}}></i> Câu trước
                </button>
                
                <div className="fqp-toggle-wrapper">
                  <div className="fqp-toggle">
                    <input 
                      type="checkbox" 
                      id="toggleAutoNext" 
                      className="fqp-toggle-checkbox" 
                      checked={autoNext}
                      onChange={(e) => setAutoNext(e.target.checked)} 
                    />
                    <label htmlFor="toggleAutoNext" className="fqp-toggle-label"></label>
                  </div>
                  <span>Tự động chuyển câu</span>
                </div>

                <button className="fqp-nav-btn" onClick={goNext}>
                  Câu sau <i className="fa-solid fa-chevron-right" style={{marginLeft: '8px'}}></i>
                </button>
              </div>

              <h3 className="fqp-grid-title">Danh sách bài tập:</h3>
              <div className="fqp-grid">
                {words.map((w, idx) => {
                  let cls = 'fqp-grid-item';
                  if (idx === currentIndex) cls += ' active';
                  else if (results[idx] === true) cls += ' correct';
                  else if (results[idx] === false) cls += ' wrong';
                  return (
                    <button key={w.id || idx} className={cls} onClick={() => jumpToQuestion(idx)}>
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Button */}
            <div className="fqp-footer">
              <button className="fqp-finish-btn" onClick={() => setShowResult(true)}>
                HOÀN THÀNH & HỌC BÀI TIẾP THEO <i className="fa-solid fa-arrow-right" style={{marginLeft: '8px'}}></i>
              </button>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default FlashcardQuizPage;
