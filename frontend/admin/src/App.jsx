import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLessonPage from './pages/AdminLessonPage';
import AdminCourseManagePage from './pages/admin/AdminCourseManagePage';
import AdminQuestionManagePage from './pages/admin/AdminQuestionManagePage';
import AdminExerciseManagePage from './pages/admin/AdminExerciseManagePage';
import AdminOnlineTestManagePage from './pages/admin/AdminOnlineTestManagePage';
import AdminFlashcardManagePage from './pages/admin/AdminFlashcardManagePage';
import AdminFlashcardDetailPage from './pages/admin/AdminFlashcardDetailPage';
import AdminAccountManagePage from './pages/admin/AdminAccountManagePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLayout from './components/admin/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';
import './index.css';
import './flashcard.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* ===== Admin Routes ===== */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          {/* Default admin page */}
          <Route index element={<Navigate to="/admin/courses" replace />} />
          <Route path="courses" element={<AdminCourseManagePage />} />
          <Route path="exercises/:exerciseId/questions" element={<AdminQuestionManagePage />} />
          <Route path="lessons" element={<AdminLessonPage />} />
          <Route path="exercises" element={<AdminExerciseManagePage />} />
          <Route path="online-tests" element={<AdminOnlineTestManagePage />} />
          <Route path="flashcards" element={<AdminFlashcardManagePage />} />
          <Route path="flashcards/:deckId" element={<AdminFlashcardDetailPage />} />
          <Route path="accounts" element={<AdminAccountManagePage />} />
          {/* Future admin pages will be nested here */}
        </Route>
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
