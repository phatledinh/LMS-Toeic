import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDeck } from '../hooks/useDeck';
import DeckSidebar from '../components/DeckSidebar';
import { getTtsUrl } from '../services/api';

const FlashcardFillPage = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { deck, words, loading, error } = useDeck(listId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [results, setResults] = useState({});

  const word = words && words.length > 0 ? words[currentIndex] : null;

  React.useEffect(() => {
    if (word && word.word) {
      const text = word.word;
      const audio = new Audio(getTtsUrl(text));
      audio.play().catch(() => {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(text);
          u.lang = 'en-US';
          window.speechSynthesis.speak(u);
        }
      });
    }
  }, [currentIndex, word]);

  if (loading) return <div className="fc-fill-layout"><p style={{padding:32}}>Đang tải...</p></div>;
  if (error) return <div className="fc-fill-layout"><p className="error-msg" style={{padding:32}}>{error}</p></div>;
  if (!words || !words.length) return <div className="fc-fill-layout"><p style={{padding:32}}>Không có từ vựng</p></div>;
  
  let exampleSentence = word.examples && word.examples.length > 0 ? word.examples[0] : '';
  if (exampleSentence) {
    // First try to replace the exact word with word boundaries
    const regex = new RegExp(`\\b${word.word}\\b`, 'gi');
    let replaced = exampleSentence.replace(regex, '______');
    
    // If exact word wasn't found (maybe conjugated or punctuation issue), do a looser replace
    if (replaced === exampleSentence) {
      const looseRegex = new RegExp(word.word, 'gi');
      replaced = exampleSentence.replace(looseRegex, '______');
    }
    
    // If still not found, we just append or use a generic blank
    if (replaced === exampleSentence) {
      exampleSentence = `______ (${exampleSentence})`;
    } else {
      exampleSentence = replaced;
    }
  } else {
    // Fallback if no example exists
    exampleSentence = `______ (${word.meaningVi})`;
  }

  const handleCheck = () => {
    if (!input.trim() || checked) return;
    const correct = input.trim().toLowerCase() === word.word.toLowerCase();
    setIsCorrect(correct);
    setChecked(true);
    setResults({ ...results, [currentIndex]: correct });

    if (autoNext && correct) {
      setTimeout(() => goTo(1), 1200);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCheck();
  };

  const goTo = (dir) => {
    const next = currentIndex + dir;
    if (next >= 0 && next < words.length) {
      setCurrentIndex(next);
      setInput('');
      setChecked(false);
      setIsCorrect(false);
    }
  };

  const jumpTo = (idx) => {
    setCurrentIndex(idx);
    setInput('');
    setChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className="fc-preview-layout">
      <DeckSidebar deck={deck} activeMode="fill" />
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
            <button onClick={() => goTo(-1)} disabled={currentIndex === 0} style={{background: 'none', border: 'none', color: 'inherit', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentIndex === 0 ? 0.5 : 1}}>
              <i className="fa-solid fa-chevron-left" style={{marginRight: '4px'}}></i> Bài trước
            </button>
            <button onClick={() => goTo(1)} disabled={currentIndex === words.length - 1} style={{background: 'none', border: 'none', color: 'inherit', cursor: currentIndex === words.length - 1 ? 'not-allowed' : 'pointer', opacity: currentIndex === words.length - 1 ? 0.5 : 1}}>
              Bài sau <i className="fa-solid fa-chevron-right" style={{marginLeft: '4px'}}></i>
            </button>
            <button className="fqp-bookmark">
              <i className="fa-regular fa-book-open"></i>
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="fqp-content">
          
          {/* Main Quiz Box */}
          <div style={{maxWidth: '896px', width: '100%', marginBottom: '24px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', padding: '64px 32px', textAlign: 'center'}}>
            <h2 style={{fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '24px', lineHeight: '1.5'}}>
              {exampleSentence}
            </h2>
            
            {word.meaningEn && (
              <p style={{fontSize: '18px', fontStyle: 'italic', color: '#374151', marginBottom: '32px'}}>
                Hint: ={word.meaningEn}
              </p>
            )}

            <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
              <div style={{width: '100%', maxWidth: '400px', position: 'relative'}}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={checked}
                  autoFocus
                  style={{
                    width: '100%', 
                    padding: '16px', 
                    fontSize: '18px', 
                    textAlign: 'center',
                    border: checked ? (isCorrect ? '2px solid #22c55e' : '2px solid #ef4444') : '1px solid #9ca3af',
                    backgroundColor: checked ? (isCorrect ? '#f0fdf4' : '#fef2f2') : 'white',
                    borderRadius: '4px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                />
              </div>
            </div>

            {checked && !isCorrect && (
              <div style={{marginTop: '24px', color: '#dc2626', fontSize: '16px'}}>
                <span>Đáp án đúng: </span>
                <strong style={{fontSize: '18px'}}>{word.word}</strong>
              </div>
            )}
            {checked && isCorrect && (
              <div style={{marginTop: '24px', color: '#16a34a', fontSize: '18px', fontWeight: 'bold'}}>
                ✅ Chính xác!
              </div>
            )}
          </div>

          {/* Navigation and Page List */}
          <div className="fqp-match-nav-container" style={{maxWidth: '896px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
              <button onClick={() => goTo(-1)} disabled={currentIndex === 0} style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', backgroundColor: '#eff6ff', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', border: 'none', opacity: currentIndex === 0 ? 0.5 : 1}}>
                <i className="fa-solid fa-chevron-left" style={{fontSize: '12px'}}></i> Câu trước
              </button>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <label className="fqp-switch">
                  <input 
                    type="checkbox" 
                    checked={autoNext}
                    onChange={(e) => setAutoNext(e.target.checked)} 
                  />
                  <span className="fqp-slider"></span>
                </label>
                <span style={{fontSize: '14px', color: '#374151', fontWeight: 500}}>Tự động chuyển câu</span>
              </div>

              <button onClick={() => goTo(1)} disabled={currentIndex === words.length - 1} style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', backgroundColor: '#eff6ff', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: currentIndex === words.length - 1 ? 'not-allowed' : 'pointer', border: 'none', opacity: currentIndex === words.length - 1 ? 0.5 : 1}}>
                Câu sau <i className="fa-solid fa-chevron-right" style={{fontSize: '12px'}}></i>
              </button>
            </div>

            <div style={{marginBottom: '8px', fontSize: '14px', fontWeight: 700, color: '#1f2937'}}>Danh sách bài tập:</div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
              {words.map((_, idx) => {
                let cls = 'fqp-pagination-btn';
                if (idx === currentIndex) cls += ' active';
                else if (results[idx] === true) cls += ' correct'; // we might need custom css for correct/wrong here
                else if (results[idx] === false) cls += ' wrong';
                return (
                  <button 
                    key={idx} 
                    className={cls} 
                    onClick={() => jumpTo(idx)}
                    style={{
                      ...(results[idx] === true ? { backgroundColor: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' } : {}),
                      ...(results[idx] === false ? { backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' } : {})
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Button */}
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

export default FlashcardFillPage;
