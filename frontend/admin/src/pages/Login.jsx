import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../services/api';
import '../index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginApi({ email, password });
      // response.data contains accessToken, fullName, role, etc.
      const { accessToken, fullName, role } = response.data;
      
      login(accessToken, { email, fullName, role });
      
      if (role === 'ADMIN') {
        navigate('/admin/courses');
      } else {
        setError('Tài khoản này không có quyền quản trị viên!');
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại!');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Đăng Nhập</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>
          <button type="submit" className="auth-button">Đăng Nhập</button>
        </form>
        <p className="auth-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
