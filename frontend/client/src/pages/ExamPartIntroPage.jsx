import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import sampleImage from '../assets/image.png';
import ExamTopNavbar from '../components/ExamTopNavbar';
import '../exam.css';

// Cấu trúc số câu hỏi mỗi part
const PART_QUESTION_RANGES = {
  1: { start: 1, count: 6 },
  2: { start: 7, count: 25 },
  3: { start: 32, count: 39 },
  4: { start: 71, count: 30 },
  5: { start: 101, count: 30 },
  6: { start: 131, count: 16 },
  7: { start: 147, count: 54 },
};

const ExamPartIntroPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedParts = [1,2,3,4,5,6,7], selectedTime = '120', selectByPart = false } = location.state || {};

  // Determine the first selected part to show intro for
  const currentPart = selectedParts.length > 0 ? Math.min(...selectedParts) : 1;

  // Generate question numbers for all selected parts
  const allQuestions = selectedParts
    .sort((a, b) => a - b)
    .flatMap(partNum => {
      const range = PART_QUESTION_RANGES[partNum];
      if (!range) return [];
      return Array.from({ length: range.count }, (_, i) => ({
        number: range.start + i,
        part: partNum
      }));
    });

  const totalQuestions = allQuestions.length;

  const handleStart = () => {
    navigate(`/exams/${id}/taking`, { state: { selectedParts, selectedTime, selectByPart, currentPart } });
  };

  const renderPartInstructions = () => {
    switch (currentPart) {
      case 1:
        return (
          <div className="intro-instruction-box intro-instruction-box--part1">
            <h2 className="intro-section-heading">LISTENING TEST</h2>
            <p className="intro-text">
              In the Listening test, you will be asked to demonstrate how well you understand spoken English. The entire Listening test will last approximately 45 minutes. There are four parts, and directions are given for each part. You must mark your answers on the separate answer sheet. Do not write your answers in your test book.
            </p>
            <h3 className="intro-part-heading">PART 1</h3>
            <p className="intro-text">
              Directions: For each question in this part, you will hear four statements about a picture in your test book. When you hear the statements, you must select the one statement that best describes what you see in the picture. Then find the number of the question on your answer sheet and mark your answer. The statements will not be printed in your test book and will be spoken only one time.
            </p>
            <div className="intro-sample-image">
              <img src={sampleImage} alt="Sample TOEIC Part 1" />
            </div>
            <p className="intro-text intro-text--italic">
              Statement (C), "They're sitting at a table." is the best description of the picture, so you should select answer (C) and mark it on your answer sheet.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="intro-instruction-box intro-instruction-box--part2">
            <h3 className="intro-part-heading-simple">PART 2:</h3>
            <p className="intro-text-simple">
              Direction: You will hear a question or statement and three responses spoken in English. They will not be printed in your test book and will be spoken only one time. Select the best response to the question or statement and mark the letter (A), (B) or (C) on your answer sheet.
            </p>
          </div>
        );
      case 3:
        return (
          <div className="intro-instruction-box intro-instruction-box--part2">
            <h3 className="intro-part-heading-simple">PART 3: LISTENING</h3>
            <br />
            <p className="intro-text-simple">
              Directions: You will hear some conversations between two or more people. You will be asked to answer three questions about what the speakers say in each conversation. Select the best response to each question and mark the letter (A), (B), (C), or (D) on your answer sheet. The conversations will not be printed in your test book and will be spoken only one time.
            </p>
          </div>
        );
      case 4:
        return (
          <div className="intro-instruction-box intro-instruction-box--part2">
            <h3 className="intro-part-heading-simple">PART 4</h3>
            <br />
            <p className="intro-text-simple">
              Directions: You will hear some talks given by a single speaker. You will be asked to answer three questions about what the speaker says in each talk. Select the best response to each question and mark the letter (A), (B), (C), or (D) on your answer sheet. The talks will not be printed in your test book and will be spoken only one time.
            </p>
          </div>
        );
      case 5:
        return (
          <div className="intro-instruction-box intro-instruction-box--part2">
            <h3 className="intro-part-heading-simple" style={{ fontWeight: 400 }}>READING TEST</h3>
            <p className="intro-text-simple">
              In the Reading test, you will read a variety of texts and answer several different types of reading comprehension questions. The entire Reading test will last 75 minutes. There are three parts, and directions are given for each part. You are encouraged to answer as many questions as possible within the time allowed.<br />
              You must mark your answers on the separate answer sheet. Do not write your answers in your test book.
            </p>
            <br />
            <br />
            <h3 className="intro-part-heading-simple" style={{ fontWeight: 400 }}>PART 5</h3>
            <p className="intro-text-simple">
              Directions: A word or phrase is missing in each of the sentences below. Four answer choices are given below each sentence. Select the best answer to complete the sentence. Then mark the letter (A), (B), (C), or (D) on your answer sheet.
            </p>
          </div>
        );
      case 6:
        return (
          <div className="intro-instruction-box intro-instruction-box--part2">
            <h3 className="intro-part-heading-simple" style={{ fontWeight: 400 }}>PART 6</h3>
            <p className="intro-text-simple">
              Directions: Read the texts that follow. A word, phrase, or sentence is missing in parts of each text.<br />
              Four answer choices for each question are given below the text. Select the best answer to complete the text. Then mark the letter (A), (B), (C), or (D) on your answer sheet.
            </p>
          </div>
        );
      case 7:
        return (
          <div className="intro-instruction-box intro-instruction-box--part2">
            <h3 className="intro-part-heading-simple" style={{ fontWeight: 400 }}>PART 7</h3>
            <p className="intro-text-simple">
              Directions: In this part you will read a selection of texts, such as magazine and newspaper articles, e-mails, and instant messages. Each text or set of texts is followed by several questions. Select the best answer for each question and mark the letter (A), (B), (C), or (D) on your answer sheet.
            </p>
          </div>
        );
      default:
        return (
          <div className="intro-instruction-box">
            <h3 className="intro-part-heading-simple">PART {currentPart}:</h3>
            <p className="intro-text-simple">
              Directions for Part {currentPart} will be displayed here.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="exam-intro-page">
      <ExamTopNavbar showTimerAndSubmit={false} />
      {/* Top bar */}
      <div className="intro-top-bar">
        <h1 className="intro-part-title">PART {currentPart}</h1>
        <div className="intro-score-badge">0/{totalQuestions > 0 ? totalQuestions : 200}</div>
      </div>

      {/* Content area */}
      <div className="intro-content-wrapper">
        {/* Left panel - instructions (scrollable) */}
        <div className="intro-left-panel">
          {renderPartInstructions()}
        </div>
      </div>

      {/* Bottom button */}
      <div className="intro-bottom-bar">
        <button className="btn-start" onClick={handleStart}>
          BẮT ĐẦU
        </button>
      </div>
    </div>
  );
};

export default ExamPartIntroPage;
