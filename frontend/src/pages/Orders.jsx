import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useCart } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';
import toast from 'react-hot-toast';

const STATUS_MAP = {
  'Processing': { icon: Clock, color: 'var(--accent)' },
  'Shipped': { icon: Truck, color: 'var(--primary)' },
  'Delivered': { icon: CheckCircle, color: 'var(--text-muted)' },
  'Cancelled': { icon: XCircle, color: 'var(--danger)' }
};

const Orders = () => {
  const { orders, updateOrderStatus } = useCart();
  const { user } = useAuth() || {};
  const isAdmin = user?.role === 'ADMIN';

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Order status instantly updated to ${newStatus}`);
  };

  return (
    <>
      <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>{isAdmin ? 'All Orders Management' : 'Your Order History'}</h2>
          <span style={{ color: 'var(--text-muted)' }}>{orders.length} Recent Orders</span>
        </div>
        {isAdmin && <span className="badge" style={{ backgroundColor: 'var(--primary)', padding: '6px 12px' }}>Admin Mode</span>}
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto', padding: 'var(--space-md)' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              {isAdmin && <th>Customer</th>}
              <th>Date</th>
              <th>Total Amount</th>
              <th>Tracking Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const statusData = STATUS_MAP[order.status];
              const StatusIcon = statusData.icon;
              
              return (
                <tr key={order.id}>
                  <td style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={16} color="var(--primary)" /> {order.id}
                  </td>
                  {isAdmin && <td style={{ color: 'var(--text-muted)' }}>{order.user}</td>}
                  <td style={{ color: 'var(--text-muted)' }}>{order.date}</td>
                  <td style={{ fontWeight: 'bold' }}>{order.total.toLocaleString('en-TN', { style: 'currency', currency: 'TND' })}</td>
                  <td>
                    {isAdmin ? (
                      <select 
                        className="glass-input" 
                        style={{ 
                          padding: '6px', 
                          backgroundColor: 'var(--background)', 
                          color: statusData.color, 
                          border: `1px solid ${statusData.color}`, 
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {Object.keys(STATUS_MAP).map(status => (
                          <option key={status} value={status} style={{ color: 'var(--text-main)', backgroundColor: 'var(--surface)' }}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="badge" style={{ background: 'transparent', border: `1px solid ${statusData.color}`, color: statusData.color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <StatusIcon size={12} /> {order.status}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;
