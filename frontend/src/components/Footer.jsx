import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Hash, MessageCircle } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

const Footer = () => {
  const { categoriesList } = useAuth() || { categoriesList: [] };
  const { t } = useLanguage();

  return (
    <footer className="glass-panel" style={{ 
      marginTop: 'auto', 
      padding: 'var(--space-xl)',
      borderLeft: 'none',
      borderRight: 'none',
      borderBottom: 'none',
      borderRadius: 0,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 'var(--space-xl)'
    }}>
      
      {/* About Us */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '1.4rem' }}>{t('footer.about')}</h3>
        <p style={{ lineHeight: '1.6', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {t('footer.desc')}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
          <a href="#" style={{ color: 'var(--text-muted)' }}><Globe size={20} /></a>
          <a href="#" style={{ color: 'var(--text-muted)' }}><Hash size={20} /></a>
          <a href="#" style={{ color: 'var(--text-muted)' }}><MessageCircle size={20} /></a>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '1.1rem', fontFamily: "'DM Sans', sans-serif", fontStyle: 'normal', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('footer.collections')}</h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categoriesList && categoriesList.slice(0, 5).map((category, index) => (
            <li key={index}>
              <Link to="/categories" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                {category}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/categories" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
              {t('footer.viewAll')} &rarr;
            </Link>
          </li>
        </ul>
      </div>

      {/* Contact Us */}
      <div>
        <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '1.1rem', fontFamily: "'DM Sans', sans-serif", fontStyle: 'normal', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('footer.contact')}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MapPin size={18} color="var(--primary)" />
            <span>ZI Chotrana I BP4 Parc Technologique El Ghazela, Ariana 2088</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Phone size={18} color="var(--primary)" />
            <span>+216 55 697 648</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Mail size={18} color="var(--primary)" />
            <span>aura.55697648@gmail.com</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
