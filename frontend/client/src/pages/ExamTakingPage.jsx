import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import sampleImage from '../assets/image.png';
import ExamTopNavbar from '../components/ExamTopNavbar';
import SubmitResultModal from '../components/SubmitResultModal';
import '../exam.css';

const ExamTakingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedParts = [1, 2, 3, 4, 5, 6, 7], selectedTime = '120', selectByPart = false, currentPart = 1 } = location.state || {};

  // For demonstration, simulating a question based on currentPart
  const [currentQuestion, setCurrentQuestion] = useState({
    id: currentPart === 7 ? 172 : (currentPart === 6 ? 131 : (currentPart === 5 ? 101 : (currentPart === 2 ? 8 : 4))),
    number: currentPart === 7 ? 172 : (currentPart === 6 ? 131 : (currentPart === 5 ? 101 : (currentPart === 2 ? 8 : 4))),
    part: currentPart,
    imageUrl: (currentPart === 2 || currentPart === 5) ? null : sampleImage,
    audioUrl: null
  });

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const handleOptionChange = (qNum, option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qNum]: option
    }));
  };

  // Mock data for Part 3
  const part3Questions = [
    {
      number: 32,
      text: "What type of food product does the speakers' company sell?",
      options: [
        { label: 'A', text: 'Candy' },
        { label: 'B', text: 'Cheese' },
        { label: 'C', text: 'Bread' },
        { label: 'D', text: 'Pasta' }
      ]
    },
    {
      number: 33,
      text: "What does the man suggest?",
      options: [
        { label: 'A', text: 'Lowering prices' },
        { label: 'B', text: 'Hiring more workers' },
        { label: 'C', text: 'Publishing a recipe' },
        { label: 'D', text: 'Offering additional options' }
      ]
    },
    {
      number: 34,
      text: "What does the woman say she will do?",
      options: [
        { label: 'A', text: 'Send a schedule update' },
        { label: 'B', text: 'Contact a production manager' },
        { label: 'C', text: 'Visit the company headquarters' },
        { label: 'D', text: 'Plan an advertising campaign' }
      ]
    }
  ];

  // Mock data for Part 5
  const part5Question = {
    number: 101,
    text: "The lecture will take place at 6:00 P.M., _______ which attendees may ask questions.",
    options: [
      { label: 'A', text: 'across' },
      { label: 'B', text: 'after' },
      { label: 'C', text: 'inside' },
      { label: 'D', text: 'among' }
    ]
  };

  // Mock data for Part 6
  const part6Questions = [
    {
      number: 131,
      options: [
        { label: 'A', text: 'Staff members have written articles for the local newspaper.' },
        { label: 'B', text: 'Installing lights can enhance the effect of a well-designed garden.' },
        { label: 'C', text: 'Local competitors cannot beat the prices we charge.' },
        { label: 'D', text: "Riessler Landscaping's goal is to make your vision a reality." }
      ]
    },
    {
      number: 132,
      options: [
        { label: 'A', text: 'years' },
        { label: 'B', text: 'space' },
        { label: 'C', text: 'beauty' },
        { label: 'D', text: 'moisture' }
      ]
    },
    {
      number: 133,
      options: [
        { label: 'A', text: 'also' },
        { label: 'B', text: 'then' },
        { label: 'C', text: 'later' },
        { label: 'D', text: 'instead' }
      ]
    }
  ];

  // Mock data for Part 7
  const part7Questions = [
    {
      number: 172,
      text: "Why did Ms. Barry begin an online chat with Mr. Kubelski?",
      options: [
        { label: 'A', text: 'To refer him to a different department' },
        { label: 'B', text: 'To decline an information request' },
        { label: 'C', text: 'To issue an apology' },
        { label: 'D', text: 'To ask for clarification about a request' }
      ]
    },
    {
      number: 173,
      text: "Who will receive an e-mail from Mr. Kubelski?",
      options: [
        { label: 'A', text: 'Account holders in one age-group' },
        { label: 'B', text: 'Data analysis team members' },
        { label: 'C', text: 'Financial planners' },
        { label: 'D', text: "All Mr. Kubelski's clients" }
      ]
    },
    {
      number: 174,
      text: "What does Ms. Choi do?",
      options: [
        { label: 'A', text: 'Write an e-mail' },
        { label: 'B', text: 'Make a change to a form' },
        { label: 'C', text: 'Organize a meeting' },
        { label: 'D', text: 'Contact a client' }
      ]
    }
  ];

  // Determine options based on part (Part 2 has 3 options, Part 1 has 4)
  const basicOptions = currentPart === 2 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];

  const renderRightPanel = () => {
    if (currentPart === 3 || currentPart === 4) {
      return (
        <div className="exam-taking-card">
          <div className="exam-taking-question-group">
            {part3Questions.map((q) => (
              <div key={q.number} className="exam-taking-question-block exam-taking-question-block--full">
                <div className="exam-taking-qtitle">
                  <span className="exam-taking-qnum">{q.number}.</span>
                  <span className="exam-taking-qtext">{q.text}</span>
                </div>
                
                <div className="exam-taking-options">
                  {q.options.map((opt) => (
                    <label key={opt.label} className="exam-taking-option-label">
                      <input 
                        type="radio" 
                        name={`question-${q.number}`}
                        value={opt.label}
                        checked={selectedAnswers[q.number] === opt.label}
                        onChange={() => handleOptionChange(q.number, opt.label)}
                        className="exam-taking-radio"
                      />
                      <span className="exam-taking-option-text">
                        {opt.label}. {opt.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (currentPart === 6 || currentPart === 7) {
      const qs = currentPart === 7 ? part7Questions : part6Questions;
      return (
        <div className="exam-taking-card">
          <div className="exam-taking-question-group">
            {qs.map((q) => (
              <div key={q.number} className="exam-taking-question-block exam-taking-question-block--full" style={{ position: 'relative' }}>
                {/* Flag Icon */}
                <svg 
                  width="24" height="24" viewBox="0 0 24 24" 
                  fill="#94a3b8" 
                  style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/>
                </svg>

                <div className="exam-taking-qtitle" style={{ paddingRight: '2rem' }}>
                  <span className="exam-taking-qnum">{q.number}.</span>
                  {q.text && <span className="exam-taking-qtext">{q.text}</span>}
                </div>
                
                <div className="exam-taking-options">
                  {q.options.map((opt) => (
                    <label key={opt.label} className="exam-taking-option-label">
                      <input 
                        type="radio" 
                        name={`question-${q.number}`}
                        value={opt.label}
                        checked={selectedAnswers[q.number] === opt.label}
                        onChange={() => handleOptionChange(q.number, opt.label)}
                        className="exam-taking-radio"
                      />
                      <span className="exam-taking-option-text">
                        {opt.label}. {opt.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (currentPart === 5) {
      return (
        <div className="exam-taking-card">
          <div className="exam-taking-question-block exam-taking-question-block--full" style={{ position: 'relative' }}>
            {/* Flag Icon */}
            <svg 
              width="24" height="24" viewBox="0 0 24 24" 
              fill="#94a3b8" 
              style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/>
            </svg>

            <div className="exam-taking-qtitle" style={{ paddingRight: '2rem' }}>
              <span className="exam-taking-qnum">{part5Question.number}.</span>
              <span className="exam-taking-qtext">{part5Question.text}</span>
            </div>
            
            <div className="exam-taking-options">
              {part5Question.options.map((opt) => (
                <label key={opt.label} className="exam-taking-option-label">
                  <input 
                    type="radio" 
                    name={`question-${part5Question.number}`}
                    value={opt.label}
                    checked={selectedAnswers[part5Question.number] === opt.label}
                    onChange={() => handleOptionChange(part5Question.number, opt.label)}
                    className="exam-taking-radio"
                  />
                  <span className="exam-taking-option-text">
                    {opt.label}. {opt.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Part 1 and 2
    return (
      <div className="exam-taking-card">
        <div className="exam-taking-question-block">
          <span className="exam-taking-qnum">{currentQuestion.number}.</span>
          
          <div className="exam-taking-options">
            {basicOptions.map((opt) => (
              <label key={opt} className="exam-taking-option-label">
                <input 
                  type="radio" 
                  name={`question-${currentQuestion.number}`}
                  value={opt}
                  checked={selectedAnswers[currentQuestion.number] === opt}
                  onChange={() => handleOptionChange(currentQuestion.number, opt)}
                  className="exam-taking-radio"
                />
                <span className="exam-taking-option-text">{opt}.</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="exam-taking-page">
      <ExamTopNavbar 
        showTimerAndSubmit={true} 
        timeRemaining="01:59:39" 
        onSubmit={() => setIsSubmitModalOpen(true)}
      />
      {/* Top bar */}
      <div className="exam-taking-header">
        <h1 className="exam-taking-part-title">PART {currentQuestion.part}</h1>
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

      {/* Main Content Area */}
      <div className="exam-taking-content">
        <div className="exam-taking-split-layout">
          
          {/* Left Side: Question content (Image/Passage) */}
          <div className="exam-taking-left-panel">
            <div className="exam-taking-card">
              <h3 className="exam-taking-card-title">Câu hỏi</h3>
              
              {currentPart === 6 && (
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b', marginBottom: '1rem', marginTop: '0.5rem' }}>
                  Questions 131-134 refer to the following flyer.
                </div>
              )}

              {currentPart === 7 && (
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b', marginBottom: '1rem', marginTop: '0.5rem' }}>
                  Questions 172-175 refer to the following online chat discussion.
                </div>
              )}

              {currentQuestion.imageUrl && (
                <div className="exam-taking-image-container">
                  <img src={currentQuestion.imageUrl} alt={`Question ${currentQuestion.number}`} />
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Options */}
          <div className="exam-taking-right-panel">
            {renderRightPanel()}
          </div>
        </div>
      </div>

      <SubmitResultModal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)} 
        onViewAnswers={() => {
          setIsSubmitModalOpen(false);
          navigate(`/exams/${id}/review`);
        }} 
      />
    </div>
  );
};

export default ExamTakingPage;
