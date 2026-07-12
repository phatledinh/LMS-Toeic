import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MainContent from './features/dashboard/components/MainContent';
import SectionPage from './features/course/components/SectionPage';
import Login from './features/auth/components/Login';
import Register from './features/auth/components/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// A simple layout wrapper for authenticated/dashboard pages
const DashboardLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Header />
    <div className="flex flex-1 pt-16"> {/* Add padding top for sticky header */}
      <Sidebar />
      <div className="flex-1 ml-64 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  </div>
);

// A simple layout for auth pages without sidebar
const AuthLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <Header />
    <div className="flex-1 flex items-center justify-center p-6">
      {children}
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
          <Route path="/" element={<ProtectedRoute><DashboardLayout><MainContent /></DashboardLayout></ProtectedRoute>} />
          <Route path="/sections/:slug" element={<ProtectedRoute><DashboardLayout><SectionPage /></DashboardLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
