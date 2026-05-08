import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, Sun, Moon } from 'lucide-react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

const Navbar = ({ onMenuClick, searchQuery, setSearchQuery, isLightMode, setIsLightMode }) => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth() || {}; 
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <nav className="navbar" style={{ 
      background: (isHome && !scrolled) ? 'transparent' : (isLightMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(18, 15, 14, 0.85)'),
      backdropFilter: (isHome && !scrolled) ? 'none' : 'blur(24px)',
      WebkitBackdropFilter: (isHome && !scrolled) ? 'none' : 'blur(24px)',
      borderBottom: (isHome && !scrolled) ? 'none' : '1px solid var(--border)',
      transition: 'all 0.4s ease'
    }}>
      <div className="nav-left" style={{ display: 'flex', alignItems: 'center', minWidth: '40px' }}>
      </div>

      <div className="nav-search">
        <div className="input-group">
          <Search size={18} className="input-icon" />
          <input 
            type="text" 
            id="global-search"
            className="glass-input" 
            placeholder={t('nav.search')} 
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="nav-right" style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'center' }}>
        
        <button className="btn-icon" onClick={toggleLanguage} style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', padding: '4px 8px' }}>
          {language === 'en' ? 'EN' : 'FR'}
        </button>

        <button className="btn-icon" onClick={() => setIsLightMode(!isLightMode)}>
          {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsCartOpen(prev => !prev)}>
          {t('nav.cart')} {cartCount > 0 && `(${cartCount})`}
        </button>
        
        {user ? (
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <Link to="/profile" className="nav-link">
              {t('nav.account')}
            </Link>
            <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => { logout(); navigate('/login'); }}>
              {t('nav.logout')}
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav-link">{t('nav.login')}</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
