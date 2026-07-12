import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CourseManagement from './features/course/components/CourseManagement';
import './App.css';

// A simple layout for admin dashboard
const AdminLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <header className="bg-blue-800 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
      <h1 className="text-xl font-bold">LMS Admin Dashboard</h1>
      <div>
        <span className="mr-4">Admin User</span>
        <button className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded">Logout</button>
      </div>
    </header>
    <div className="flex flex-1">
      <aside className="w-64 bg-white border-r shadow-sm hidden md:block">
        <nav className="p-4 space-y-2">
          <a href="/courses" className="block px-4 py-2 rounded bg-blue-50 text-blue-700 font-medium">Courses</a>
          <a href="#" className="block px-4 py-2 rounded text-gray-600 hover:bg-gray-50">Users</a>
          <a href="#" className="block px-4 py-2 rounded text-gray-600 hover:bg-gray-50">Settings</a>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/courses" replace />} />
        <Route path="/courses" element={<AdminLayout><CourseManagement /></AdminLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
