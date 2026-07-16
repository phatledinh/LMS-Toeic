import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PRACTICE_MODES } from '../hooks/useDeck';

const DeckSidebar = ({ deck, activeMode }) => {
  const navigate = useNavigate();
  const { listId } = useParams();

  if (!deck) return <aside className="fc-preview-sidebar"></aside>;

  return (
    <aside className="fc-preview-sidebar">
      <div className="fc-preview-sidebar-header" onClick={() => navigate('/flashcards')}>
        <span className="fc-preview-sidebar-title">{deck.listName}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
      </div>
      <div className="fc-preview-sidebar-menu">

        
        {PRACTICE_MODES.map((mode) => {
          const isActive = mode.key === activeMode || (mode.key === 'preview' && activeMode === 'study');
          return (
            <div 
              key={mode.key}
              className={`fc-preview-sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                navigate(`/flashcards/${listId}/${mode.key}`);
              }}
            >
              <span className="fc-preview-sidebar-icon">{mode.icon}</span>
              <span className="fc-preview-sidebar-text">
                <strong>{mode.prefix}:</strong> {mode.label}
              </span>
            </div>
          );
        })}
        
        <div className="fc-preview-back-link" onClick={() => navigate('/flashcards')}>
          ← Quay lại danh sách
        </div>
      </div>
    </aside>
  );
};

export default DeckSidebar;
