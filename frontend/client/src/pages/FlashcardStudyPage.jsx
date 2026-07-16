import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeck } from '../hooks/useDeck';
import { getTtsUrl } from '../services/api';
import { getFullUrl } from '../utils/urlUtils';
import DeckSidebar from '../components/DeckSidebar';

const FlashcardStudyPage = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { deck, words, loading, error } = useDeck(listId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [ratings, setRatings] = useState({});

  if (loading) return <div className="fc-study-layout"><p style={{padding:32}}>Đang tải...</p></div>;
  if (error) return <div className="fc-study-layout"><p className="error-msg" style={{padding:32}}>{error}</p></div>;
  if (!words.length) return <div className="fc-study-layout"><p style={{padding:32}}>Không có từ vựng</p></div>;

  const word = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  const handleFlip = () => setFlipped(!flipped);

  const playAudio = (e, textOverride = null) => {
    e.stopPropagation();
    const text = textOverride || word.word;
    const audio = new Audio(getTtsUrl(text));
    audio.play().catch(() => {
      // Fallback to Web Speech API
      if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        window.speechSynthesis.speak(u);
      }
    });
  };

  const playExampleAudio = (e, ex) => {
    e.stopPropagation();
    const lastParenIndex = ex.lastIndexOf('(');
    let enPart = ex;
    if (lastParenIndex !== -1) {
      enPart = ex.substring(0, lastParenIndex);
    }
    const text = enPart.replace(/\[|\]/g, '').trim();
    playAudio(e, text);
  };

  const formatExample = (ex) => {
    const lastParenIndex = ex.lastIndexOf('(');
    if (lastParenIndex !== -1) {
      const enPart = ex.substring(0, lastParenIndex).trim();
      const viPart = ex.substring(lastParenIndex).trim();
      
      const renderBold = (text) => {
        const parts = text.split(/\[(.*?)\]/);
        return parts.map((part, i) => 
          i % 2 === 1 ? <strong key={i} style={{color: '#2563eb'}}>{part}</strong> : part
        );
      };

      return (
        <>
          <span style={{color: '#1f2937'}}>{renderBold(enPart)}</span>
          <span style={{color: '#6b7280', fontStyle: 'italic', fontSize: '14px', marginLeft: '4px'}}>{viPart}</span>
        </>
      );
    }
    return ex;
  };

  const handleRate = (level) => {
    setRatings({ ...ratings, [word.id]: level });
    if (currentIndex < words.length - 1) {
      setFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex + 1), 200);
    }
  };

  const goTo = (dir) => {
    const next = currentIndex + dir;
    if (next >= 0 && next < words.length) {
      setFlipped(false);
      setCurrentIndex(next);
    }
  };

  return (
    <div className="fc-preview-layout">
      <DeckSidebar deck={deck} activeMode="study" />
      <main className="fc-preview-main fc-study-main">
        {/* Top Navigation */}
        <div className="fc-study-topnav">
          <div className="fc-study-bc-links">
            <span className="fc-study-bc-link" onClick={() => navigate('/')}>Complete TOEIC</span>
            <span>&gt;</span>
            <span className="fc-study-bc-link" onClick={() => navigate('/flashcards')}>Từ vựng TOEIC</span>
            <span>&gt;</span>
            <span>{deck?.listName || 'List'}</span>
          </div>
          <div className="fc-study-nav-actions">
            <button className="fc-study-nav-btn" onClick={() => goTo(-1)} disabled={currentIndex === 0}>
              <i className="fa-solid fa-chevron-left"></i> Bài trước
            </button>
            <button className="fc-study-nav-btn" onClick={() => goTo(1)} disabled={currentIndex === words.length - 1}>
              Bài sau <i className="fa-solid fa-chevron-right"></i>
            </button>
            <button className="fc-study-bookmark-btn">
              <i className="fa-regular fa-bookmark"></i>
            </button>
          </div>
        </div>

        {/* Main Study Area */}
        <div className="fc-study-area">
          {/* Info Alert */}
          <div className="fc-study-alert">
            Chú ý: bạn được học tối đa 20 từ mới một ngày. Đây là lượng từ phù hợp để bạn có thể học hiệu quả.
          </div>

          {/* Flashcard */}
          <div className="fc-card-container" onClick={handleFlip} style={{width: '100%', maxWidth: 'none', padding: 0, minHeight: '400px', marginBottom: '16px'}}>
            <div className={`fc-card ${flipped ? 'fc-card--flipped' : ''}`}>
              {/* Front */}
              <div className="fc-card-face fc-card-front" style={{padding: 0, overflow: 'hidden'}}>
                <div className="fc-study-front-inner">
                  <div className="fc-study-badge-wrap">
                    <span className="fc-study-badge">Từ mới</span>
                  </div>
                  <div className="fc-study-front-center">
                    <div className="fc-study-word-row">
                      <h1 className="fc-study-word-text">{word.word}</h1>
                      <div className="fc-study-audio-group">
                        <button className="fc-study-audio-btn" onClick={(e) => playAudio(e)}>
                          <i className="fa-solid fa-volume-high"></i>
                        </button>
                        <span>UK</span>
                      </div>
                      <div className="fc-study-audio-group">
                        <button className="fc-study-audio-btn" onClick={(e) => playAudio(e)}>
                          <i className="fa-solid fa-volume-high"></i>
                        </button>
                        <span>US</span>
                      </div>
                    </div>
                    <div className="fc-study-phonetic">
                      ({word.pos}) {word.phonetic}
                    </div>
                  </div>
                  <button className="fc-study-flip-btn" onClick={(e) => { e.stopPropagation(); handleFlip(); }}>
                    <i className="fa-solid fa-rotate"></i>
                  </button>
                </div>
              </div>

              {/* Back */}
              <div className="fc-card-face fc-card-back" style={{padding: 0, overflow: 'hidden'}}>
                <div className="fc-study-back-inner">
                  <div className="fc-study-back-content">
                    {/* Left Column: Details & Examples */}
                    <div className="fc-study-back-left">
                      <div className="fc-study-def-section">
                        <h3 className="fc-study-def-title">Định nghĩa:</h3>
                        <p className="fc-study-def-vi">{word.meaningVi}</p>
                        <p className="fc-study-def-en">= {word.meaningEn}</p>
                      </div>
                      <div className="fc-study-examples-section">
                        <h3 className="fc-study-examples-title">Ví dụ:</h3>
                        <div className="fc-study-examples-list custom-scrollbar">
                          {word.examples.map((ex, i) => (
                            <div key={i} className="fc-study-example-item">
                              <button className="fc-study-example-audio" onClick={(e) => playExampleAudio(e, ex)}>
                                <i className="fa-solid fa-volume-high"></i>
                              </button>
                              <div className="fc-study-example-text">
                                <p>{formatExample(ex)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Image & Controls */}
                    <div className="fc-study-back-right">
                      <div className="fc-study-back-badge-wrap">
                        <span className="fc-study-back-badge">Từ mới</span>
                      </div>
                      <div className="fc-study-back-img-wrap">
                        {word.imageUrl && <img alt={word.word} src={getFullUrl(word.imageUrl)} className="fc-study-back-img" />}
                      </div>
                      <div className="fc-study-back-flip-wrap">
                        <button className="fc-study-back-flip-btn" onClick={(e) => { e.stopPropagation(); handleFlip(); }}>
                          <i className="fa-solid fa-rotate-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="fc-study-footer">
            <div className="fc-study-rating-group">
              <button className="fc-study-rating-btn fc-study-rating-btn--easy" onClick={() => handleRate('easy')}>
                <div className="fc-study-rating-icon">
                  <i className="fa-regular fa-face-smile"></i>
                </div>
                <span className="fc-study-rating-label">Dễ</span>
              </button>
              <button className="fc-study-rating-btn fc-study-rating-btn--medium" onClick={() => handleRate('medium')}>
                <div className="fc-study-rating-icon">
                  <i className="fa-regular fa-face-meh"></i>
                </div>
                <span className="fc-study-rating-label">Trung bình</span>
              </button>
              <button className="fc-study-rating-btn fc-study-rating-btn--hard" onClick={() => handleRate('hard')}>
                <div className="fc-study-rating-icon">
                  <i className="fa-regular fa-face-dizzy"></i>
                </div>
                <span className="fc-study-rating-label">Khó</span>
              </button>
            </div>
            <div className="fc-study-skip-section">
              <button className="fc-study-skip-btn" onClick={() => handleRate('skip')}>
                <i className="fa-solid fa-forward-step"></i>
                <span>Đã biết, loại khỏi<br/>danh sách ôn tập</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

};

export default FlashcardStudyPage;
