import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Layers, Heart, ShoppingBag, Shield, Briefcase } from 'lucide-react';
import { useAuth } from './AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin, isSuperAdmin } = useAuth();
  
  return (
    <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`} style={{ border: 'none', borderRight: '1px solid var(--border)', borderRadius: 0 }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <NavLink to="/" onClick={onClose} className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/categories" onClick={onClose} className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Layers size={20} />
          <span>Categories</span>
        </NavLink>
        <NavLink to="/suppliers" onClick={onClose} className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Briefcase size={20} />
          <span>Suppliers</span>
        </NavLink>
        <NavLink to="/wishlist" onClick={onClose} className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Heart size={20} />
          <span>Wishlist</span>
        </NavLink>
        <NavLink to="/orders" onClick={onClose} className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <ShoppingBag size={20} />
          <span>Orders</span>
        </NavLink>
        
        {isAdmin && (
          <NavLink to="/admin" onClick={onClose} className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ marginTop: 'var(--space-lg)' }}>
            <Shield size={20} color="var(--primary)" />
            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{isSuperAdmin ? 'Super Admin Panel' : 'Admin Panel'}</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
