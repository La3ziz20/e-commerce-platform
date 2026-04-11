import React from 'react';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../components/WishlistContext';
import { useCart } from '../components/CartContext';
import { HeartCrack } from 'lucide-react';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlistItems } = useWishlist() || { wishlistItems: [] };
  const { addToCart } = useCart();

  const handleAdd = (product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h2>Your Wishlist</h2>
        <span style={{ color: 'var(--text-muted)' }}>{wishlistItems.length} Saved Items</span>
      </div>

      {wishlistItems.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: 'var(--space-md)' }}>
          <HeartCrack size={64} color="var(--text-muted)" />
          <h3 style={{ color: 'var(--text-muted)' }}>Your wishlist is empty</h3>
        </div>
      ) : (
        <div className="product-grid">
          {wishlistItems.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={() => handleAdd(product)} 
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Wishlist;
