import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getPracticeTopics, 
  getPracticeNextQuestion, 
  submitPracticeAnswer, 
  getPracticeStats, 
  getPracticeProgress,
  startPracticeSession,
  endPracticeSession
} from '../services/api';
import { getFullUrl } from '../utils/urlUtils';
import Header from '../components/Header';
import { Line } from 'react-chartjs-2';
import {
  GrammarLayout,
  ListeningPart1Layout,
  ListeningPart2Layout,
  ListeningGroupLayout,
  ReadingPassageLayout
} from './QuizPage';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PracticePage = () => {
  const { sectionSlug } = useParams();
  const navigate = useNavigate();

  // State
  const [filterGroups, setFilterGroups] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  
  const [isInitializing, setIsInitializing] = useState(true);
  const [isPracticing, setIsPracticing] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const [currentData, setCurrentData] = useState(null); // PracticeNextResponse
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoNext, setAutoNext] = useState(false);
  const autoNextTimeoutRef = useRef(null);

  const [stats, setStats] = useState([]);
  const [progress, setProgress] = useState([]);

  // For answering
  const [answers, setAnswers] = useState({}); // { qId: 'A' }
  const [results, setResults] = useState({}); // { qId: { correct: true, ... } }
  const [excludeIds, setExcludeIds] = useState([]); // Keep track of recent questions to avoid repeats

  useEffect(() => {
    setIsInitializing(true);
    loadDashboardData().then(() => {
      const cachedData = sessionStorage.getItem(`practice_${sectionSlug}_data`);
      const cachedSession = sessionStorage.getItem(`practice_${sectionSlug}_session`);
      
      if (cachedData && cachedSession) {
        setSessionId(parseInt(cachedSession, 10));
        setCurrentData(JSON.parse(cachedData));
        
        const cachedAnswers = sessionStorage.getItem(`practice_${sectionSlug}_answers`);
        if (cachedAnswers) setAnswers(JSON.parse(cachedAnswers));
        
        const cachedResults = sessionStorage.getItem(`practice_${sectionSlug}_results`);
        if (cachedResults) setResults(JSON.parse(cachedResults));
        
        setIsPracticing(true);
        setIsInitializing(false);
      } else {
        handleStartPractice().finally(() => {
          setIsInitializing(false);
        });
      }
    });
  }, [sectionSlug]);

  const loadDashboardData = async () => {
    try {
      const [topicsRes, statsRes, progressRes] = await Promise.all([
        getPracticeTopics(sectionSlug),
        getPracticeStats(sectionSlug),
        getPracticeProgress(sectionSlug, 7) // Last 7 days
      ]);
      setFilterGroups(topicsRes || topicsRes.data || []);
      setStats(statsRes || statsRes.data || []);
      setProgress(progressRes || progressRes.data || []);
    } catch (err) {
      console.error(err);
      setError('Lỗi tải dữ liệu. Vui lòng thử lại sau.');
    }
  };

  const handleStartPractice = async () => {
    try {
      setLoading(true);
      const res = await startPracticeSession(sectionSlug, null);
      const sid = res.sessionId || (res.data && res.data.sessionId);
      setSessionId(sid);
      sessionStorage.setItem(`practice_${sectionSlug}_session`, sid);
      setIsPracticing(true);
      setExcludeIds([]);
      await fetchNextQuestion([]);
    } catch (err) {
      console.error(err);
      alert('Không thể bắt đầu luyện tập');
    } finally {
      setLoading(false);
    }
  };

  const getPayloadFilters = () => {
    const payload = {
        sourceTopicIds: selectedFilters['DEFAULT'] || [],
        questionTopicIds: [],
        groupTopicIds: []
    };
    
    const questionCats = ['QUESTION_TYPE', 'GRAMMAR', 'VOCABULARY'];
    const groupCats = ['CONVERSATION_THEME', 'FORMAT', 'STRUCTURE'];
    
    Object.keys(selectedFilters).forEach(key => {
        if (questionCats.includes(key)) {
            payload.questionTopicIds.push(...selectedFilters[key]);
        } else if (groupCats.includes(key)) {
            payload.groupTopicIds.push(...selectedFilters[key]);
        }
    });
    
    return payload;
  };

  const fetchNextQuestion = async (currentExcludes = []) => {
    try {
      setLoading(true);
      setResults({});
      setAnswers({});
      
      const payload = {
        sectionId: null,
        excludeQuestionIds: currentExcludes,
        ...getPayloadFilters()
      };
      
      const res = await getPracticeNextQuestion(sectionSlug, payload);
      const dataObj = res.data ? res : { data: res, type: res.questions ? 'GROUP' : 'QUESTION' };
      setCurrentData(dataObj);
      sessionStorage.setItem(`practice_${sectionSlug}_data`, JSON.stringify(dataObj));
      sessionStorage.removeItem(`practice_${sectionSlug}_answers`);
      sessionStorage.removeItem(`practice_${sectionSlug}_results`);
      
      // Update exclude list
      let qIds = [];
      if (dataObj.type === 'GROUP') {
        qIds = dataObj.data.questions.map(q => q.id);
      } else {
        qIds = [dataObj.data.id];
      }
      
      setExcludeIds(prev => {
        let next = [...prev, ...qIds];
        if (next.length > 15) next = next.slice(next.length - 15);
        return next;
      });

    } catch (err) {
      console.error(err);
      if (err.message.includes('No eligible questions')) {
        alert('Không tìm thấy câu hỏi nào cho chủ đề này.');
        handleEndPractice();
      } else {
        setError('Lỗi tải câu hỏi tiếp theo');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswers = async () => {
    const isGroup = currentData.type === 'GROUP';
    const questions = isGroup ? currentData.data.questions : [currentData.data];
    
    // Validate
    const allAnswered = questions.every(q => answers[q.id]);
    if (!allAnswered) return;
    
    try {
      setLoading(true);
      const promises = questions.map(q => submitPracticeAnswer({
        questionId: q.id,
        selectedAnswer: answers[q.id],
        sessionId
      }));
      
      const responsesList = await Promise.all(promises);
      
      const newResults = {};
      responsesList.forEach((res, i) => {
        newResults[questions[i].id] = res;
      });
      
      setResults(newResults);
      sessionStorage.setItem(`practice_${sectionSlug}_results`, JSON.stringify(newResults));
      
      // AutoNext logic
      if (autoNext) {
        if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
        autoNextTimeoutRef.current = setTimeout(() => {
          handleNext();
        }, 2500);
      }
      
      // Refresh stats quietly
      getPracticeStats(sectionSlug).then(r => setStats(r.data)).catch(e => console.error(e));
      
    } catch (err) {
      console.error(err);
      alert('Lỗi gửi câu trả lời');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    fetchNextQuestion(excludeIds);
  };

  const handleEndPractice = () => {
    setIsPracticing(false);
    setCurrentData(null);
    setAnswers({});
    setResults({});
    sessionStorage.removeItem(`practice_${sectionSlug}_data`);
    sessionStorage.removeItem(`practice_${sectionSlug}_session`);
    sessionStorage.removeItem(`practice_${sectionSlug}_answers`);
    sessionStorage.removeItem(`practice_${sectionSlug}_results`);
    if (sessionId) {
      endPracticeSession(sessionId).catch(e => console.error(e));
      setSessionId(null);
    }
  };

  const toggleFilter = (type, topicId) => {
    setSelectedFilters(prev => {
        const current = prev[type] || [];
        if (current.includes(topicId)) {
            return { ...prev, [type]: current.filter(id => id !== topicId) };
        } else {
            return { ...prev, [type]: [...current, topicId] };
        }
    });
  };

  // --- Rendering Helpers ---
  const chartData = {
    labels: progress.map(p => p.date),
    datasets: [
      {
        label: 'Số câu làm đúng',
        data: progress.map(p => p.correctCount),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Tổng số câu',
        data: progress.map(p => p.totalQuestions),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.3,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Biểu đồ tiến độ (7 ngày qua)' },
    },
    scales: {
      y: { beginAtZero: true, suggestedMax: 10 }
    }
  };

  const renderDashboard = () => (
    <div className="practice-dashboard">
      <div className="dashboard-header">
        <h1>Luyện tập tổng hợp: {sectionSlug.toUpperCase()}</h1>
        <p>Luyện tập không giới hạn với công nghệ lặp lại ngắt quãng (Spaced Repetition). Câu trả lời sai sẽ xuất hiện nhiều hơn để bạn cải thiện.</p>
      </div>

      <div className="dashboard-content">
        <div className="start-panel">
          <h3>Bắt đầu luyện tập</h3>
          <div className="filters-container" style={{display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px'}}>
            {filterGroups.map(group => (
              <div key={group.filterType} className="filter-group" style={{minWidth: '200px'}}>
                  <h4 style={{marginBottom: '10px'}}>{group.filterLabel}</h4>
                  <div className="filter-options" style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                      {group.topics.map(t => (
                          <label key={t.topicId} className="filter-checkbox" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <input 
                                  type="checkbox" 
                                  checked={(selectedFilters[group.filterType] || []).includes(t.topicId)}
                                  onChange={() => toggleFilter(group.filterType, t.topicId)}
                              />
                              {t.topicTitle}
                          </label>
                      ))}
                  </div>
              </div>
            ))}
            {filterGroups.length === 0 && <p>Chưa có chủ đề nào.</p>}
          </div>
          <button className="btn-primary start-btn" onClick={handleStartPractice} disabled={loading}>
            {loading ? 'Đang tải...' : 'Bắt đầu ngay'}
          </button>
        </div>

        <div className="stats-panel">
          <div className="chart-container">
            {progress.length > 0 ? (
              <Line options={chartOptions} data={chartData} />
            ) : (
              <p>Chưa có dữ liệu tiến độ. Hãy bắt đầu luyện tập!</p>
            )}
          </div>
          
          <div className="topic-stats">
            <h4>Thống kê theo chủ đề</h4>
            <div className="stats-grid">
              {stats.map(s => (
                <div key={s.sourceTopicId} className="stat-card">
                  <div className="stat-title">{s.sourceTopicTitle}</div>
                  <div className="stat-body">
                    <div>Tổng: <b>{s.totalAttempted}</b></div>
                    <div>Đúng: <b style={{color: 'green'}}>{s.correctCount}</b></div>
                    <div>Độ chính xác: <b style={{color: s.accuracy > 70 ? 'green' : s.accuracy > 40 ? 'orange' : 'red'}}>
                      {s.accuracy ? s.accuracy.toFixed(1) + '%' : '0%'}
                    </b></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getProcessedData = () => {
    if (!currentData) return null;
    let dataCopy = JSON.parse(JSON.stringify(currentData.data));
    if (currentData.type === 'GROUP') {
      dataCopy.questions = (dataCopy.questions || []).map(q => {
        if (results[q.id]) {
          return { ...q, correctAnswer: results[q.id].correctAnswer, explanation: results[q.id].explanation };
        }
        return q;
      });
    } else {
      if (results[dataCopy.id]) {
        dataCopy = { ...dataCopy, correctAnswer: results[dataCopy.id].correctAnswer, explanation: results[dataCopy.id].explanation };
      }
    }
    return dataCopy;
  };

  const renderPracticeArea = () => {
    if (!currentData) return <div className="quiz-loading"><div className="spinner"></div><p>Đang tải câu hỏi...</p></div>;

    const isGroup = currentData.type === 'GROUP';
    const rawData = getProcessedData();
    const questions = isGroup ? rawData.questions : [rawData];
    const allAnswered = questions.every(q => answers[q.id]);
    const isCompleted = Object.keys(results).length === questions.length;
    const hasResults = Object.keys(results).length > 0;

    const commonProps = {
      answers: answers,
      showAnswer: hasResults,
      handleAnswer: (qId, opt) => {
        if (!results[qId]) {
          setAnswers(prev => {
            const next = {...prev, [qId]: opt};
            sessionStorage.setItem(`practice_${sectionSlug}_answers`, JSON.stringify(next));
            return next;
          });
        }
      }
    };

    let LayoutComponent = GrammarLayout;
    if (sectionSlug.includes('part-1')) LayoutComponent = ListeningPart1Layout;
    else if (sectionSlug.includes('part-2')) LayoutComponent = ListeningPart2Layout;
    else if (sectionSlug.includes('part-3') || sectionSlug.includes('part-4')) LayoutComponent = ListeningGroupLayout;
    else if (sectionSlug.includes('part-6') || sectionSlug.includes('part-7')) LayoutComponent = ReadingPassageLayout;

    let layoutProps = {};
    if (isGroup) {
      layoutProps = { groups: [rawData], currentGroupIndex: 0, questions: rawData.questions || [rawData], currentIndex: 0, setCurrentIndex: () => {}, ...commonProps };
    } else {
      const mockGroup = {
        audioUrl: rawData.audioUrl,
        imageUrl: rawData.imageUrl,
        questions: [rawData]
      };
      layoutProps = { 
        groups: [mockGroup], currentGroupIndex: 0, 
        questions: [rawData], currentIndex: 0, setCurrentIndex: () => {}, ...commonProps 
      };
    }

    const currentTopicTitle = currentData.sourceTopicTitle || rawData.sourceTopicTitle || 'Tất cả chủ đề';

    return (
      <div className="quiz-layout" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, backgroundColor: '#f0f2f5' }}>
        <Header />
        <div className="quiz-body">
          <aside className="quiz-sidebar open">
            <div className="quiz-sidebar-header" style={{ backgroundColor: '#3b5998', color: 'white', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', fontSize: '15px' }}>Luyện tập tổng hợp</span>
            </div>
            <div className="quiz-sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="sidebar-menu-items" style={{ padding: '0' }}>
                <div className="sidebar-item active" style={{ padding: '16px', backgroundColor: '#e8f0fe', borderLeft: '4px solid #3b5998', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                  <span><strong>Đang học:</strong> {currentTopicTitle}</span>
                </div>
                <div className="sidebar-item" style={{ padding: '16px', borderBottom: '1px solid #eee', color: '#666', cursor: 'pointer' }} onClick={() => navigate(`/sections/${sectionSlug}`)}>
                  ← Quay lại Section
                </div>
              </div>
            </div>
          </aside>

          <div className="quiz-main">
            <div className="quiz-breadcrumb">
              <span className="bc-link" onClick={() => navigate(`/sections/${sectionSlug}`)}>← Section</span>
              <span className="bc-sep"> / </span>
              <span>Luyện tập tổng hợp</span>
            </div>

            <div className="quiz-toolbar mock-toolbar" style={{ display: 'flex', alignItems: 'center' }}>
              <label className="toggle-switch mock-highlight-toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
                <span className="toggle-label">Highlight</span>
              </label>
              <button className="quiz-btn btn-outline mock-toolbar-btn mock-btn-active">
                Lưu/khôi phục highlight ▾
              </button>
              
              <button 
                className="quiz-btn btn-outline mock-toolbar-btn mock-btn-check" 
                onClick={handleSubmitAnswers}
                disabled={!allAnswered || loading || isCompleted}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Kiểm tra đáp án
              </button>
              
              <button className="quiz-btn btn-outline mock-toolbar-btn" onClick={() => { if(!isCompleted) setAnswers({}) }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                Xoá hết
              </button>
              
              <button className="quiz-btn btn-outline mock-toolbar-btn" onClick={() => setShowFilterModal(true)} style={{ marginLeft: 'auto' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                Lọc chủ đề
              </button>
              <button className="quiz-btn btn-outline mock-toolbar-btn" onClick={handleEndPractice}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                  <path d="M3 3v18h18"></path>
                  <path d="M18 17V9"></path>
                  <path d="M13 17V5"></path>
                  <path d="M8 17v-3"></path>
                </svg>
                Thống kê
              </button>
            </div>

            {/* Exercise Content */}
            <div style={{ flex: '1 0 auto' }}>
              {currentData?.sourceTopicTitle && (
                <div style={{ marginBottom: '15px', display: 'inline-block', backgroundColor: '#e6f7ff', color: '#1890ff', padding: '6px 12px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', border: '1px solid #91d5ff' }}>
                  Loại câu hỏi: {currentData.sourceTopicTitle}
                </div>
              )}
              <LayoutComponent {...layoutProps} />
            </div>

            {/* Action Buttons */}
            <div className="quiz-nav-grid-container" style={{ background: 'white', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px', marginBottom: '24px' }}>
              <div className="quiz-nav-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button className="quiz-nav-btn" disabled={true} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e8f0fe', color: '#35509a', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'not-allowed', opacity: 0.5 }}>
                  ‹ Câu trước
                </button>

                <label className="toggle-switch" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={autoNext}
                      onChange={() => setAutoNext(!autoNext)}
                      style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer', zIndex: 2 }}
                    />
                    <div style={{ width: '40px', height: '22px', background: autoNext ? '#35509a' : '#ccc', borderRadius: '20px', position: 'relative', transition: 'background-color 0.2s' }}>
                      <div style={{ position: 'absolute', top: '2px', left: autoNext ? '20px' : '2px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></div>
                    </div>
                  </div>
                  <span className="toggle-label" style={{ fontSize: '14px', color: '#333' }}>Tự động chuyển câu</span>
                </label>

                <button 
                  className="quiz-nav-btn" 
                  onClick={handleNext} 
                  disabled={!isCompleted || loading} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e8f0fe', color: '#35509a', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: (!isCompleted || loading) ? 'not-allowed' : 'pointer', opacity: (!isCompleted || loading) ? 0.5 : 1 }}
                >
                  {loading ? 'Đang tải...' : 'Câu sau ›'}
                </button>
              </div>
            </div>

            <button 
              className="quiz-finish-next-btn"
              onClick={handleEndPractice}
              style={{
                width: '100%',
                padding: '24px',
                marginTop: '8px',
                marginBottom: '24px',
                backgroundColor: 'transparent',
                color: '#1a1a1a',
                border: 'none',
                borderTop: '1px solid #e0e0e0',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#35509a'}
              onMouseOut={(e) => e.currentTarget.style.color = '#1a1a1a'}
            >
              HOÀN THÀNH & XEM THỐNG KÊ <span style={{ fontSize: '18px' }}>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderFilterModal = () => {
    if (!showFilterModal) return null;
    return (
      <div className="modal-overlay" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="modal-content" style={{backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h3 style={{margin: 0}}>Lọc chủ đề luyện tập</h3>
            <button onClick={() => setShowFilterModal(false)} style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer'}}>×</button>
          </div>
          <div className="filters-container" style={{display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px'}}>
            {filterGroups.map(group => (
              <div key={group.filterType} className="filter-group" style={{minWidth: '200px'}}>
                  <h4 style={{marginBottom: '10px'}}>{group.filterLabel}</h4>
                  <div className="filter-options" style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                      {group.topics.map(t => (
                          <label key={t.topicId} className="filter-checkbox" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <input 
                                  type="checkbox" 
                                  checked={(selectedFilters[group.filterType] || []).includes(t.topicId)}
                                  onChange={() => toggleFilter(group.filterType, t.topicId)}
                              />
                              {t.topicTitle}
                          </label>
                      ))}
                  </div>
              </div>
            ))}
            {filterGroups.length === 0 && <p>Chưa có chủ đề nào.</p>}
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <button className="btn-primary" onClick={() => { setShowFilterModal(false); fetchNextQuestion([]); }}>
              Áp dụng & Tải câu hỏi mới
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isInitializing) {
    return (
      <div className="quiz-loading">
        <div className="spinner"></div>
        <p>Đang chuẩn bị phiên luyện tập...</p>
      </div>
    );
  }

  return (
    <div className="practice-page-container">
      {error && <div className="error-banner">{error}</div>}
      {!isPracticing ? renderDashboard() : renderPracticeArea()}
      {renderFilterModal()}
    </div>
  );
};

export default PracticePage;
