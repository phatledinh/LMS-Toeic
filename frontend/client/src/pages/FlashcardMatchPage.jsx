import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDeck, generateMatchCards } from '../hooks/useDeck';
import DeckSidebar from '../components/DeckSidebar';
import { getTtsUrl } from '../services/api';

const FlashcardMatchPage = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { deck, words, loading, error } = useDeck(listId);

  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [wrongPair, setWrongPair] = useState(null);
  const [correctPair, setCorrectPair] = useState(null);
  const [finished, setFinished] = useState(false);
  
  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [autoNext, setAutoNext] = useState(true);
  
  const itemsPerPage = 8;
  const totalPages = Math.ceil(words.length / itemsPerPage);

  // Generate cards when page changes
  useEffect(() => {
    if (words.length > 0) {
      const chunk = words.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);
      const newCards = generateMatchCards(chunk).map(c => {
        if (c.type === 'word') {
          const colors = ['red', 'orange', 'blue'];
          c.colorClass = `fqp-match-word-${colors[Math.floor(Math.random() * colors.length)]}`;
        }
        return c;
      });
      setCards(newCards);
      setMatched(new Set());
      setSelected(null);
      setWrongPair(null);
      setCorrectPair(null);
      setFinished(false);
    }
  }, [words, pageIndex]);

  // Check finished current page
  useEffect(() => {
    if (cards.length > 0 && matched.size === cards.length) {
      setFinished(true);
      if (autoNext && pageIndex < totalPages - 1) {
        setTimeout(() => {
          setPageIndex(pageIndex + 1);
        }, 1500);
      }
    }
  }, [matched, cards, autoNext, pageIndex, totalPages]);

  if (loading) return <div className="fqp-container"><p style={{padding:32}}>Đang tải...</p></div>;
  if (error) return <div className="fqp-container"><p className="error-msg" style={{padding:32}}>{error}</p></div>;
  if (!words.length) return <div className="fqp-container"><p style={{padding:32}}>Không có từ vựng</p></div>;

  const playAudio = (text) => {
    const audio = new Audio(getTtsUrl(text));
    audio.play().catch(() => {
      if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        window.speechSynthesis.speak(u);
      }
    });
  };

  const handleClick = (card) => {
    if (matched.has(card.uid) || wrongPair || correctPair) return;

    if (card.type === 'word') {
      playAudio(card.text);
    }

    if (!selected) {
      setSelected(card);
      return;
    }

    if (selected.uid === card.uid) {
      setSelected(null);
      return;
    }

    // Check match
    if (selected.pairId === card.pairId && selected.type !== card.type) {
      setCorrectPair([selected.uid, card.uid]);
      setTimeout(() => {
        setMatched((prev) => new Set([...prev, selected.uid, card.uid]));
        setCorrectPair(null);
        setSelected(null);
      }, 600);
    } else {
      setWrongPair([selected.uid, card.uid]);
      setTimeout(() => {
        setWrongPair(null);
        setSelected(null);
      }, 600);
    }
  };

  const goNext = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  const goPrev = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const jumpToPage = (index) => {
    setPageIndex(index);
  };

  return (
    <div className="fc-preview-layout">
      <DeckSidebar deck={deck} activeMode="match" />
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
            <button onClick={goPrev} disabled={pageIndex === 0} style={{background: 'none', border: 'none', color: 'inherit', cursor: pageIndex === 0 ? 'not-allowed' : 'pointer', opacity: pageIndex === 0 ? 0.5 : 1}}>
              <i className="fa-solid fa-chevron-left" style={{marginRight: '4px'}}></i> Bài trước
            </button>
            <button onClick={goNext} disabled={pageIndex === totalPages - 1} style={{background: 'none', border: 'none', color: 'inherit', cursor: pageIndex === totalPages - 1 ? 'not-allowed' : 'pointer', opacity: pageIndex === totalPages - 1 ? 0.5 : 1}}>
              Bài sau <i className="fa-solid fa-chevron-right" style={{marginLeft: '4px'}}></i>
            </button>
            <button className="fqp-bookmark">
              <i className="fa-regular fa-book-open"></i>
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="fqp-content">
          <div className="fqp-match-container">
            {finished && cards.length > 0 && pageIndex === totalPages - 1 ? (
               <div style={{padding: '64px', textAlign: 'center'}}>
                 <h2 style={{fontSize: '24px', fontWeight: 'bold', color: '#1a73e8', marginBottom: '16px'}}>🎉 Hoàn thành tất cả các trang!</h2>
                 <button className="fqp-nav-btn" style={{margin: '0 auto'}} onClick={() => setPageIndex(0)}>Chơi lại từ đầu</button>
               </div>
            ) : (
              <div className="fqp-match-grid">
                {cards.map((card) => {
                  const isMatched = matched.has(card.uid);
                  const isSelected = selected?.uid === card.uid;
                  const isWrong = wrongPair && wrongPair.includes(card.uid);
                  const isCorrect = correctPair && correctPair.includes(card.uid);
  
                  let cls = 'fqp-match-cell';
                  if (card.type === 'meaning') cls += ' fqp-match-meaning';
                  if (card.type === 'word') cls += ` fqp-match-word ${card.colorClass}`;
                  
                  if (isMatched) cls += ' matched';
                  if (isSelected) cls += ' selected';
                  if (isCorrect) cls += ' correct';
                  if (isWrong) cls += ' wrong';
  
                  return (
                    <div key={card.uid} className={cls} onClick={() => handleClick(card)}>
                      {card.type === 'word' ? (
                        <span>{card.text}</span>
                      ) : (
                        <div className="text-sm">
                          <p style={{fontWeight: 'bold', fontSize: '15px'}}>{card.text}</p>
                          {card.sub && <p style={{fontStyle: 'italic'}}>= {card.sub}</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation and Page List */}
          <div className="fqp-match-nav-container">
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
              <button onClick={goPrev} disabled={pageIndex === 0} style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', backgroundColor: '#eff6ff', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: pageIndex === 0 ? 'not-allowed' : 'pointer', border: 'none', opacity: pageIndex === 0 ? 0.5 : 1}}>
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

              <button onClick={goNext} disabled={pageIndex === totalPages - 1} style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', backgroundColor: '#eff6ff', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: pageIndex === totalPages - 1 ? 'not-allowed' : 'pointer', border: 'none', opacity: pageIndex === totalPages - 1 ? 0.5 : 1}}>
                Câu sau <i className="fa-solid fa-chevron-right" style={{fontSize: '12px'}}></i>
              </button>
            </div>

            <div style={{marginBottom: '8px', fontSize: '14px', fontWeight: 700, color: '#1f2937'}}>Danh sách bài tập:</div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
              {Array.from({length: totalPages}).map((_, idx) => {
                let cls = 'fqp-pagination-btn';
                if (idx === pageIndex) cls += ' active';
                return (
                  <button key={idx} className={cls} onClick={() => jumpToPage(idx)}>
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

export default FlashcardMatchPage;
