import { useState, useEffect, useCallback } from 'react';
import { PageTitle, Button, Input, Select, Card, Loading } from '@/components/common';
import { PageContainer } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { settingsService } from '@/services/settings.service';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '@/api/firebase';

const SHIFT_OPTIONS = [
  { value: '3', label: '3 ca (Sáng / Chiều / Tối)' },
  { value: '2', label: '2 ca (Sáng / Chiều)' },
];

const LANG_OPTIONS = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
];

export const SettingsPage = () => {
  const { user, userProfile, refreshProfile, isManager } = useAuth();
  const toast = useToast();
  const [loadingData, setLoadingData] = useState(true);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [restaurant, setRestaurant] = useState({
    name: 'Guigui BBQ',
    address: '',
    shifts: '3',
    language: 'vi',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingRestaurant, setSavingRestaurant] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      if (userProfile) {
        setProfile({
          name: userProfile.name || user?.displayName || '',
          email: userProfile.email || user?.email || '',
          phone: userProfile.phone || '',
        });
      } else {
        setProfile({
          name: user?.displayName || '',
          email: user?.email || '',
          phone: '',
        });
      }

      try {
        const restDoc = await settingsService.getRestaurant();
        if (restDoc.exists()) {
          const data = restDoc.data();
          setRestaurant({
            name: data.name || 'Guigui BBQ',
            address: data.address || '',
            shifts: data.shifts || '3',
            language: data.language || 'vi',
          });
        }
      } catch {
        // Restaurant settings don't exist yet, use defaults
      }
    } catch {
      toast.error('Không thể tải cài đặt');
    } finally {
      setLoadingData(false);
    }
  }, [userProfile, user, toast]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const uid = userProfile?.id || user?.uid;
      await settingsService.updateUserProfile(uid, {
        name: profile.name,
        phone: profile.phone,
      });
      await refreshProfile();
      toast.success('Đã cập nhật hồ sơ');
    } catch (err) {
      toast.error('Lỗi cập nhật hồ sơ: ' + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const saveRestaurant = async () => {
    setSavingRestaurant(true);
    try {
      await settingsService.saveRestaurant(restaurant);
      toast.success('Đã lưu cài đặt nhà hàng');
    } catch (err) {
      toast.error('Lỗi lưu cài đặt: ' + err.message);
    } finally {
      setSavingRestaurant(false);
    }
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
    try {
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(currentUser.email, passwordForm.current);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwordForm.new);
      setPasswordForm({ current: '', new: '', confirm: '' });
      toast.success('Đã đổi mật khẩu');
    } catch (err) {
      const msg = err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
        ? 'Mật khẩu hiện tại không đúng'
        : 'Lỗi đổi mật khẩu: ' + err.message;
      toast.error(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  if (loadingData) return <PageContainer><Loading text="Đang tải cài đặt..." /></PageContainer>;

  return (
    <PageContainer>
      <PageTitle title="Cài đặt" subtitle="Quản lý tài khoản và tùy chỉnh hệ thống" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 640 }}>
        <Card title="Hồ sơ cá nhân" footer={<Button onClick={saveProfile} loading={savingProfile}>Lưu hồ sơ</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input id="s-name" label="Họ tên" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
            <Input id="s-email" label="Email" type="email" value={profile.email} disabled />
            <Input id="s-phone" label="Số điện thoại" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
          </div>
        </Card>

        {isManager && (
          <Card title="Cài đặt nhà hàng" footer={<Button onClick={saveRestaurant} loading={savingRestaurant}>Lưu cài đặt</Button>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Input id="s-rname" label="Tên nhà hàng" value={restaurant.name} onChange={(e) => setRestaurant((p) => ({ ...p, name: e.target.value }))} />
              <Input id="s-address" label="Địa chỉ" value={restaurant.address} onChange={(e) => setRestaurant((p) => ({ ...p, address: e.target.value }))} />
              <Select id="s-shifts" label="Số ca làm" options={SHIFT_OPTIONS} value={restaurant.shifts} onChange={(e) => setRestaurant((p) => ({ ...p, shifts: e.target.value }))} />
              <Select id="s-lang" label="Ngôn ngữ" options={LANG_OPTIONS} value={restaurant.language} onChange={(e) => setRestaurant((p) => ({ ...p, language: e.target.value }))} />
            </div>
          </Card>
        )}

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
