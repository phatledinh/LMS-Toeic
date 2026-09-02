import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../services/api';
import '../index.css';

const Login = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Đăng nhập thất bại');
    }

    const authData = data.data;
    const userData = authData.user || authData;
    const role = userData.role || userData.roles?.[0];

    if (role !== 'ADMIN') {
      throw new Error('Tài khoản này không có quyền admin');
    }

    login(authData.accessToken || authData.token, userData);
    navigate('/admin/courses');
  } catch (err) {
    setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại!');
  }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Đăng nhập Admin</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email admin"
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
          <button type="submit" className="auth-button">Đăng nhập</button>
        </form>
        <p className="auth-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
