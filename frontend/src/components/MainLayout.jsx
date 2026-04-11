import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Cart from './Cart';

const MainLayout = ({ searchQuery, setSearchQuery }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);

  return (
    <div className="app-wrapper">
      <Navbar 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLightMode={isLightMode}
        toggleTheme={() => setIsLightMode(!isLightMode)}
      />
      <Cart />
      
      <div className="layout-container">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <main className="main-content">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
