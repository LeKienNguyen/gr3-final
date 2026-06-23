import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ và tên';
    if (!form.email.trim()) errs.email = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email không hợp lệ';
    if (!form.password) errs.password = 'Vui lòng nhập mật khẩu';
    else if (form.password.length < 6) errs.password = 'Mật khẩu tối thiểu 6 ký tự';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu không khớp';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.email, form.password);
      toast.success('Đăng ký thành công!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'Email đã được sử dụng'
        : `Đăng ký thất bại: ${err.message}`;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        Tạo tài khoản
      </h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }} onSubmit={handleSubmit}>
        <Input id="name" label="Họ và tên" placeholder="Nhập họ và tên" required value={form.name} onChange={set('name')} error={errors.name} />
        <Input id="email" label="Email" type="email" placeholder="Nhập email của bạn" required value={form.email} onChange={set('email')} error={errors.email} />
        <Input id="password" label="Mật khẩu" type="password" placeholder="Tạo mật khẩu" required value={form.password} onChange={set('password')} error={errors.password} />
        <Input id="confirmPassword" label="Xác nhận mật khẩu" type="password" placeholder="Nhập lại mật khẩu" required value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
        <Button type="submit" style={{ width: '100%' }} loading={loading}>Đăng ký</Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
        Đã có tài khoản?{' '}
        <Link to="/auth/login" style={{ color: 'var(--color-primary)' }}>Đăng nhập</Link>
      </p>
    </div>
  );
};
