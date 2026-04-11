import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useCart } from '../components/CartContext';
import { SearchX, X } from 'lucide-react';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { searchQuery } = useOutletContext() || {};
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = searchQuery ? (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())) : true;
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = (product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <>
      <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <h2>{categoryFilter ? `Category: ${categoryFilter}` : 'Explore Products'}</h2>
          {categoryFilter && (
            <button className="btn-icon hover-card" onClick={() => navigate('/')} style={{ background: 'var(--danger)', color: 'white', padding: '4px' }}>
              <X size={16} />
            </button>
          )}
        </div>
        <span style={{ color: 'var(--text-muted)' }}>{filteredProducts.length} Results</span>
      </div>

      {loading ? (
        <div className="product-grid">
          {[1,2,3,4,5,6,7,8].map(n => <SkeletonCard key={n} />)}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: 'var(--space-md)' }}>
          <SearchX size={64} color="var(--text-muted)" />
          <h3 style={{ color: 'var(--text-muted)' }}>No products found</h3>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
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

export default HomePage;
