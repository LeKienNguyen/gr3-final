import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/common';

export const RegisterPage = () => (
  <div>
    <h2 className="login-page__title" style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', textAlign: 'center', marginBottom: 'var(--space-6)' }}>
      Tạo tài khoản
    </h2>
    <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Input id="name" label="Họ và tên" placeholder="Nhập họ và tên" required />
      <Input id="email" label="Email" type="email" placeholder="Nhập email của bạn" required />
      <Input id="password" label="Mật khẩu" type="password" placeholder="Tạo mật khẩu" required />
      <Input id="confirmPassword" label="Xác nhận mật khẩu" type="password" placeholder="Nhập lại mật khẩu" required />
      <Button type="submit" style={{ width: '100%' }}>Đăng ký</Button>
    </form>
    <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
      Đã có tài khoản?{' '}
      <Link to="/auth/login" style={{ color: 'var(--color-primary)' }}>Đăng nhập</Link>
    </p>
  </div>
);
