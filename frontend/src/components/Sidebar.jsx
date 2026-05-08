import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, Layers, Heart, ShoppingBag, Shield, Briefcase, Menu } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

const Sidebar = ({ isOpen, onToggle }) => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  
  return (
    <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`} style={{ border: 'none', borderRight: '1px solid var(--border)', borderRadius: 0 }}>
      
      <div className="sidebar-header" style={{ padding: 'var(--space-md) 20px', display: 'flex', alignItems: 'center', gap: 'var(--space-xl)', marginBottom: 'var(--space-sm)', borderLeft: '3px solid transparent' }}>
        <button className="btn-icon" onClick={onToggle} style={{ margin: 0, padding: 0, width: '20px', display: 'flex', justifyContent: 'center' }}>
          <Menu size={20} color="var(--text-main)" />
        </button>
        <Link to="/" className="nav-brand sidebar-brand" style={{ margin: 0 }}>
          Aura Luxury
        </Link>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <NavLink to="/" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>{t('sidebar.home')}</span>
        </NavLink>
        <NavLink to="/categories" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Layers size={20} />
          <span>{t('sidebar.categories')}</span>
        </NavLink>
        <NavLink to="/suppliers" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Briefcase size={20} />
          <span>{t('sidebar.suppliers')}</span>
        </NavLink>
        <NavLink to="/wishlist" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Heart size={20} />
          <span>{t('sidebar.wishlist')}</span>
        </NavLink>
        <NavLink to="/orders" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <ShoppingBag size={20} />
          <span>{t('sidebar.orders')}</span>
        </NavLink>
        
        {isAdmin && (
          <NavLink to="/admin" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ marginTop: 'var(--space-lg)' }}>
            <Shield size={20} color="var(--primary)" />
            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{isSuperAdmin ? t('sidebar.superAdmin') : t('sidebar.admin')}</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
