import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <Link to="/" className="header-logo" style={{ textDecoration: 'none' }}>STUDY4</Link>
      <nav className="header-nav">
        <a href="#">Đề thi online</a>
        <a href="#">Flashcards</a>

        {user ? (
          <div className="header-user">
            <div className="avatar-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.fullName}</span>
            <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
          </div>
        ) : (
          <div className="header-user">
            <Link to="/login" style={{ textDecoration: 'none', color: '#1a73e8', fontWeight: 600 }}>Đăng nhập</Link>
            <span style={{ color: '#ccc' }}>|</span>
            <Link to="/register" style={{ textDecoration: 'none', color: '#5f6368', fontWeight: 600 }}>Đăng ký</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
