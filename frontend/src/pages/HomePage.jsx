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
  const supplierFilter = searchParams.get('supplier');
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
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
    const matchesSupplier = supplierFilter ? (p.supplier && p.supplier.id.toString() === supplierFilter) : true;
    return matchesSearch && matchesCategory && matchesSupplier;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    return b.id - a.id; // newest (highest ID first) defaults
  });

  const handleAdd = (product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <>
      <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <h2>{categoryFilter ? `Category: ${categoryFilter}` : supplierFilter ? 'Filtered by Supplier' : 'Explore Products'}</h2>
          {(categoryFilter || supplierFilter) && (
            <button className="btn-icon hover-card" onClick={() => navigate('/')} style={{ background: 'var(--danger)', color: 'white', padding: '4px' }}>
              <X size={16} />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <span style={{ color: 'var(--text-muted)' }}>{filteredProducts.length} Results</span>
          <select 
            className="glass-input" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '8px 16px', background: 'var(--surface)', color: 'var(--text-main)', cursor: 'pointer', maxWidth: '200px' }}
          >
            <option value="newest">Latest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
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
