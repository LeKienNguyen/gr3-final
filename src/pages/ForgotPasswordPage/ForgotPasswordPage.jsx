import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/common';

export const ForgotPasswordPage = () => (
  <div>
    <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', textAlign: 'center', marginBottom: 'var(--space-2)' }}>
      Quên mật khẩu
    </h2>
    <p style={{ textAlign: 'center', fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
      Nhập email để nhận liên kết đặt lại mật khẩu.
    </p>
    <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Input id="email" label="Email" type="email" placeholder="Nhập email của bạn" required />
      <Button type="submit" style={{ width: '100%' }}>Gửi liên kết</Button>
    </form>
    <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
      Nhớ mật khẩu?{' '}
      <Link to="/auth/login" style={{ color: 'var(--color-primary)' }}>Đăng nhập</Link>
    </p>
  </div>
);
