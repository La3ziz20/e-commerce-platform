import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Cart from './Cart';
import Sidebar from './Sidebar';
import Footer from './Footer';

const MainLayout = ({ searchQuery, setSearchQuery }) => {
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('theme') !== 'dark'; // true by default for white background
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);

  const isHome = location.pathname === '/';

  return (
    <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', width: '100%' }}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(prev => !prev)} />
      
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
        <Navbar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onMenuClick={() => setIsSidebarOpen(prev => !prev)}
          isLightMode={isLightMode}
          setIsLightMode={setIsLightMode}
        />
        <Cart />
        
        <main className="main-content" style={{ 
          padding: isHome ? '0' : 'var(--space-xl)',
          maxWidth: '100%',
          width: '100%',
          flexGrow: 1
        }}>
          <Outlet context={{ searchQuery }} />
        </main>

        {isHome && <Footer />}
      </div>
    </div>
  );
};

export default MainLayout;
