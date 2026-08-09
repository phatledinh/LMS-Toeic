import React, { useState } from 'react';
import './SubmitResultModal.css';

const SubmitResultModal = ({ isOpen, onClose, onViewAnswers, results }) => {
  const [showPartDetails, setShowPartDetails] = useState(false);

  if (!isOpen) return null;

  // Default mock results if not provided
  const data = results || {
    totalCorrect: 0,
    totalQuestions: 200,
    listeningCorrect: 0,
    listeningScore: 5,
    readingCorrect: 0,
    readingScore: 5,
    totalScore: 10,
    parts: {
      1: { correct: 0, total: 6 },
      2: { correct: 0, total: 25 },
      3: { correct: 0, total: 39 },
      4: { correct: 0, total: 30 },
      5: { correct: 0, total: 30 },
      6: { correct: 0, total: 16 },
      7: { correct: 0, total: 54 },
    }
  };

  return (
    <div className="submit-modal-overlay">
      <div className="submit-modal-container">
        <div className="submit-modal-header">
          <h2>HOÀN THÀNH BÀI KIỂM TRA</h2>
        </div>
        
        <div className="submit-modal-body">
          <p className="submit-modal-warning">
            Bài kiểm tra của bạn đã được xử lý. Hãy chụp lại màn hình kết quả vì nó sẽ chỉ hiển thị 1 lần. Kết quả:
          </p>
          
          <div className="submit-modal-stats">
            <p className="submit-modal-stat-item">
              <strong>Số câu đúng: {data.totalCorrect}/{data.totalQuestions}</strong>
            </p>
            <p className="submit-modal-stat-item">
              <strong>Listening: {data.listeningCorrect}/100 - {data.listeningScore} điểm</strong>
            </p>
            <p className="submit-modal-stat-item">
              <strong>Reading: {data.readingCorrect}/100 - {data.readingScore} điểm</strong>
            </p>
            <p className="submit-modal-stat-item">
              <strong>Tổng điểm: {data.totalScore} điểm</strong>
            </p>
          </div>

          <div className="submit-modal-parts-toggle" onClick={() => setShowPartDetails(!showPartDetails)}>
            {showPartDetails ? 'Ẩn số câu đúng mỗi part' : 'Xem số câu đúng mỗi part'}
          </div>
          
          <hr className="submit-modal-divider" />

          {showPartDetails && (
            <div className="submit-modal-parts-details">
              {[1, 2, 3, 4, 5, 6, 7].map(partNum => (
                <p key={partNum} className="submit-modal-stat-item">
                  <strong>Part {partNum}: {data.parts[partNum].correct}/{data.parts[partNum].total}</strong>
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="submit-modal-footer">
          <button className="submit-modal-btn submit-modal-btn--blue" onClick={onViewAnswers}>
            XEM ĐÁP ÁN
          </button>
          <button className="submit-modal-btn submit-modal-btn--red" onClick={onClose}>
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitResultModal;
