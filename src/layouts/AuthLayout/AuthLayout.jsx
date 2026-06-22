import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

export const AuthLayout = () => (
  <div className="auth-layout">
    <div className="auth-layout__card">
      <div className="auth-layout__header">
        <div className="auth-layout__logo">
          <div className="auth-layout__logo-icon">B</div>
          <span className="auth-layout__logo-text">BBQ Manager</span>
        </div>
        <p className="auth-layout__subtitle">Hệ thống quản lý nhà hàng</p>
      </div>
      <div className="auth-layout__body">
        <Outlet />
      </div>
    </div>
  </div>
);
