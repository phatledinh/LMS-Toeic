import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { getLessonById } from '../services/api';
import { getFullUrl } from '../utils/urlUtils';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

/**
 * Chuyển Google Drive share link → embed link cho video/iframe.
 * VD: https://drive.google.com/file/d/FILE_ID/view → https://drive.google.com/file/d/FILE_ID/preview
 */
const toEmbedUrl = (url) => {
  if (!url) return null;
  // Drive video/doc embed
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  return url;
};

const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'note'
  const mainRef = useRef(null);
  
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  useEffect(() => {
    setLoading(true);
    getLessonById(id)
      .then((res) => setLesson(res.data))
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
    // Scroll to top khi chuyển bài
    mainRef.current?.scrollTo(0, 0);
  }, [id]);

  const videoEmbedUrl = toEmbedUrl(lesson?.videoUrl);
  const docUrlFull = getFullUrl(lesson?.docUrl);
  // Nếu là Google Drive thì dùng toEmbedUrl, nếu là local file thì nhúng trực tiếp
  const docEmbedUrl = lesson?.docUrl?.includes('drive.google.com') ? toEmbedUrl(lesson.docUrl) : docUrlFull;

  if (loading) return (
    <div className="quiz-loading">
      <div className="spinner"></div>
      <p>Đang tải bài học...</p>
    </div>
  );

  if (!lesson) return null;

  return (
    <div className="quiz-layout">
      <Header />
      <div className="quiz-body">
        {/* Sidebar trái */}
        <aside className={`quiz-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
          <div className="quiz-sidebar-header" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span>{lesson.title}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={sidebarOpen ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
            </svg>
          </div>
          {sidebarOpen && (
            <ul className="quiz-sidebar-menu">
              <li className="quiz-sidebar-item active done">
                <span className="q-status-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                </span>
                <span>Lý thuyết: {lesson.title}</span>
              </li>
            </ul>
          )}
        </aside>

        {/* Nội dung chính */}
        <div className="quiz-main lesson-main" ref={mainRef}>
          {/* Breadcrumb */}
          <div className="quiz-breadcrumb">
            <span className="bc-link" onClick={() => navigate(-1)}>← Quay lại</span>
            <span className="bc-sep"> / </span>
            <span>{lesson.title}</span>
            {lesson.durationMinutes && (
              <span className="lesson-duration">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {lesson.durationMinutes} phút
              </span>
            )}
            <div className="breadcrumb-actions">
              <button className="quiz-btn btn-outline" onClick={() => navigate(-1)}>‹ Bài trước</button>
              <button className="quiz-btn btn-outline">Bài sau ›</button>
            </div>
          </div>

          {/* Video Player */}
          {videoEmbedUrl && (
            <div className="video-wrapper">
              <iframe
                key={`video-${id}`}
                src={videoEmbedUrl}
                title={lesson.title}
                allowFullScreen
                allow="autoplay"
                className="video-frame"
              />
            </div>
          )}

          {/* Tabs nội dung tài liệu */}
          <div className="lesson-tabs">
            <button
              className={`lesson-tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              📄 Nội dung tài liệu
            </button>
            <button
              className={`lesson-tab ${activeTab === 'note' ? 'active' : ''}`}
              onClick={() => setActiveTab('note')}
            >
              📝 Ghi chú của tôi
            </button>
          </div>

          {/* Nội dung tài liệu */}
          {activeTab === 'content' && (
            <div className="lesson-doc-section">
              {docEmbedUrl ? (
                <>
                  <div className="doc-embed-wrapper" style={{ overflow: 'visible', height: 'auto', minHeight: 'auto' }}>
                    {docEmbedUrl.includes('drive.google.com') ? (
                      <iframe
                        key={`doc-${id}`}
                        src={docEmbedUrl}
                        title={`Tài liệu: ${lesson.title}`}
                        className="doc-frame"
                      />
                    ) : (
                      <div className="pdf-render-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#eef2f5', padding: '20px', borderRadius: '8px' }}>
                        <Document
                          file={docEmbedUrl}
                          onLoadSuccess={onDocumentLoadSuccess}
                          loading={<div style={{ padding: '20px' }}>Đang tải tài liệu...</div>}
                          error={<div style={{ padding: '20px' }}>Không thể hiển thị tài liệu. <a href={docUrlFull} target="_blank" rel="noreferrer">Tải về tại đây</a>.</div>}
                        >
                          {Array.from(new Array(numPages), (el, index) => (
                            <div key={`page_wrapper_${index + 1}`} style={{ marginBottom: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                              <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                width={800}
                              />
                            </div>
                          ))}
                        </Document>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="doc-empty">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <p>Chưa có tài liệu đính kèm</p>
                </div>
              )}
            </div>
          )}

          {/* Ghi chú */}
          {activeTab === 'note' && (
            <div className="lesson-note-section">
              <textarea
                className="note-textarea"
                placeholder="Ghi chú của bạn về bài học này..."
                rows={12}
              />
              <button className="quiz-btn btn-primary" style={{ marginTop: 12 }}>
                Lưu ghi chú
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
