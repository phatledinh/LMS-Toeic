import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSectionBySlug } from '../services/api';

const PART_CONFIG = [
  { part: 1, skill: 'LISTENING', type: 'LISTENING_PART1', standardQuestions: 6 },
  { part: 2, skill: 'LISTENING', type: 'LISTENING_PART2', standardQuestions: 25 },
  { part: 3, skill: 'LISTENING', type: 'LISTENING_PART3', standardQuestions: 39 },
  { part: 4, skill: 'LISTENING', type: 'LISTENING_PART4', standardQuestions: 30 },
  { part: 5, skill: 'READING', type: 'READING_PART5', standardQuestions: 30 },
  { part: 6, skill: 'READING', type: 'READING_PART6', standardQuestions: 16 },
  { part: 7, skill: 'READING', type: 'READING_PART7', standardQuestions: 54 },
];

const TIME_OPTIONS = [
  { label: '2 giờ', minutes: 120 },
  { label: '90 phút', minutes: 90 },
  { label: '60 phút', minutes: 60 },
  { label: '45 phút', minutes: 45 },
];

const LAST_TEST_RESULTS_KEY = 'toeic_last_test_results';

const getTestTitle = (section) => {
  if (section.slug === 'test-2-2026') return 'TEST 2 - 2026';
  if (section.slug === 'de-thi-online-toeic-demo') return 'Bài test giữa kì';
  return section.title || 'Bài test TOEIC';
};

const formatResultDate = (value) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    date.getFullYear(),
  ].join('-');
};

const formatDuration = (seconds) => {
  const totalSeconds = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainSeconds = totalSeconds % 60;
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainSeconds).padStart(2, '0')}`;
};

const OnlineTestPartsPage = () => {
  const { testSlug } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [choosePartsEnabled, setChoosePartsEnabled] = useState(true);
  const [selectedParts, setSelectedParts] = useState(() => PART_CONFIG.map((part) => part.part));
  const [selectedTime, setSelectedTime] = useState(120);
  const [lastResult, setLastResult] = useState(null);
  const [resultPopupOpen, setResultPopupOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    getSectionBySlug(testSlug)
      .then((res) => setSection(res.data))
      .catch(() => setError('Không thể tải bài test đã chọn.'))
      .finally(() => setLoading(false));
  }, [testSlug]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(LAST_TEST_RESULTS_KEY) || '{}');
      setLastResult(stored[testSlug] || null);
      setResultPopupOpen(false);
    } catch {
      setLastResult(null);
    }
  }, [testSlug]);

  const exercises = useMemo(() => {
    return (section?.topics || []).flatMap((topic) =>
      (topic.exercises || []).map((exercise) => ({
        ...exercise,
        topicTitle: topic.title,
        topicSlug: topic.slug,
      }))
    );
  }, [section]);

  const testsByPart = useMemo(() => {
    return PART_CONFIG.reduce((acc, part) => {
      acc[part.part] = exercises.find((test) => test.exerciseType === part.type);
      return acc;
    }, {});
  }, [exercises]);

  const availablePartRows = PART_CONFIG.map((part) => ({
    ...part,
    test: testsByPart[part.part],
    totalQuestions: testsByPart[part.part]?.totalQuestions || 0,
  }));

  const selectedAvailableRows = availablePartRows.filter((row) =>
    choosePartsEnabled ? selectedParts.includes(row.part) && row.test : row.test
  );

  const selectedQuestionCount = selectedAvailableRows.reduce(
    (sum, row) => sum + (Number(row.totalQuestions) || 0),
    0
  );
  const testTitle = section ? getTestTitle(section) : 'Bài test TOEIC';

  const togglePart = (partNumber) => {
    setSelectedParts((current) =>
      current.includes(partNumber)
        ? current.filter((part) => part !== partNumber)
        : [...current, partNumber].sort((a, b) => a - b)
    );
  };

  const startCombinedTest = () => {
    if (selectedAvailableRows.length === 0) {
      setError('Hãy chọn ít nhất một part đã có dữ liệu để bắt đầu làm bài.');
      return;
    }

    const ids = selectedAvailableRows.map((row) => row.test.id).join(',');
    const parts = selectedAvailableRows.map((row) => row.part).join(',');
    navigate(`/exercises/combined?ids=${ids}&parts=${parts}&time=${selectedTime}&testSlug=${encodeURIComponent(testSlug)}&test=${encodeURIComponent(testTitle)}`);
  };

  const openLastResultReview = () => {
    if (!lastResult) return;
    if (lastResult.reviewUrl) {
      navigate(lastResult.reviewUrl);
      return;
    }

    const rows = availablePartRows.filter((row) => row.test);
    const ids = rows.map((row) => row.test.id).join(',');
    const parts = rows.map((row) => row.part).join(',');
    navigate(`/exercises/combined?ids=${ids}&parts=${parts}&time=${selectedTime}&testSlug=${encodeURIComponent(testSlug)}&test=${encodeURIComponent(testTitle)}&review=last`);
  };

  if (loading) {
    return (
      <main className="online-tests-page">
        <div className="online-tests-loading">
          <div className="spinner"></div>
          <p>Đang tải bài test...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="online-tests-page">
      <section className="online-tests-toolbar part-picker-breadcrumb">
        <div>
          <strong>{testTitle}</strong>
          <span>Chọn các part muốn làm trước khi vào phòng thi.</span>
        </div>
        <button onClick={() => navigate('/online-tests')}>Quay lại danh sách bài test</button>
      </section>

      {error && <div className="online-tests-error">{error}</div>}

      <section className="part-picker-panel">
        <div className="part-picker-head">
          <label className="part-picker-master">
            <input
              type="checkbox"
              checked={choosePartsEnabled}
              onChange={(event) => setChoosePartsEnabled(event.target.checked)}
            />
            <span>Chọn từng part</span>
          </label>
          <div className="part-picker-summary">
            <strong>{selectedQuestionCount}</strong>
            <span>câu trong bài test</span>
          </div>
        </div>

        <div className="part-picker-time">
          <label>Chọn thời gian làm bài:</label>
          <select value={selectedTime} onChange={(event) => setSelectedTime(Number(event.target.value))}>
            {TIME_OPTIONS.map((option) => (
              <option value={option.minutes} key={option.minutes}>{option.label}</option>
            ))}
          </select>
        </div>

        {['LISTENING', 'READING'].map((skill) => (
          <div className="part-picker-section" key={skill}>
            <h2>{skill}</h2>
            <div className="part-picker-table">
              {availablePartRows
                .filter((row) => row.skill === skill)
                .map((row) => {
                  const checked = !choosePartsEnabled || selectedParts.includes(row.part);
                  return (
                    <label className={'part-picker-row ' + (!row.test ? 'disabled' : '')} key={row.part}>
                      <span className="part-picker-check">
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!choosePartsEnabled || !row.test}
                          onChange={() => togglePart(row.part)}
                        />
                      </span>
                      <span className="part-picker-name">PART {row.part}</span>
                      <span className="part-picker-count">
                        {row.totalQuestions || row.standardQuestions} CÂU
                      </span>
                    </label>
                  );
                })}
            </div>
          </div>
        ))}

        <div className="part-picker-actions">
          <button onClick={startCombinedTest}>Bắt đầu bài test đã chọn</button>
          {lastResult ? (
            <div className="last-test-result">
              <button type="button" className="last-test-result-link" onClick={() => setResultPopupOpen(true)}>
                [Xem kết quả lần trước]
              </button>
              {resultPopupOpen && (
                <div className="last-test-result-popover" role="dialog" aria-modal="false" aria-labelledby="last-test-result-title">
                  <h3 id="last-test-result-title">KẾT QUẢ BÀI LÀM TRƯỚC</h3>
                  <p>Ngày hoàn thành: <strong>{formatResultDate(lastResult.completedAt)}</strong></p>
                  <p>Thời gian hoàn thành: <strong>{formatDuration(lastResult.durationSeconds)}</strong></p>
                  <p>Kết quả: <strong>{lastResult.totalToeicScore || 0}/990</strong></p>
                  <div className="last-test-result-detail">
                    <p><strong>Số câu đúng: {lastResult.correctCount || 0}/{lastResult.totalCount || 0}</strong></p>
                    <p><strong>Listening: {lastResult.listeningCorrect || 0}/{lastResult.listeningTotal || 0} - {lastResult.listeningScore || 0} điểm</strong></p>
                    <p><strong>Reading: {lastResult.readingCorrect || 0}/{lastResult.readingTotal || 0} - {lastResult.readingScore || 0} điểm</strong></p>
                    {lastResult.partBreakdown?.map((part) => (
                      <p key={part.part}>Part {part.part}: <strong>{part.correct}/{part.total}</strong></p>
                    ))}
                  </div>
                  <div className="last-test-result-actions">
                    <button type="button" onClick={openLastResultReview}>[Xem chi tiết &gt;]</button>
                    <button type="button" onClick={() => setResultPopupOpen(false)}>[Đóng x]</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <span>Gồm Listening và Reading, có thể bỏ chọn part chưa muốn làm.</span>
          )}
        </div>
      </section>
    </main>
  );
};

export default OnlineTestPartsPage;
