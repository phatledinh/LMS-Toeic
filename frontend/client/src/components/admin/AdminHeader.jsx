import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <Link to="/admin/courses" className="header-logo" style={{ textDecoration: 'none' }}>STUDY4 ADMIN</Link>
      <nav className="header-nav" style={{ justifyContent: 'flex-end', flex: 1 }}>
        <a href="/" target="_blank" rel="noreferrer">Trang Học Viên</a>
        
        {user && (
          <div className="header-user">
            <div className="avatar-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.fullName} (Admin)</span>
            <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default AdminHeader;
