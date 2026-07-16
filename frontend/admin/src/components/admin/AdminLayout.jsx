import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="app-container">
      <AdminHeader />
      <div className="main-layout">
        <AdminSidebar />
        <main className="main-content" style={{ width: '100%', overflowY: 'auto', padding: '2rem', backgroundColor: '#f8f9fa' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
