import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { isCartOpen, setIsCartOpen, cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  return (
    <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`}>
      <div className="cart-sidebar glass-panel" style={{ borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
        <div style={{ padding: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}><ShoppingBag size={20} /> Your Cart</h2>
          <button className="btn-icon" onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {cartItems.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: 'var(--space-md)', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} opacity={0.5} />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="glass-panel hover-card" style={{ display: 'flex', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
                <img src={item.imageUrl} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '8px' }}>{(item.price * item.quantity).toLocaleString('en-TN', { style: 'currency', currency: 'TND' })}</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--border)', borderRadius: '8px', padding: '2px' }}>
                      <button className="btn-icon" style={{ padding: '4px' }} onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                      <span style={{ fontSize: '0.85rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button className="btn-icon" style={{ padding: '4px' }} onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                    </div>
                    
                    <button className="btn-icon" style={{ color: 'var(--danger)', padding: '4px' }} onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={{ padding: 'var(--space-lg)', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span>{cartTotal.toLocaleString('en-TN', { style: 'currency', currency: 'TND' })}</span>
            </div>
            <button className="btn btn-primary btn-hover-anim" style={{ width: '100%', padding: 'var(--space-md)' }} onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
