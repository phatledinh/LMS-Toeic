import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Login from './pages/Login';
import Register from './pages/Register';
import SectionPage from './pages/SectionPage';
import QuizPage from './pages/QuizPage';
import LessonPage from './pages/LessonPage';
import FlashcardListPage from './pages/FlashcardListPage';
import FlashcardPreviewPage from './pages/FlashcardPreviewPage';
import FlashcardStudyPage from './pages/FlashcardStudyPage';
import FlashcardQuizPage from './pages/FlashcardQuizPage';
import FlashcardMatchPage from './pages/FlashcardMatchPage';
import FlashcardFillPage from './pages/FlashcardFillPage';
import FlashcardDictationPage from './pages/FlashcardDictationPage';
import FlashcardListenPage from './pages/FlashcardListenPage';

import DictationPage from './pages/DictationPage';
import ExamListPage from './pages/ExamListPage';
import ExamDetailPage from './pages/ExamDetailPage';
import ExamPartIntroPage from './pages/ExamPartIntroPage';
import ExamTakingPage from './pages/ExamTakingPage';
import ExamReviewPage from './pages/ExamReviewPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';
import './flashcard.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  const location = useLocation();
  const hideHeader = location.pathname.includes('/take') || location.pathname.includes('/taking') || location.pathname.includes('/review');

  return (
    <div className="app-container">
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Trang chủ */}
        <Route path="/" element={
          <PrivateRoute>
            <div className="main-layout">
              <Sidebar />
              <MainContent />
            </div>
          </PrivateRoute>
        } />

        {/* Trang Section – danh sách topics */}
        <Route path="/sections/:slug" element={
          <PrivateRoute>
            <div className="main-layout">
              <Sidebar />
              <SectionPage />
            </div>
          </PrivateRoute>
        } />

        {/* Trang làm bài trắc nghiệm */}
        <Route path="/exercises/:slug" element={
          <PrivateRoute>
            <QuizPage />
          </PrivateRoute>
        } />

        {/* Trang nghe chép chính tả */}
        <Route path="/exercises/:slug/dictation" element={
          <PrivateRoute>
            <DictationPage />
          </PrivateRoute>
        } />

        {/* Trang xem video + tài liệu */}
        <Route path="/lessons/:id" element={
          <PrivateRoute>
            <LessonPage />
          </PrivateRoute>
        } />

        {/* ===== Exam Routes ===== */}
        <Route path="/exams" element={
          <PrivateRoute>
            <div className="main-layout">
              <Sidebar />
              <ExamListPage />
            </div>
          </PrivateRoute>
        } />

        <Route path="/exams/:id" element={
          <PrivateRoute>
            <ExamDetailPage />
          </PrivateRoute>
        } />

        <Route path="/exams/:id/take" element={
          <PrivateRoute>
            <ExamPartIntroPage />
          </PrivateRoute>
        } />

        <Route path="/exams/:id/taking" element={
          <PrivateRoute>
            <ExamTakingPage />
          </PrivateRoute>
        } />

        <Route path="/exams/:id/review" element={
          <PrivateRoute>
            <ExamReviewPage />
          </PrivateRoute>
        } />
        {/* ===== Flashcard Routes ===== */}
        <Route path="/flashcards" element={
          <PrivateRoute>
            <div className="main-layout">
              <Sidebar />
              <FlashcardListPage />
            </div>
          </PrivateRoute>
        } />

        <Route path="/flashcards/:listId/preview" element={
          <PrivateRoute>
            <FlashcardPreviewPage />
          </PrivateRoute>
        } />

        <Route path="/flashcards/:listId/study" element={
          <PrivateRoute>
            <FlashcardStudyPage />
          </PrivateRoute>
        } />

        <Route path="/flashcards/:listId/quiz" element={
          <PrivateRoute>
            <FlashcardQuizPage />
          </PrivateRoute>
        } />

        <Route path="/flashcards/:listId/match" element={
          <PrivateRoute>
            <FlashcardMatchPage />
          </PrivateRoute>
        } />

        <Route path="/flashcards/:listId/fill" element={
          <PrivateRoute>
            <FlashcardFillPage />
          </PrivateRoute>
        } />

        <Route path="/flashcards/:listId/dictation" element={
          <PrivateRoute>
            <FlashcardDictationPage />
          </PrivateRoute>
        } />

        <Route path="/flashcards/:listId/listen" element={
          <PrivateRoute>
            <FlashcardListenPage />
          </PrivateRoute>
        } />

      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
