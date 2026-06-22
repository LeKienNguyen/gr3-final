import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import './MainLayout.css';

export const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggle = useCallback(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  }, []);

  const handleCloseMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <div className={`main-layout${isCollapsed ? ' main-layout--collapsed' : ''}`}>
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={handleCloseMobile}
      />
      <div className="main-layout__content">
        <Navbar onToggleSidebar={handleToggle} />
        <main className="main-layout__main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};
