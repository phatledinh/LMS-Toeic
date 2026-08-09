import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSectionBySlug, getSections } from '../services/api';

const PART_CONFIG = [
  { part: 1, type: 'LISTENING_PART1' },
  { part: 2, type: 'LISTENING_PART2' },
  { part: 3, type: 'LISTENING_PART3' },
  { part: 4, type: 'LISTENING_PART4' },
  { part: 5, type: 'READING_PART5' },
  { part: 6, type: 'READING_PART6' },
  { part: 7, type: 'READING_PART7' },
];

const ENABLED_ONLINE_TEST_SLUGS = ['test-2-2026'];

const getTestTitle = (section) => {
  if (section.slug === 'test-2-2026') return 'TEST 2 - 2026';
  if (section.slug === 'de-thi-online-toeic-demo') return 'Bài test giữa kì';
  return section.title || 'Bài test TOEIC';
};

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

  const testGroups = useMemo(() => {
    return sections
      .filter((section) => !section.slug?.includes('tu-vung') && !section.slug?.includes('ngu-phap'))
      .filter((section) => ENABLED_ONLINE_TEST_SLUGS.includes(section.slug))
      .map((section) => {
        const exercises = (section.topics || []).flatMap((topic) =>
          (topic.exercises || []).map((exercise) => ({
            ...exercise,
            sectionTitle: section.title,
            sectionSlug: section.slug,
            topicTitle: topic.title,
            topicSlug: topic.slug,
          }))
        );

        const availableParts = PART_CONFIG.filter((part) =>
          exercises.some((exercise) => exercise.exerciseType === part.type)
        );
        const questionCount = exercises.reduce((sum, exercise) => sum + (Number(exercise.totalQuestions) || 0), 0);

        return {
          id: section.id,
          title: getTestTitle(section),
          originalTitle: section.title,
          slug: section.slug,
          description: section.description,
          exercises,
          availableParts,
          questionCount,
        };
      })
      .filter((group) => group.exercises.length > 0)
      .sort((a, b) => {
        if (a.slug === 'test-2-2026') return -1;
        if (b.slug === 'test-2-2026') return 1;
        if (a.slug === 'de-thi-online-toeic-demo') return -1;
        if (b.slug === 'de-thi-online-toeic-demo') return 1;
        return String(a.title).localeCompare(String(b.title));
      });
  }, [sections]);

  const totalQuestions = testGroups.reduce((sum, group) => sum + group.questionCount, 0);

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
          <p>Chọn bài test muốn làm trước, sau đó chọn từng part Listening hoặc Reading trước khi vào phòng thi.</p>
        </div>
        <div className="online-tests-stats">
          <div>
            <strong>{testGroups.length}</strong>
            <span>bài test đang mở</span>
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
          <strong>Danh sách bài test</strong>
          <span>Ví dụ: chọn “Bài test giữa kì”, rồi sang bước chọn từng part.</span>
        </div>
        <button onClick={() => navigate('/')}>Quay lại lộ trình</button>
      </section>

      <section className="online-tests-grid">
        {testGroups.map((test, index) => (
          <article className="online-test-card online-test-set-card" key={test.id}>
            <div className="online-test-card-head">
              <span>{test.originalTitle}</span>
              <strong>Test {index + 1}</strong>
            </div>
            <h2>{test.title}</h2>
            <p>{test.description || 'Bài test gồm Listening và Reading, có thể chọn từng part trước khi làm.'}</p>
            <div className="online-test-meta">
              <span>{test.questionCount || 0} câu</span>
              <span>{test.availableParts.map((part) => 'Part ' + part.part).join(', ')}</span>
            </div>
            <button onClick={() => navigate('/online-tests/' + test.slug + '/parts')}>
              Chọn part để làm bài
            </button>
          </article>
        ))}

        {testGroups.length === 0 && (
          <div className="online-tests-empty">
            Chưa có bài test nào. Hãy kiểm tra dữ liệu course hoặc thêm exercise trong admin.
          </div>
        )}
      </section>
    </main>
  );
};

export default OnlineTestsPage;
