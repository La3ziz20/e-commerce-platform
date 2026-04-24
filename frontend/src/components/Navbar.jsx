import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Search, User, LogOut, Sun, Moon, Gem } from 'lucide-react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const Navbar = ({ onMenuClick, searchQuery, setSearchQuery, isLightMode, toggleTheme }) => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth() || {}; // defensive fallback for HMR
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    toast.success("Logged out successfully");
    navigate('/login');
  };

  return (
    <nav className="navbar glass-header">
      <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <button className="btn-icon" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <Link to="/" className="nav-brand" style={{ gap: '10px' }}>
          <Gem size={22} color="var(--primary)" strokeWidth={1.5} />
          <span style={{ letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 400 }}>Aura</span>
        </Link>
      </div>

      <div className="nav-search">
        <div className="input-group">
          <Search className="input-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="glass-input"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="nav-right" style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
        <button className="btn-icon btn-hover-anim" onClick={toggleTheme} title="Toggle Theme">
          {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="btn-icon header-cart-btn btn-hover-anim" onClick={() => setIsCartOpen(prev => !prev)} style={{ position: 'relative' }}>
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="badge" style={{ position: 'absolute', top: -5, right: -5 }}>
              {cartCount}
            </span>
          )}
        </button>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-panel btn-hover-anim" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '20px', cursor: 'pointer' }}>
                <User size={16} color="var(--primary)"/>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
              </div>
            </Link>
            <button className="btn-icon btn-hover-anim" onClick={handleLogout} title="Logout">
              <LogOut size={20} color="var(--danger)" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-hover-anim">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
