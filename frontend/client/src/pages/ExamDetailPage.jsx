import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../exam.css';

const mockExamData = {
  id: 1,
  title: 'TEST 1 - 2026',
  durationMinutes: 120,
  listeningParts: [
    { id: 1, name: 'PART 1', questionsCount: 6 },
    { id: 2, name: 'PART 2', questionsCount: 25 },
    { id: 3, name: 'PART 3', questionsCount: 39 },
    { id: 4, name: 'PART 4', questionsCount: 30 },
  ],
  readingParts: [
    { id: 5, name: 'PART 5', questionsCount: 30 },
    { id: 6, name: 'PART 6', questionsCount: 16 },
    { id: 7, name: 'PART 7', questionsCount: 54 },
  ]
};

const ExamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const exam = mockExamData; // In real app, fetch based on id

  const [selectByPart, setSelectByPart] = useState(false);
  const [selectedParts, setSelectedParts] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [selectedTime, setSelectedTime] = useState('120');

  const handleTogglePart = (partId) => {
    if (selectedParts.includes(partId)) {
      setSelectedParts(selectedParts.filter(p => p !== partId));
    } else {
      setSelectedParts([...selectedParts, partId]);
    }
  };

  const handleSelectByPartChange = (e) => {
    const isChecked = e.target.checked;
    setSelectByPart(isChecked);
    if (!isChecked) {
      // Re-select all if turning off
      setSelectedParts([1, 2, 3, 4, 5, 6, 7]);
    }
  };

  const handleStart = () => {
    // Navigate to exam taking page with selected parts/time
    navigate(`/exams/${id}/take`, { state: { selectedParts, selectedTime, selectByPart } });
  };

  return (
    <main className="main-content exam-detail-page">
      <div className="exam-header-bar">
        <h1 className="exam-main-title">{exam.title}</h1>
        <div className="exam-note">
          Lưu ý: Hãy sử dụng trình duyệt Google Chrome để làm bài Test để có trải nghiệm tốt nhất.
        </div>
      </div>

      <div className="exam-info-section">
        <div className="info-row">
          <span className="info-label">Thời gian làm bài thi:</span> <strong>{exam.durationMinutes / 60} giờ</strong>
        </div>
        <div className="info-row">
          <span className="info-label">Cấu trúc đề thi</span>
        </div>
      </div>

      <div className="exam-structure-section">
        <div className="select-part-toggle">
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={selectByPart} 
              onChange={handleSelectByPartChange}
            />
            <span className="checkmark"></span>
            Chọn từng part
          </label>
        </div>

        {selectByPart && (
          <div className="time-select-container">
            <span className="time-select-label">Chọn thời gian làm bài:</span>
            <select 
              className="time-select" 
              value={selectedTime} 
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="120">2 giờ</option>
              {Array.from({ length: 23 }, (_, i) => {
                const minutes = (i + 1) * 5; // 5, 10, 15, ..., 115
                return (
                  <option key={minutes} value={String(minutes)}>{minutes} phút</option>
                );
              })}
            </select>
          </div>
        )}

        <div className="parts-tables">
          <div className="part-category">
            <h3 className="category-title">LISTENING</h3>
            <table className="parts-table">
              <tbody>
                {exam.listeningParts.map((part, index) => (
                  <tr key={part.id}>
                    <td className="col-index">
                      {selectByPart ? (
                        <input 
                          type="checkbox" 
                          className="part-checkbox"
                          checked={selectedParts.includes(part.id)}
                          onChange={() => handleTogglePart(part.id)}
                        />
                      ) : (
                        index + 1
                      )}
                    </td>
                    <td className="col-name">{part.name}</td>
                    <td className="col-questions">{part.questionsCount} CÂU</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="part-category">
            <h3 className="category-title">READING</h3>
            <table className="parts-table">
              <tbody>
                {exam.readingParts.map((part, index) => (
                  <tr key={part.id}>
                    <td className="col-index">
                      {selectByPart ? (
                        <input 
                          type="checkbox" 
                          className="part-checkbox"
                          checked={selectedParts.includes(part.id)}
                          onChange={() => handleTogglePart(part.id)}
                        />
                      ) : (
                        index + 1
                      )}
                    </td>
                    <td className="col-name">{part.name}</td>
                    <td className="col-questions">{part.questionsCount} CÂU</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="start-btn-container">
          <button className="btn-start" onClick={handleStart}>
            BẮT ĐẦU
          </button>
        </div>
      </div>
    </main>
  );
};

export default ExamDetailPage;
