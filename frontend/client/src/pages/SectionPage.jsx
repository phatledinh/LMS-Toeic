import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSectionBySlug } from '../services/api';

const SectionPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getSectionBySlug(slug)
      .then((res) => setSection(res.data))
      .catch(() => setError('Không thể tải dữ liệu'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <main className="main-content">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    </main>
  );

  if (error || !section) return (
    <main className="main-content">
      <p className="error-msg">{error || 'Không tìm thấy section'}</p>
    </main>
  );

  const topics = section.topics || [];
  // Tính tiến độ (số topics có ít nhất 1 exercise đã completed)
  const completedCount = 0; // TODO: tích hợp từ progress API
  const progressPercent = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  const getExerciseTitle = (topic, exercise) => {
    if (topic.slug === 'topic-part6-luyen-tap-hinh-thuc-van-ban') {
      const mapping = {
        1: 'Thư điện tử/ thư tay (Email/ Letter)',
        2: 'Bài báo (Article/ Review)',
        3: 'Quảng cáo (Advertisement)',
        4: 'Thông báo/ văn bản hướng dẫn (Notice/ Announcement Information)',
        5: 'Thông báo nội bộ (Memo)'
      };
      if (mapping[exercise.orderIndex]) return mapping[exercise.orderIndex];
    }
    if (exercise.exerciseType && exercise.exerciseType.includes('PART')) {
      const match = exercise.exerciseType.match(/PART(\d)/);
      if (match) {
        return `Part ${match[1]}`;
      }
      return `Part ${exercise.orderIndex}`;
    }
    return topic.title;
  };

  return (
    <main className="main-content section-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Complete TOEIC</Link>
        <span className="bc-sep">›</span>
        <span>{section.title}</span>
      </div>

      {/* Title */}
      <h1 className="section-page-title">{section.title}</h1>

      {/* Tiến độ */}
      <div className="progress-card">
        <div className="progress-header">
          <span className="progress-label">Tiến độ học tập</span>
          <span className="progress-pct">{progressPercent}%</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Danh sách topics */}
      <div className="topics-list">
        {topics.length === 0 && (
          <p className="empty-msg">Chưa có bài học nào trong phần này.</p>
        )}
        {topics.map((topic) => (
          <div key={topic.id} className="topic-card">
            <h2 className="topic-card-title">{topic.title}</h2>
            <ul className="topic-items">
              {/* Lý thuyết */}
              {topic.lessons && topic.lessons.length > 0 && topic.lessons.map((lesson) => (
                <li
                  key={`lesson-${lesson.id}`}
                  className="topic-item topic-item--lesson"
                  onClick={() => navigate(`/lessons/${lesson.id}`)}
                >
                  <span className="topic-item-icon lesson-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                  </span>
                  <span className="topic-item-label">
                    <strong>Lý thuyết:</strong> {lesson.title}
                  </span>
                  <span className="topic-item-badge badge--lesson">Lý thuyết</span>
                </li>
              ))}

              {/* Bài tập */}
              {(topic.exercises || []).map((exercise) => {
                const isListening = exercise.exerciseType?.includes('LISTENING');
                const isDictationTopic = slug === 'luyen-nghe-chep-chinh-ta-toeic' || (topic.slug && topic.slug.includes('nghe-chep-chinh-ta'));
                
                return (
                  <React.Fragment key={exercise.id}>
                    {!isDictationTopic && (
                      <li
                        className="topic-item topic-item--exercise"
                        onClick={() => {
                          if (topic.slug && topic.slug.includes('luyen-tap-tong-hop')) {
                            navigate(`/practice/${slug}`);
                          } else {
                            navigate(`/exercises/${exercise.id}`);
                          }
                        }}
                      >
                        <span className="topic-item-icon exercise-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </span>
                        <span className="topic-item-label">
                          <strong>Luyện tập:</strong> {getExerciseTitle(topic, exercise)}
                        </span>
                        <span className="topic-item-badge badge--exercise">
                          {exercise.totalQuestions} câu
                        </span>
                      </li>
                    )}

                    {/* Dictation item */}
                    {isListening && isDictationTopic && (
                      <li
                        className="topic-item topic-item--dictation"
                        onClick={() => navigate(`/exercises/${exercise.id}/dictation`)}
                        style={{ backgroundColor: '#f0f4ff', borderLeft: '3px solid #35509a' }}
                      >
                        <span className="topic-item-icon dictation-icon" style={{ color: '#35509a', marginLeft: '8px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                          </svg>
                        </span>
                        <span className="topic-item-label" style={{ color: '#35509a' }}>
                          <strong>Nghe chép chính tả:</strong> {getExerciseTitle(topic, exercise)}
                        </span>
                      </li>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Nếu không có cả lesson lẫn exercise */}
              {(!topic.lessons || topic.lessons.length === 0) && (!topic.exercises || topic.exercises.length === 0) && (
                <li className="topic-item topic-item--empty">
                  <span className="topic-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" x2="12" y1="8" y2="12" />
                      <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                  </span>
                  <span className="topic-item-label" style={{ color: '#9aa0a6' }}>
                    Chưa có nội dung
                  </span>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
};

export default SectionPage;
