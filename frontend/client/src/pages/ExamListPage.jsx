import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../exam.css';

const mockExams = [
  {
    id: 1,
    title: 'TEST 1 - 2026',
    description: 'Đề thi thử TOEIC chuẩn cấu trúc 2026',
    year: 2026,
    totalQuestions: 200,
    durationMinutes: 120,
  },
  {
    id: 2,
    title: 'TEST 2 - 2026',
    description: 'Đề thi thử TOEIC chuẩn cấu trúc 2026',
    year: 2026,
    totalQuestions: 200,
    durationMinutes: 120,
  },
  {
    id: 3,
    title: 'ETS 2024 Test 1',
    description: 'Đề thi thật ETS 2024',
    year: 2024,
    totalQuestions: 200,
    durationMinutes: 120,
  }
];

const ExamListPage = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập API gọi lấy danh sách đề thi
    setTimeout(() => {
      setExams(mockExams);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <main className="main-content">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải danh sách đề thi...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content exam-list-page">
      <div className="breadcrumb">
        <Link to="/">Complete TOEIC</Link>
        <span className="bc-sep">›</span>
        <span>Đề thi thử</span>
      </div>

      <div className="page-header">
        <h1 className="page-title">Danh sách đề thi TOEIC</h1>
        <p className="page-subtitle">Luyện tập với các đề thi thử TOEIC chuẩn cấu trúc mới nhất, có chấm điểm và giải thích chi tiết.</p>
      </div>

      <div className="exam-grid">
        {exams.map((exam) => (
          <div key={exam.id} className="exam-card">
            <div className="exam-card-header">
              <span className="exam-year-badge">{exam.year}</span>
            </div>
            <div className="exam-card-body">
              <h2 className="exam-title">{exam.title}</h2>
              <p className="exam-desc">{exam.description}</p>
              
              <div className="exam-meta">
                <div className="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{exam.durationMinutes} phút</span>
                </div>
                <div className="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                  <span>{exam.totalQuestions} câu hỏi</span>
                </div>
              </div>
            </div>
            <div className="exam-card-footer">
              <button 
                className="btn-primary" 
                onClick={() => navigate(`/exams/${exam.id}`)}
              >
                Chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ExamListPage;
