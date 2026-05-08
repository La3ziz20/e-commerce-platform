import React, { memo } from 'react';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from './WishlistContext';
import { useLanguage } from './LanguageContext';

const ProductCard = memo(({ product, onAdd }) => {
  const { toggleWishlist, isWishlisted } = useWishlist() || {};
  const { t } = useLanguage();
  const wished = isWishlisted ? isWishlisted(product.id) : false;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.imageUrl || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2000&auto=format&fit=crop'} 
            alt={product.name} 
            className="product-image" 
            style={{ width: '100%', height: '350px', objectFit: 'cover', cursor: 'pointer', display: 'block' }} 
          />
        </Link>
        <button className="btn-icon" onClick={() => toggleWishlist && toggleWishlist(product)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(18,15,14,0.5)', color: wished ? 'var(--danger)' : 'white', backdropFilter: 'blur(4px)' }}>
          <Heart size={18} fill={wished ? 'var(--danger)' : 'transparent'} />
        </button>
        
        {/* Quick View Overlay */}
        <div className="quick-view" onClick={() => window.location.href = `/product/${product.id}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Eye size={16} /> {t('product.quickView')}
          </div>
        </div>
      </div>
      
      <div className="product-details" style={{ padding: 'var(--space-md) var(--space-lg)', background: 'var(--surface)' }}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 className="product-name" style={{ 
            color: 'var(--text-main)', 
            fontFamily: "'Playfair Display', serif", 
            fontStyle: 'italic',
            fontSize: '1.25rem', 
            marginBottom: '4px' 
          }}>
            {product.name}
          </h3>
        </Link>
        
        <p style={{ 
          fontSize: '0.85rem', 
          color: 'var(--text-muted)', 
          fontWeight: 300,
          marginBottom: '12px' 
        }}>
          {t(`category.${product.category.toLowerCase()}`)}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ 
            fontSize: '1.1rem', 
            fontWeight: 300, 
            color: 'var(--text-muted)' 
          }}>
            {product.price.toLocaleString('en-TN', { style: 'currency', currency: 'TND' })}
          </span>
          <button className="btn-icon btn-hover-anim" onClick={onAdd} style={{ padding: '8px', background: 'rgba(176, 138, 106, 0.1)', color: 'var(--primary)' }}>
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
