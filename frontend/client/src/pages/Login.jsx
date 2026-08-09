import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../index.css';

const AUTH_API_URL = 'http://localhost:8080/api/v1/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const googleButtonRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const completeLogin = (accessToken, userEmail, fullName, role) => {
    login(accessToken, { email: userEmail, fullName, role });
    navigate(role === 'ADMIN' ? '/admin/courses' : '/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${AUTH_API_URL}/login`, {
        email,
        password,
      });

      const { accessToken, fullName, role } = response.data.data;
      completeLogin(accessToken, email, fullName, role);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!');
    }
  };

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) {
      return;
    }

    const handleGoogleCredential = async (response) => {
      setError('');

      try {
        const result = await axios.post(`${AUTH_API_URL}/google`, {
          credential: response.credential,
        });

        const { accessToken, fullName, role } = result.data.data;
        const googleEmail = parseJwtPayload(response.credential)?.email || '';
        completeLogin(accessToken, googleEmail, fullName, role);
      } catch (err) {
        setError(err.response?.data?.message || 'Đăng nhập Google thất bại. Vui lòng thử lại!');
      }
    };

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredential,
      });

      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'signin_with',
        shape: 'rectangular',
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return;
    }

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', renderGoogleButton, { once: true });
      return () => existingScript.removeEventListener('load', renderGoogleButton);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [googleClientId]);

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

        <div className="auth-divider"><span>hoặc</span></div>
        {googleClientId ? (
          <div className="google-login-button" ref={googleButtonRef} />
        ) : (
          <button type="button" className="google-login-fallback" disabled>
            Chưa cấu hình Google login
          </button>
        )}

        <p className="auth-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

const parseJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

export default Login;
