import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { forgotPassword } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Vui lòng nhập email'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Email không hợp lệ'); return; }
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Đã gửi email đặt lại mật khẩu!');
    } catch (err) {
      toast.error(`Gửi thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-4)' }}>
          Kiểm tra email
        </h2>
        <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
          Chúng tôi đã gửi liên kết đặt lại mật khẩu đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư.
        </p>
        <Link to="/auth/login">
          <Button style={{ width: '100%' }}>Quay lại đăng nhập</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', textAlign: 'center', marginBottom: 'var(--space-2)' }}>
        Quên mật khẩu
      </h2>
      <p style={{ textAlign: 'center', fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
        Nhập email để nhận liên kết đặt lại mật khẩu.
      </p>
      <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }} onSubmit={handleSubmit}>
        <Input id="email" label="Email" type="email" placeholder="Nhập email của bạn" required value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        <Button type="submit" style={{ width: '100%' }} loading={loading}>Gửi liên kết</Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
        Nhớ mật khẩu?{' '}
        <Link to="/auth/login" style={{ color: 'var(--color-primary)' }}>Đăng nhập</Link>
      </p>
    </div>
  );
};
