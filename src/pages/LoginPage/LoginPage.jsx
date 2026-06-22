import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/common';
import './LoginPage.css';

export const LoginPage = () => (
  <div>
    <h2 className="login-page__title">Đăng nhập</h2>
    <form className="login-page__form">
      <Input id="email" label="Email" type="email" placeholder="Nhập email của bạn" required />
      <Input id="password" label="Mật khẩu" type="password" placeholder="Nhập mật khẩu" required />
      <Button type="submit" className="button--lg" style={{ width: '100%' }}>
        Đăng nhập
      </Button>
    </form>
    <div className="login-page__links">
      <Link to="/auth/forgot-password" className="login-page__link">
        Quên mật khẩu?
      </Link>
      <span style={{ color: 'var(--color-text-secondary)' }}>
        Chưa có tài khoản?{' '}
        <Link to="/auth/register" className="login-page__link">Đăng ký</Link>
      </span>
    </div>
  </div>
);
