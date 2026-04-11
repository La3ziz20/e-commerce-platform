import React, { memo } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from './WishlistContext';

const ProductCard = memo(({ product, onAdd }) => {
  const { toggleWishlist, isWishlisted } = useWishlist() || {};
  const wished = isWishlisted ? isWishlisted(product.id) : false;

  return (
    <div className="product-card glass-panel hover-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative' }}>
        <img src={product.imageUrl || 'https://via.placeholder.com/300x220?text=No+Image'} alt={product.name} className="product-image" />
        <button className="btn-icon" onClick={() => toggleWishlist && toggleWishlist(product)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: wished ? 'var(--danger)' : 'white' }}>
          <Heart size={18} fill={wished ? 'var(--danger)' : 'transparent'} />
        </button>
        <div style={{ position: 'absolute', top: '10px', left: '10px' }} className="badge">{product.category}</div>
      </div>
      
      <div className="product-details">
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 className="product-name" style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '8px' }}>{product.name}</h3>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
          <Star size={14} fill="var(--accent)" color="var(--accent)" />
          <Star size={14} fill="var(--accent)" color="var(--accent)" />
          <Star size={14} fill="var(--accent)" color="var(--accent)" />
          <Star size={14} fill="var(--accent)" color="var(--accent)" />
          <Star size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>(4.0)</span>
        </div>
        
        <p style={{ fontSize: '0.85rem', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>
        
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {product.price.toLocaleString('en-TN', { style: 'currency', currency: 'TND' })}
          </span>
          <button className="btn btn-primary btn-hover-anim" onClick={onAdd}>
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
