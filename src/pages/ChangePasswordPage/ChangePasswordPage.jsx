import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '@/api/firebase';
import { updateDocument } from '@/api/firestore';
import { COLLECTIONS } from '@/constants';

export const ChangePasswordPage = () => {
  const [form, setForm] = useState({ current: '', newPw: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { user, userProfile, refreshProfile, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.current) errs.current = 'Vui lòng nhập mật khẩu hiện tại';
    if (!form.newPw) errs.newPw = 'Vui lòng nhập mật khẩu mới';
    else if (form.newPw.length < 6) errs.newPw = 'Mật khẩu mới tối thiểu 6 ký tự';
    else if (form.newPw === form.current) errs.newPw = 'Mật khẩu mới phải khác mật khẩu hiện tại';
    if (form.newPw !== form.confirm) errs.confirm = 'Mật khẩu xác nhận không khớp';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(currentUser.email, form.current);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, form.newPw);

      const uid = userProfile?.id || user?.uid;
      await updateDocument(COLLECTIONS.USERS, uid, { mustChangePassword: false });

      await refreshProfile();
      toast.success('Đổi mật khẩu thành công!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
        ? 'Mật khẩu hiện tại không đúng'
        : `Lỗi: ${err.message}`;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)', padding: 'var(--space-4)' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--color-primary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-h3)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>B</div>
          <h1 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Đổi mật khẩu</h1>
          <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
            Bạn cần đổi mật khẩu trước khi sử dụng hệ thống.
          </p>
        </div>

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              id="current-pw"
              label="Mật khẩu hiện tại"
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              value={form.current}
              onChange={(e) => setForm((p) => ({ ...p, current: e.target.value }))}
              error={errors.current}
              required
            />
            <Input
              id="new-pw"
              label="Mật khẩu mới"
              type="password"
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              value={form.newPw}
              onChange={(e) => setForm((p) => ({ ...p, newPw: e.target.value }))}
              error={errors.newPw}
              required
            />
            <Input
              id="confirm-pw"
              label="Xác nhận mật khẩu mới"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={form.confirm}
              onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
              error={errors.confirm}
              required
            />
            <Button type="submit" style={{ width: '100%' }} loading={loading}>
              Xác nhận đổi mật khẩu
            </Button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
          <button
            onClick={logout}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: 'var(--font-size-small)', textDecoration: 'underline' }}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};
