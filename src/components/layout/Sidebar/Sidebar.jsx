import { NavLink } from 'react-router-dom';
import { SIDEBAR_LINKS, SIDEBAR_LOGOUT } from '@/constants/navigation';
import './Sidebar.css';

export const Sidebar = ({ isCollapsed, isMobileOpen, onCloseMobile }) => (
  <>
    {isMobileOpen && (
      <div className="sidebar__overlay" onClick={onCloseMobile} />
    )}
    <aside
      className={[
        'sidebar',
        isCollapsed && 'sidebar--collapsed',
        isMobileOpen && 'sidebar--open',
      ].filter(Boolean).join(' ')}
    >
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">G</div>
          <div className="sidebar__logo-info">
            <span className="sidebar__logo-text">Guigui BBQ</span>
            <span className="sidebar__logo-subtitle">Quản lý nhân sự</span>
          </div>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Menu chính">
        <ul className="sidebar__nav-list">
          {SIDEBAR_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                }
                onClick={onCloseMobile}
                title={link.label}
              >
                <link.icon className="sidebar__link-icon" />
                <span className="sidebar__link-text">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__link sidebar__logout" title={SIDEBAR_LOGOUT.label}>
          <SIDEBAR_LOGOUT.icon className="sidebar__link-icon" />
          <span className="sidebar__link-text">{SIDEBAR_LOGOUT.label}</span>
        </button>
      </div>
    </aside>
  </>
);
