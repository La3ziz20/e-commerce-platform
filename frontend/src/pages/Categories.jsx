import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/categories';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { Tag } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { categoriesList } = useAuth();

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  // Create an icon dictionary from the default seeded categories
  const iconDictionary = CATEGORIES.reduce((acc, cat) => {
    acc[cat.name] = cat.icon;
    return acc;
  }, {});

  const combinedCategories = (categoriesList || []).map(catName => ({
    name: catName,
    icon: iconDictionary[catName] || Tag
  }));

  return (
    <>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h2>Browse Categories</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
        {combinedCategories.map((cat, i) => {
          const actualCount = products.filter(p => p.category === cat.name).length;
          return (
            <div key={i} className="glass-panel hover-card" 
                 onClick={() => navigate(`/?category=${cat.name}`)}
                 style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)', cursor: 'pointer' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '50%' }}>
                <cat.icon size={32} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>{cat.name}</h3>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{actualCount} Products</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Categories;
