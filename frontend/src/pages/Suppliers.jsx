import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const Suppliers = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch Suppliers
    fetch('http://localhost:8080/api/suppliers')
      .then(res => res.json())
      .then(data => setSuppliers(data))
      .catch(err => {
        console.error(err);
        toast.error("Failed to load suppliers");
      });

    // Fetch Products to get accurate counts
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h2>Browse By Supplier</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
        {suppliers.map(sup => {
          // Count active products for this supplier
          const actualCount = products.filter(p => p.supplier && p.supplier.id === sup.id).length;
          
          return (
            <div key={sup.id} className="glass-panel hover-card" 
                 onClick={() => navigate(`/?supplier=${sup.id}`)}
                 style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '50%' }}>
                <Briefcase size={36} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginTop: 'var(--space-sm)' }}>{sup.name}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {sup.contactEmail && <span>{sup.contactEmail}</span>}
                {sup.phone && <span style={{fontSize: '0.8rem'}}>{sup.phone}</span>}
              </div>
              <div className="badge" style={{ marginTop: 'var(--space-sm)', background: 'var(--accent)', color: 'white' }}>
                {actualCount} Products
              </div>
            </div>
          );
        })}
        {suppliers.length === 0 && (
           <p style={{ color: 'var(--text-muted)' }}>No suppliers available right now.</p>
        )}
      </div>
    </>
  );
};

export default Suppliers;
