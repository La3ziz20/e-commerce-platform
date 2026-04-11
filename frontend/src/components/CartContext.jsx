import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const initialOrders = [
  { id: 'ORD-2026-901', date: '2026-04-10', total: 1199.99, status: 'Processing', user: 'Aziz M.' },
  { id: 'ORD-2026-885', date: '2026-04-05', total: 45.00, status: 'Shipped', user: 'Sarah K.' },
  { id: 'ORD-2026-721', date: '2026-03-22', total: 899.50, status: 'Delivered', user: 'Mohamed L.' }
];

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('aura_orders');
    return savedOrders ? JSON.parse(savedOrders) : initialOrders;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('aura_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const placeOrder = (user) => {
    if (cartItems.length === 0) return null;
    
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder = {
      id: `ORD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      total: total,
      status: 'Processing',
      user: user?.name || 'Guest'
    };
    
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      orders,
      placeOrder,
      updateOrderStatus
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
