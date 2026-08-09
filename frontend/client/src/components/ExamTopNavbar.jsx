import React from 'react';
import { useAuth } from '../context/AuthContext';

const GridIcon = () => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
  </svg>
);

const ExamTopNavbar = ({ showTimerAndSubmit = true, timeRemaining = "02:00:00", onSubmit, mode = "taking", onRetry, onExit }) => {
  const { user } = useAuth();
  
  // Display name fallback
  const displayName = user ? user.name || user.username : 'Guest (khách)';

  return (
    <div className="exam-top-navbar">
      <div className="exam-top-navbar-left">
        <h2 className="exam-top-navbar-title">HỆ THỐNG THI TRỰC TUYẾN</h2>
      </div>
      
      <div className="exam-top-navbar-right">
        {mode === 'taking' && showTimerAndSubmit && (
          <>
            <button className="exam-btn-submit" onClick={onSubmit}>
              NỘP BÀI
            </button>
            <div className="exam-timer-badge">
              {timeRemaining}
            </div>
          </>
        )}

        {mode === 'review' && (
          <>
            <button className="exam-btn-submit" style={{ backgroundColor: '#f97316' }} onClick={onRetry}>
              LÀM LẠI
            </button>
            <button className="exam-btn-submit" style={{ backgroundColor: '#f97316' }} onClick={onExit}>
              THOÁT
            </button>
          </>
        )}
        
        <span className="exam-user-name">{displayName}</span>
        
        <button className="exam-grid-btn">
          <GridIcon />
        </button>
      </div>
    </div>
  );
};

export default ExamTopNavbar;
