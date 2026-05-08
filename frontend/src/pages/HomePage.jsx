import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useCart } from '../components/CartContext';
import { useLanguage } from '../components/LanguageContext';
import { SearchX, X } from 'lucide-react';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { searchQuery } = useOutletContext() || {};
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const supplierFilter = searchParams.get('supplier');
  const navigate = useNavigate();
  const collectionRef = useRef(null);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const { addToCart } = useCart();
  const { t } = useLanguage();

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
    return b.id - a.id; 
  });

  const handleAdd = (product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  const scrollToCollection = () => {
    if (collectionRef.current) {
      const y = collectionRef.current.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const isFiltering = categoryFilter || supplierFilter || searchQuery;

  return (
    <>
      {!isFiltering && (
        <section style={{
          position: 'relative',
          width: '100%',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingTop: 'var(--nav-height)'
        }}>
          <div style={{ position: 'relative', zIndex: 1, padding: 'var(--space-xl)', animation: 'fadeInPage 2s ease-out forwards' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>
              {t('home.hero.title')}
            </h1>
            <button className="btn btn-primary btn-hover-anim" onClick={scrollToCollection} style={{ marginTop: 'var(--space-md)' }}>
              {t('home.hero.shop')}
            </button>
          </div>
        </section>
      )}

      {!isFiltering && (
        <section style={{
          padding: 'var(--space-xl) 20px',
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          animation: 'fadeInPage 2.5s ease-out forwards'
        }}>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>{t('home.about.title')}</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            {t('home.about.desc')}
          </p>
        </section>
      )}

      <div ref={collectionRef} style={{ padding: 'var(--space-xl)', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <h2>{categoryFilter ? `${t('home.collection.category')} ${t(`category.${categoryFilter.toLowerCase()}`)}` : supplierFilter ? t('home.collection.supplier') : t('home.collection.title')}</h2>
            {(categoryFilter || supplierFilter) && (
              <button className="btn-icon hover-card" onClick={() => navigate('/')} style={{ background: 'var(--danger)', color: 'white', padding: '4px' }}>
                <X size={16} />
              </button>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ color: 'var(--text-muted)' }}>{filteredProducts.length} {t('home.collection.results')}</span>
            <select 
              className="glass-input" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', cursor: 'pointer', maxWidth: '200px' }}
            >
              <option value="newest" style={{ background: 'var(--surface)' }}>{t('sort.newest')}</option>
              <option value="price-low" style={{ background: 'var(--surface)' }}>{t('sort.priceLow')}</option>
              <option value="price-high" style={{ background: 'var(--surface)' }}>{t('sort.priceHigh')}</option>
              <option value="name-asc" style={{ background: 'var(--surface)' }}>{t('sort.nameAsc')}</option>
              <option value="name-desc" style={{ background: 'var(--surface)' }}>{t('sort.nameDesc')}</option>
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
            <h3 style={{ color: 'var(--text-muted)' }}>{t('home.collection.noResults')}</h3>
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
      </div>
    </>
  );
};

export default HomePage;
