import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import sampleImage from '../assets/image.png';
import ExamTopNavbar from '../components/ExamTopNavbar';
import '../exam.css';

const ExamReviewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const searchParams = new URLSearchParams(useLocation().search);
  
  // Set currentPart from URL query or default to 3
  const currentPart = parseInt(searchParams.get('part') || '3');

  // --- Mock Data ---

  const part1Question = {
    number: 1, part: 1, imageUrl: sampleImage, correctAnswer: 'B',
    transcriptEn: ["(A) The woman is carrying a tray of food.", "(B) The woman is wearing a jacket.", "(C) The woman is tying up her hair.", "(D) The woman is removing her hat."],
    transcriptVi: ["(A) Người phụ nữ đang mang một khay thức ăn.", "(B) Người phụ nữ đang mặc một chiếc áo khoác.", "(C) Người phụ nữ đang buộc tóc lên.", "(D) Người phụ nữ đang cởi mũ ra."]
  };

  const part2Question = {
    number: 7, part: 2, imageUrl: null, correctAnswer: 'B',
    transcriptEn: ["7. Where is the conference being held?", "(A) A three-day vacation.", "(B) At the Riverview Hotel.", "(C) In the supply cabinet."],
    transcriptVi: ["7. Hội nghị được tổ chức ở đâu?", "(A) Một kỳ nghỉ kéo dài ba ngày.", "(B) Tại khách sạn Riverview.", "(C) Trong tủ/kho chứa đồ dùng."]
  };

  const part3Questions = [
    {
      number: 32, text: "What type of food product does the speakers' company sell?", correctAnswer: 'B',
      options: [{ label: 'A', text: 'Candy' }, { label: 'B', text: 'Cheese' }, { label: 'C', text: 'Bread' }, { label: 'D', text: 'Pasta' }],
      explanation: "Giải thích: Người đàn ông đề cập đến việc sản xuất phô mai."
    },
    {
      number: 33, text: "What does the man suggest?", correctAnswer: 'C',
      options: [{ label: 'A', text: 'Lowering prices' }, { label: 'B', text: 'Hiring more workers' }, { label: 'C', text: 'Publishing a recipe' }, { label: 'D', text: 'Offering additional options' }],
      explanation: "Giải thích: Người đàn ông gợi ý xuất bản một công thức nấu ăn."
    },
    {
      number: 34, text: "What does the woman say she will do?", correctAnswer: 'A',
      options: [{ label: 'A', text: 'Send a schedule update' }, { label: 'B', text: 'Contact a production manager' }, { label: 'C', text: 'Visit the company headquarters' }, { label: 'D', text: 'Plan an advertising campaign' }],
      explanation: "Giải thích: Người phụ nữ nói cô ấy sẽ gửi cập nhật lịch trình."
    }
  ];

  const part5Question = {
    number: 101, text: "The lecture will take place at 6:00 P.M., _______ which attendees may ask questions.", correctAnswer: 'B',
    options: [{ label: 'A', text: 'across' }, { label: 'B', text: 'after' }, { label: 'C', text: 'inside' }, { label: 'D', text: 'among' }],
    explanation: "Giải thích: 'after which' là cấu trúc mệnh đề quan hệ phù hợp nhất ở đây (sau đó, người tham dự có thể đặt câu hỏi)."
  };

  const part6Questions = [
    { number: 131, correctAnswer: 'D', options: [{ label: 'A', text: 'Staff members have written articles...' }, { label: 'B', text: 'Installing lights can enhance...' }, { label: 'C', text: 'Local competitors cannot beat...' }, { label: 'D', text: "Riessler Landscaping's goal is to make..." }], explanation: "Giải thích câu 131." },
    { number: 132, correctAnswer: 'C', options: [{ label: 'A', text: 'years' }, { label: 'B', text: 'space' }, { label: 'C', text: 'beauty' }, { label: 'D', text: 'moisture' }], explanation: "Giải thích câu 132." },
    { number: 133, correctAnswer: 'A', options: [{ label: 'A', text: 'also' }, { label: 'B', text: 'then' }, { label: 'C', text: 'later' }, { label: 'D', text: 'instead' }], explanation: "Giải thích câu 133." }
  ];

  const part7Questions = [
    { number: 172, text: "Why did Ms. Barry begin an online chat with Mr. Kubelski?", correctAnswer: 'D', options: [{ label: 'A', text: 'To refer him...' }, { label: 'B', text: 'To decline...' }, { label: 'C', text: 'To issue an apology' }, { label: 'D', text: 'To ask for clarification about a request' }], explanation: "Giải thích câu 172." },
    { number: 173, text: "Who will receive an e-mail from Mr. Kubelski?", correctAnswer: 'A', options: [{ label: 'A', text: 'Account holders in one age-group' }, { label: 'B', text: 'Data analysis team members' }, { label: 'C', text: 'Financial planners' }, { label: 'D', text: "All Mr. Kubelski's clients" }], explanation: "Giải thích câu 173." },
    { number: 174, text: "What does Ms. Choi do?", correctAnswer: 'B', options: [{ label: 'A', text: 'Write an e-mail' }, { label: 'B', text: 'Make a change to a form' }, { label: 'C', text: 'Organize a meeting' }, { label: 'D', text: 'Contact a client' }], explanation: "Giải thích câu 174." }
  ];

  const basicOptions = currentPart === 2 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];
  const [selectedAnswers] = useState({});

  // Render logic for right panel based on part
  const renderRightPanel = () => {
    // Single question format (Part 1, 2)
    if (currentPart === 1 || currentPart === 2) {
      const q = currentPart === 1 ? part1Question : part2Question;
      return (
        <div className="exam-taking-card">
          <div className="exam-taking-question-block exam-taking-question-block--full">
            <span className="exam-taking-qnum">{q.number}.</span>
            <div className="exam-taking-options">
              {basicOptions.map((opt) => (
                <label key={opt} className={`exam-taking-option-label ${opt === q.correctAnswer ? 'exam-review-correct-option' : ''}`} style={{ padding: opt === q.correctAnswer ? '0.5rem 1rem' : '0', borderRadius: '4px', pointerEvents: 'none' }}>
                  <input type="radio" name={`question-${q.number}`} value={opt} checked={opt === q.correctAnswer} readOnly className="exam-taking-radio" />
                  <span className="exam-taking-option-text" style={{ color: opt === q.correctAnswer ? 'white' : 'inherit' }}>{opt}.</span>
                </label>
              ))}
            </div>
            <div className="exam-review-transcript">
              {currentPart === 1 && <p className="exam-review-transcript-num">{q.number}.</p>}
              {q.transcriptEn.map((line, index) => (
                <p key={`en-${index}`} style={{ fontWeight: line.includes(`(${q.correctAnswer})`) ? 'bold' : 'normal' }}>{line}</p>
              ))}
              <br />
              {currentPart === 1 && <p className="exam-review-transcript-num">{q.number}.</p>}
              {q.transcriptVi.map((line, index) => (
                <p key={`vi-${index}`} style={{ fontWeight: line.includes(`(${q.correctAnswer})`) ? 'bold' : 'normal' }}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Group format (Part 3, 4, 6, 7) or single format with options text (Part 5)
    let qs = [];
    if (currentPart === 3 || currentPart === 4) qs = part3Questions;
    if (currentPart === 5) qs = [part5Question];
    if (currentPart === 6) qs = part6Questions;
    if (currentPart === 7) qs = part7Questions;

    return (
      <div className="exam-taking-card">
        <div className="exam-taking-question-group">
          {qs.map((q) => (
            <div key={q.number} className="exam-taking-question-block exam-taking-question-block--full" style={{ position: 'relative', paddingBottom: '2rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <div className="exam-taking-qtitle" style={{ paddingRight: '2rem' }}>
                <span className="exam-taking-qnum">{q.number}.</span>
                {q.text && <span className="exam-taking-qtext">{q.text}</span>}
              </div>
              <div className="exam-taking-options">
                {q.options.map((opt) => (
                  <label key={opt.label} className={`exam-taking-option-label ${opt.label === q.correctAnswer ? 'exam-review-correct-option' : ''}`} style={{ padding: opt.label === q.correctAnswer ? '0.5rem 1rem' : '0', borderRadius: '4px', pointerEvents: 'none' }}>
                    <input type="radio" name={`question-${q.number}`} value={opt.label} checked={opt.label === q.correctAnswer} readOnly className="exam-taking-radio" />
                    <span className="exam-taking-option-text" style={{ color: opt.label === q.correctAnswer ? 'white' : 'inherit' }}>
                      {opt.label}. {opt.text}
                    </span>
                  </label>
                ))}
              </div>
              <div className="exam-review-transcript">
                <p><strong>{q.explanation}</strong></p>
              </div>
            </div>
          ))}
          {(currentPart === 3 || currentPart === 4) && (
             <div className="exam-review-transcript" style={{ marginTop: '1rem' }}>
               <p className="exam-review-transcript-num">Transcript (Đoạn hội thoại):</p>
               <p>M: Have we started producing the new line of cheese yet?</p>
               <p>W: No, we are waiting for the packaging...</p>
               <p>M: Maybe we should publish a recipe on our website to generate interest.</p>
               <br/>
               <p className="exam-review-transcript-num">Bản dịch:</p>
               <p>Nam: Chúng ta đã bắt đầu sản xuất dòng phô mai mới chưa?</p>
               <p>Nữ: Chưa, chúng ta đang chờ bao bì...</p>
               <p>Nam: Có lẽ chúng ta nên đăng một công thức nấu ăn lên trang web...</p>
             </div>
          )}
        </div>
      </div>
    );
  };

  const showAudio = currentPart < 5;
  const imageUrl = (currentPart === 1 || currentPart === 3 || currentPart === 4 || currentPart === 6 || currentPart === 7) ? sampleImage : null;

  return (
    <div className="exam-taking-page">
      <ExamTopNavbar 
        mode="review"
        onRetry={() => navigate(`/exams/${id}/take`)}
        onExit={() => navigate(`/exams`)}
      />
      <div className="exam-taking-header">
        <h1 className="exam-taking-part-title">PART {currentPart}</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="exam-btn-prev">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Câu trước
          </button>
          <button className="exam-btn-next">
            Câu tiếp <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <div className="exam-taking-score-badge">0/200</div>
        </div>
      </div>

      <div className="exam-taking-content" style={{ paddingBottom: showAudio ? '80px' : '0' }}>
        <div className="exam-taking-split-layout">
          <div className="exam-taking-left-panel">
            <div className="exam-taking-card">
              <h3 className="exam-taking-card-title">Câu hỏi</h3>
              {currentPart === 6 && <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b', marginBottom: '1rem', marginTop: '0.5rem' }}>Questions 131-134 refer to the following flyer.</div>}
              {currentPart === 7 && <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b', marginBottom: '1rem', marginTop: '0.5rem' }}>Questions 172-175 refer to the following online chat discussion.</div>}
              {imageUrl && (
                <div className="exam-taking-image-container">
                  <img src={imageUrl} alt={`Question for Part ${currentPart}`} />
                </div>
              )}
            </div>
          </div>
          <div className="exam-taking-right-panel">
            {renderRightPanel()}
          </div>
        </div>
      </div>

      {showAudio && (
        <div className="exam-review-audio-bar">
          <audio controls style={{ width: '300px' }}>
            <source src="mock-audio.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default ExamReviewPage;
