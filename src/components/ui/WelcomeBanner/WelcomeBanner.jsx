import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/constants/roles';
import './WelcomeBanner.css';

export const WelcomeBanner = () => {
  const { userProfile, user, isManager } = useAuth();
  const name = userProfile?.name || user?.displayName || 'bạn';
  const roleName = ROLE_LABELS[userProfile?.role] || '';

  return (
    <div className="welcome-banner">
      <p className="welcome-banner__greeting">
        Xin chào {name}!{roleName ? ` — ${roleName}` : ''}
      </p>
      <h2 className="welcome-banner__title">
        {isManager
          ? 'Chào mừng bạn đến với hệ thống quản lý nhân sự Guigui BBQ.'
          : 'Chào mừng bạn đến với hệ thống nhân sự Guigui BBQ.'
        }
      </h2>
      <p className="welcome-banner__description">
        {isManager
          ? 'Theo dõi nhân viên, chấm công, lịch ca làm và vệ sinh ngay từ bảng điều khiển này.'
          : 'Chấm công, xem lịch ca làm và checklist vệ sinh ngay từ đây.'
        }
      </p>
    </div>
  );
};
