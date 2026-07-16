import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSystemDecks } from '../services/api';
import { PRACTICE_MODES } from '../hooks/useDeck';

const FlashcardListPage = () => {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const res = await getSystemDecks();
        setDecks(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, []);

  if (loading) return <div className="main-content"><p>Đang tải dữ liệu...</p></div>;
  if (error) return <div className="main-content"><p className="error-msg">{error}</p></div>;

  return (
    <div className="main-content">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="bc-link">Complete TOEIC</Link>
        <span className="bc-sep">›</span>
        <span>Từ vựng TOEIC</span>
      </div>

      <h1 className="section-page-title">Từ vựng TOEIC</h1>

      <div className="fc-lists">
        {decks.map((deck) => (
          <div key={deck.id} className="fc-list-card">
            <div className="fc-list-card-header">
              <h2 className="fc-list-card-title">{deck.listName}</h2>
              <span className="fc-list-card-count">{deck.wordCount} từ vựng</span>
            </div>

            <div className="fc-practice-modes">
              {PRACTICE_MODES.map((mode) => (
                <div
                  key={mode.key}
                  className="fc-practice-item"
                  onClick={() => {
                    navigate(`/flashcards/${deck.id}/${mode.key}`);
                  }}
                >
                  <span className="fc-practice-icon">{mode.icon}</span>
                  <span className="fc-practice-label">
                    <strong>{mode.prefix}:</strong> {mode.label}
                  </span>
                  <svg className="fc-practice-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardListPage;
