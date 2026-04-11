import React from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, cartTotal, placeOrder } = useCart(); 
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePay = (e) => {
    e.preventDefault();
    placeOrder(user);
    toast.success("Payment successful! Order placed.");
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CheckCircle size={64} color="var(--primary)" style={{ marginBottom: '16px' }} />
        <h2>All set!</h2>
        <p>No pending checkout items.</p>
        <button className="btn btn-primary btn-hover-anim" style={{ marginTop: '16px' }} onClick={() => navigate('/')}>Return to Store</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)', alignItems: 'start' }}>
      <div className="glass-panel" style={{ padding: 'var(--space-xl)' }}>
        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Payment Details</h2>
        <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="input-group">
            <CreditCard className="input-icon" size={20} />
            <input type="text" placeholder="Card Number" className="glass-input" required />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <input type="text" placeholder="MM/YY" className="glass-input" style={{ paddingLeft: '16px' }} required />
            <input type="text" placeholder="CVC" className="glass-input" style={{ paddingLeft: '16px' }} required />
          </div>
          <button type="submit" className="btn btn-primary btn-hover-anim" style={{ width: '100%', marginTop: 'var(--space-md)' }}>
            Pay {cartTotal.toLocaleString('en-TN', { style: 'currency', currency: 'TND' })}
          </button>
        </form>
      </div>
      
      <div className="glass-panel" style={{ padding: 'var(--space-xl)' }}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>Order Summary</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
              <span>{item.quantity}x {item.name}</span>
              <span>{(item.price * item.quantity).toLocaleString('en-TN', { style: 'currency', currency: 'TND' })}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>Total</span>
            <span>{cartTotal.toLocaleString('en-TN', { style: 'currency', currency: 'TND' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
