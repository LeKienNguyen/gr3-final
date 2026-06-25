import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import './LoginPage.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email không hợp lệ';
    if (!password) errs.password = 'Vui lòng nhập mật khẩu';
    else if (password.length < 6) errs.password = 'Mật khẩu tối thiểu 6 ký tự';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { profile } = await login(email, password);
      toast.success('Đăng nhập thành công!');
      if (profile?.mustChangePassword) {
        navigate('/change-password');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential'
        ? 'Email hoặc mật khẩu không đúng'
        : err.code === 'auth/user-not-found'
          ? 'Tài khoản không tồn tại'
          : err.code === 'auth/too-many-requests'
            ? 'Quá nhiều lần thử. Vui lòng thử lại sau'
            : `Đăng nhập thất bại: ${err.message}`;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="login-page__title">Đăng nhập</h2>
      <form className="login-page__form" onSubmit={handleSubmit}>
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="Nhập email của bạn"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          id="password"
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button type="submit" className="button--lg" style={{ width: '100%' }} loading={loading}>
          Đăng nhập
        </Button>
      </form>
      <div className="login-page__links">
        <Link to="/auth/forgot-password" className="login-page__link">
          Quên mật khẩu?
        </Link>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
          Liên hệ Quản lý để được cấp tài khoản
        </span>
      </div>
    </div>
  );
};
