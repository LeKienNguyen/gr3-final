import { useState } from 'react';
import { PageTitle, Button, Input, Select, Card } from '@/components/common';
import { PageContainer } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

const SHIFT_OPTIONS = [
  { value: '3', label: '3 ca (Sáng / Chiều / Tối)' },
  { value: '2', label: '2 ca (Sáng / Chiều)' },
];

const LANG_OPTIONS = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
];

export const SettingsPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState({
    name: user?.displayName || 'Quản lý',
    email: user?.email || 'manager@guiguibbq.com',
    phone: '0901234567',
  });
  const [restaurant, setRestaurant] = useState({
    name: 'Guigui BBQ',
    address: '123 Nguyễn Huệ, Q.1, TP.HCM',
    shifts: '3',
    language: 'vi',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingRestaurant, setSavingRestaurant] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  const saveProfile = async () => {
    setSavingProfile(true);
    await new Promise((r) => setTimeout(r, 500));
    setSavingProfile(false);
    toast.success('Đã cập nhật hồ sơ');
  };

  const saveRestaurant = async () => {
    setSavingRestaurant(true);
    await new Promise((r) => setTimeout(r, 500));
    setSavingRestaurant(false);
    toast.success('Đã lưu cài đặt nhà hàng');
  };

  const changePassword = async () => {
    if (!passwordForm.current || !passwordForm.new) {
      toast.error('Vui lòng nhập đầy đủ');
      return;
    }
    if (passwordForm.new.length < 6) {
      toast.error('Mật khẩu mới tối thiểu 6 ký tự');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    setSavingPassword(true);
    await new Promise((r) => setTimeout(r, 500));
    setSavingPassword(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
    toast.success('Đã đổi mật khẩu');
  };

  return (
    <PageContainer>
      <PageTitle title="Cài đặt" subtitle="Quản lý tài khoản và tùy chỉnh hệ thống" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 640 }}>
        <Card title="Hồ sơ cá nhân" footer={<Button onClick={saveProfile} loading={savingProfile}>Lưu hồ sơ</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input id="s-name" label="Họ tên" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
            <Input id="s-email" label="Email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
            <Input id="s-phone" label="Số điện thoại" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
          </div>
        </Card>

        <Card title="Cài đặt nhà hàng" footer={<Button onClick={saveRestaurant} loading={savingRestaurant}>Lưu cài đặt</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input id="s-rname" label="Tên nhà hàng" value={restaurant.name} onChange={(e) => setRestaurant((p) => ({ ...p, name: e.target.value }))} />
            <Input id="s-address" label="Địa chỉ" value={restaurant.address} onChange={(e) => setRestaurant((p) => ({ ...p, address: e.target.value }))} />
            <Select id="s-shifts" label="Số ca làm" options={SHIFT_OPTIONS} value={restaurant.shifts} onChange={(e) => setRestaurant((p) => ({ ...p, shifts: e.target.value }))} />
            <Select id="s-lang" label="Ngôn ngữ" options={LANG_OPTIONS} value={restaurant.language} onChange={(e) => setRestaurant((p) => ({ ...p, language: e.target.value }))} />
          </div>
        </Card>

        <Card title="Đổi mật khẩu" footer={<Button onClick={changePassword} loading={savingPassword}>Đổi mật khẩu</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input id="s-curpw" label="Mật khẩu hiện tại" type="password" value={passwordForm.current} onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))} />
            <Input id="s-newpw" label="Mật khẩu mới" type="password" value={passwordForm.new} onChange={(e) => setPasswordForm((p) => ({ ...p, new: e.target.value }))} />
            <Input id="s-cfpw" label="Xác nhận mật khẩu mới" type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))} />
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
