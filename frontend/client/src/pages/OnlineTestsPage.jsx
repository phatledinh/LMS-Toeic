import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSectionBySlug, getSections } from '../services/api';

const OnlineTestsPage = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getSections()
      .then(async (res) => {
        const basicSections = res.data || [];
        const detailedSections = await Promise.all(
          basicSections.map((section) =>
            getSectionBySlug(section.slug)
              .then((detail) => detail.data)
              .catch(() => ({ ...section, topics: [] }))
          )
        );
        setSections(detailedSections);
      })
      .catch(() => setError('Không thể tải danh sách đề thi.'))
      .finally(() => setLoading(false));
  }, []);

  const onlineTests = useMemo(() => {
    return sections
      .filter((section) => !section.slug?.includes('tu-vung') && !section.slug?.includes('ngu-phap'))
      .flatMap((section) =>
        (section.topics || []).flatMap((topic) =>
          (topic.exercises || []).map((exercise) => ({
            ...exercise,
            sectionTitle: section.title,
            sectionSlug: section.slug,
            topicTitle: topic.title,
            topicSlug: topic.slug,
          }))
        )
      )
      .sort((a, b) => {
        const sectionCompare = String(a.sectionTitle).localeCompare(String(b.sectionTitle));
        if (sectionCompare !== 0) return sectionCompare;
        return (a.orderIndex || 0) - (b.orderIndex || 0);
      });
  }, [sections]);

  const featuredTests = onlineTests.slice(0, 9);
  const totalQuestions = featuredTests.reduce((sum, test) => sum + (Number(test.totalQuestions) || 0), 0);

  if (loading) {
    return (
      <main className="online-tests-page">
        <div className="online-tests-loading">
          <div className="spinner"></div>
          <p>Đang tải ngân hàng đề thi...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="online-tests-page">
      <section className="online-tests-hero">
        <div>
          <span className="online-tests-kicker">STUDY4 exam room</span>
          <h1>Đề thi online</h1>
          <p>Làm bài theo giao diện thi trực tuyến: có đồng hồ, bảng câu hỏi, trạng thái câu đã chọn và màn hình làm bài tập trung.</p>
        </div>
        <div className="online-tests-stats">
          <div>
            <strong>{featuredTests.length}</strong>
            <span>đề đang mở</span>
          </div>
          <div>
            <strong>{totalQuestions}</strong>
            <span>câu hỏi</span>
          </div>
        </div>
      </section>

      {error && <div className="online-tests-error">{error}</div>}

      <section className="online-tests-toolbar">
        <div>
          <strong>Danh sách đề</strong>
          <span>Chọn một đề để vào phòng thi online.</span>
        </div>
        <button onClick={() => navigate('/')}>Quay lại lộ trình</button>
      </section>

      <section className="online-tests-grid">
        {featuredTests.map((test, index) => (
          <article className="online-test-card" key={test.id}>
            <div className="online-test-card-head">
              <span>{test.sectionTitle}</span>
              <strong>Test {index + 1}</strong>
            </div>
            <h2>{test.topicTitle}</h2>
            <p>{test.exerciseType?.replaceAll('_', ' ') || 'TOEIC practice test'}</p>
            <div className="online-test-meta">
              <span>{test.totalQuestions || 0} câu</span>
              <span>{test.timeLimit || 120} phút</span>
            </div>
            <button onClick={() => navigate('/exercises/' + test.id)}>
              Bắt đầu làm bài
            </button>
          </article>
        ))}

        {featuredTests.length === 0 && (
          <div className="online-tests-empty">
            Chưa có đề thi nào. Hãy kiểm tra dữ liệu course hoặc thêm exercise trong admin.
          </div>
        )}
      </section>
    </main>
  );
};

export default OnlineTestsPage;
