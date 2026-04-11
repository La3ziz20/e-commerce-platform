import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const isWished = prev.some(item => item.id === product.id);
      if (isWished) {
        toast.success(`Removed ${product.name} from Wishlist`);
        return prev.filter(item => item.id !== product.id);
      } else {
        toast.success(`Added ${product.name} to Wishlist`);
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (id) => wishlistItems.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
