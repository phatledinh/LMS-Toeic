import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Kiểm tra nếu chưa đăng nhập hoặc không phải admin
  // (Lưu ý: Backend cần trả về thuộc tính role trong đối tượng user)
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;
