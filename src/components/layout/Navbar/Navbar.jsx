import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import './Navbar.css';

const MenuIcon = () => (
  <svg className="navbar__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const formatDate = () => {
  const now = new Date();
  const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
  return now.toLocaleDateString('vi-VN', options);
};

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Nguyễn Văn A đã check-in ca sáng', time: '5 phút trước', read: false },
  { id: 2, text: 'Checklist vệ sinh buổi sáng đã hoàn thành', time: '15 phút trước', read: false },
  { id: 3, text: 'Trần Thị B đăng ký ca chiều thứ 7', time: '1 giờ trước', read: false },
  { id: 4, text: 'Kho nguyên liệu: Thịt bò sắp hết', time: '2 giờ trước', read: true },
  { id: 5, text: 'Phạm Thị D đã check-out ca sáng', time: '3 giờ trước', read: true },
];

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
};

export const Navbar = ({ onToggleSidebar, onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const closeNotif = useCallback(() => setShowNotifications(false), []);
  const closeUser = useCallback(() => setShowUserMenu(false), []);
  useClickOutside(notifRef, closeNotif);
  useClickOutside(userRef, closeUser);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch?.(val);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.info('Đã đánh dấu tất cả đã đọc');
  };

  const markRead = (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    try {
      await logout();
      toast.success('Đã đăng xuất');
      navigate('/auth/login');
    } catch {
      toast.error('Đăng xuất thất bại');
    }
  };

  const userEmail = user?.email || '';
  const displayName = user?.displayName || userEmail.split('@')[0] || 'Quản lý';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__toggle" onClick={onToggleSidebar} aria-label="Mở/đóng menu">
          <MenuIcon />
        </button>
      </div>

      <div className="navbar__center">
        <div className="navbar__search">
          <SearchIcon />
          <input
            type="text"
            className="navbar__search-input"
            placeholder="Tìm kiếm nhân viên, ca làm..."
            aria-label="Tìm kiếm"
            value={searchValue}
            onChange={handleSearch}
          />
          {searchValue && (
            <button className="navbar__search-clear" onClick={() => { setSearchValue(''); onSearch?.(''); }} aria-label="Xóa">
              ×
            </button>
          )}
        </div>
      </div>

      <div className="navbar__right">
        <span className="navbar__date">{formatDate()}</span>

        <div className="navbar__notif-wrapper" ref={notifRef}>
          <button
            className="navbar__icon-button"
            aria-label="Thông báo"
            onClick={() => { setShowNotifications((p) => !p); setShowUserMenu(false); }}
          >
            <BellIcon />
            {unreadCount > 0 && <span className="navbar__badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="navbar__dropdown navbar__dropdown--notif">
              <div className="navbar__dropdown-header">
                <span className="navbar__dropdown-title">Thông báo</span>
                {unreadCount > 0 && (
                  <button className="navbar__dropdown-action" onClick={markAllRead}>Đánh dấu tất cả đã đọc</button>
                )}
              </div>
              <div className="navbar__dropdown-list">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`navbar__notif-item${n.read ? '' : ' navbar__notif-item--unread'}`}
                    onClick={() => markRead(n.id)}
                  >
                    <p className="navbar__notif-text">{n.text}</p>
                    <span className="navbar__notif-time">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="navbar__divider" />

        <div className="navbar__user-wrapper" ref={userRef}>
          <div
            className="navbar__user"
            tabIndex={0}
            role="button"
            aria-label="Tài khoản"
            onClick={() => { setShowUserMenu((p) => !p); setShowNotifications(false); }}
            onKeyDown={(e) => e.key === 'Enter' && setShowUserMenu((p) => !p)}
          >
            <div className="navbar__avatar">{initials}</div>
            <div className="navbar__user-info">
              <span className="navbar__user-name">{displayName}</span>
              <span className="navbar__user-role">Manager</span>
            </div>
          </div>

          {showUserMenu && (
            <div className="navbar__dropdown navbar__dropdown--user">
              <button className="navbar__dropdown-item" onClick={() => { setShowUserMenu(false); navigate('/settings'); }}>
                <span>👤</span> Hồ sơ cá nhân
              </button>
              <button className="navbar__dropdown-item" onClick={() => { setShowUserMenu(false); navigate('/settings'); }}>
                <span>⚙️</span> Cài đặt
              </button>
              <div className="navbar__dropdown-divider" />
              <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                <span>🚪</span> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
