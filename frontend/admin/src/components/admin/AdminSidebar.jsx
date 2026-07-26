import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ borderBottom: '1px solid #eee' }}>
        <span>BẢNG ĐIỀU KHIỂN</span>
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-header" style={{ padding: '1rem 1rem 0.5rem', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>
          Quản trị
        </li>
        <li className={location.pathname.startsWith('/admin/courses') ? 'active' : ''}>
          <Link to="/admin/courses">Quản lý khóa học</Link>
        </li>
        <li className={location.pathname.startsWith('/admin/lessons') ? 'active' : ''}>
          <Link to="/admin/lessons">Quản lý bài học</Link>
        </li>
        <li className={location.pathname.startsWith('/admin/exercises') ? 'active' : ''}>
          <Link to="/admin/exercises">Quản lý bài tập</Link>
        </li>
        <li className={location.pathname.startsWith('/admin/flashcards') ? 'active' : ''}>
          <Link to="/admin/flashcards">Quản lý từ vựng</Link>
        </li>
        <li className={location.pathname.startsWith('/admin/accounts') ? 'active' : ''}>
          <Link to="/admin/accounts">Quản lý tài khoản</Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
