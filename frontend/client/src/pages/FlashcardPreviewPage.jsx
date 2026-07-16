import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDeck } from '../hooks/useDeck';
import { getTtsUrl } from '../services/api';
import { getFullUrl } from '../utils/urlUtils';
import DeckSidebar from '../components/DeckSidebar';

const ITEMS_PER_PAGE = 20;

const FlashcardPreviewPage = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { deck, words, loading, error } = useDeck(listId);
  const [activeMode, setActiveMode] = useState('study');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(words.length / ITEMS_PER_PAGE);
  const currentWords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return words.slice(start, start + ITEMS_PER_PAGE);
  }, [words, currentPage]);

  if (loading) return <div className="fc-study-layout"><p style={{padding:32}}>Đang tải...</p></div>;
  if (error) return <div className="fc-study-layout"><p className="error-msg" style={{padding:32}}>{error}</p></div>;
  if (!deck) return <div className="fc-study-layout"><p style={{padding:32}}>Không tìm thấy bộ từ vựng</p></div>;

  const playAudio = (e, text) => {
    e.stopPropagation();
    const audio = new Audio(getTtsUrl(text));
    audio.play().catch(() => {
      if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        window.speechSynthesis.speak(u);
      }
    });
  };

  const getTtsTextForExample = (ex) => {
    // Vietnamese translation is usually in the last parenthesis, e.g. "English (Vietnamese)"
    const lastParenIndex = ex.lastIndexOf('(');
    let enPart = ex;
    if (lastParenIndex !== -1) {
      enPart = ex.substring(0, lastParenIndex);
    }
    return enPart.replace(/\[|\]/g, '').trim();
  };

  const formatExample = (ex) => {
    const lastParenIndex = ex.lastIndexOf('(');
    if (lastParenIndex !== -1) {
      const enPart = ex.substring(0, lastParenIndex).trim();
      const viPart = ex.substring(lastParenIndex).trim();
      
      // Render the word in brackets [word] as bold
      const renderBold = (text) => {
        const parts = text.split(/\[(.*?)\]/);
        return parts.map((part, i) => 
          i % 2 === 1 ? <strong key={i} style={{color: '#2563eb'}}>{part}</strong> : part
        );
      };

      return (
        <>
          <span className="fc-preview-ex-en">{renderBold(enPart)}</span>
          <span className="fc-preview-ex-vi"> {viPart}</span>
        </>
      );
    }
    return ex;
  };

  return (
    <div className="fc-preview-layout">
      <DeckSidebar deck={deck} activeMode="preview" />

      {/* Main Content */}
      <main className="fc-preview-main">
        {/* Breadcrumb */}
        <div className="fc-preview-breadcrumb">
          <div className="fc-preview-bc-left">
            <Link to="/" className="fc-preview-link">Complete TOEIC</Link>
            <span className="fc-preview-sep">&gt;</span>
            <Link to="/flashcards" className="fc-preview-link">Từ vựng TOEIC</Link>
            <span className="fc-preview-sep">&gt;</span>
            <span className="fc-preview-current">{deck.listName}</span>
          </div>
        </div>

        <div className="fc-preview-content">
          <div className="fc-preview-container">
            <button 
              className="fc-preview-start-btn"
              onClick={() => navigate(`/flashcards/${listId}/study`)}
            >
              Luyện tập flashcards
            </button>

            {/* Stats Card */}
            <div className="fc-preview-stats">
              <div className="fc-stat-item">
                <div className="fc-stat-value">{words.length}</div>
                <div className="fc-stat-label">Tổng số từ</div>
              </div>
              <div className="fc-stat-item">
                <div className="fc-stat-value">0</div>
                <div className="fc-stat-label">Đã học</div>
              </div>
              <div className="fc-stat-item">
                <div className="fc-stat-value">0</div>
                <div className="fc-stat-label">Đã nhớ</div>
              </div>
              <div className="fc-stat-item">
                <div className="fc-stat-value" style={{color: '#ef4444'}}>0</div>
                <div className="fc-stat-label">Cần ôn tập</div>
              </div>
            </div>

            <div className="fc-preview-count-text">
              List có {words.length} từ {totalPages > 1 && `(Trang ${currentPage}/${totalPages})`}
            </div>

            {/* Vocab Cards */}
            <div className="fc-preview-cards">
              {currentWords.map((word) => (
                <div key={word.id} className="fc-preview-vocab-card">
                  <div className="fc-preview-vocab-info">
                    <div className="fc-preview-vocab-header">
                      <h2 className="fc-preview-vocab-word">{word.word} ({word.pos})</h2>
                      <span className="fc-preview-vocab-phonetic">/{word.phonetic}/</span>
                      <button className="fc-preview-audio-btn" onClick={(e) => playAudio(e, word.word)}>
                        🔊 <span className="fc-preview-audio-lang">US</span>
                      </button>
                    </div>

                    <div className="fc-preview-vocab-def">
                      <div className="fc-preview-label">Định nghĩa:</div>
                      <p className="fc-preview-def-vi">{word.meaningVi}</p>
                      <p className="fc-preview-def-en">={word.meaningEn}</p>
                    </div>

                    {word.examples && word.examples.length > 0 && (
                      <div className="fc-preview-vocab-examples">
                        <div className="fc-preview-label">Ví dụ:</div>
                        <ul>
                          {word.examples.map((ex, i) => (
                            <li key={i}>
                              <button className="fc-preview-audio-btn-small" onClick={(e) => playAudio(e, getTtsTextForExample(ex))}>🔊</button>
                              <div className="fc-preview-ex-text">
                                {formatExample(ex)}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {word.imageUrl && (
                    <div className="fc-preview-vocab-img">
                      <img src={getFullUrl(word.imageUrl)} alt={word.word} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="fc-preview-pagination">
                <button 
                  className="fc-preview-page-btn" 
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => p - 1);
                    document.querySelector('.fc-preview-content').scrollTo(0, 0);
                  }}
                >
                  &laquo; Trang trước
                </button>
                <div className="fc-preview-page-numbers">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button 
                      key={i} 
                      className={`fc-preview-page-num ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        document.querySelector('.fc-preview-content').scrollTo(0, 0);
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  className="fc-preview-page-btn" 
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(p => p + 1);
                    document.querySelector('.fc-preview-content').scrollTo(0, 0);
                  }}
                >
                  Trang sau &raquo;
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default FlashcardPreviewPage;
