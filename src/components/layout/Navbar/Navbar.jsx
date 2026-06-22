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

export const Navbar = ({ onToggleSidebar, pageTitle = '' }) => (
  <header className="navbar">
    <div className="navbar__left">
      <button
        className="navbar__toggle"
        onClick={onToggleSidebar}
        aria-label="Mở/đóng menu"
      >
        <MenuIcon />
      </button>
      {pageTitle && <h1 className="navbar__title">{pageTitle}</h1>}
    </div>

    <div className="navbar__center">
      <div className="navbar__search">
        <SearchIcon />
        <input
          type="text"
          className="navbar__search-input"
          placeholder="Tìm kiếm nhân viên, ca làm..."
          aria-label="Tìm kiếm"
        />
      </div>
    </div>

    <div className="navbar__right">
      <span className="navbar__date">{formatDate()}</span>

      <button className="navbar__icon-button" aria-label="Thông báo">
        <BellIcon />
        <span className="navbar__badge">3</span>
      </button>

      <div className="navbar__divider" />

      <div className="navbar__user" tabIndex={0} role="button" aria-label="Tài khoản">
        <div className="navbar__avatar">QM</div>
        <div className="navbar__user-info">
          <span className="navbar__user-name">Quản lý</span>
          <span className="navbar__user-role">Manager</span>
        </div>
      </div>
    </div>
  </header>
);
