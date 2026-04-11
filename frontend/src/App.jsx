import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext';
import { WishlistProvider } from './components/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import SkeletonCard from './components/SkeletonCard';

// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Categories = lazy(() => import('./pages/Categories'));
const Orders = lazy(() => import('./pages/Orders'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));

const Loader = () => (
  <div style={{ padding: 'var(--space-xl)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
    {[1,2,3,4].map(n => <SkeletonCard key={n} />)}
  </div>
);

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <Toaster position="top-right" toastOptions={{
              style: {
                background: 'var(--surface)',
                color: 'var(--text-main)',
                border: '1px solid var(--border)'
              }
            }} />
            
            <Routes>
              <Route path="/login" element={<Suspense fallback={<div className="auth-layout"><div className="spinner"></div></div>}><Login /></Suspense>} />
              <Route path="/signup" element={<Suspense fallback={<div className="auth-layout"><div className="spinner"></div></div>}><Signup /></Suspense>} />
              
              <Route path="/" element={<MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}>
                <Route index element={<Suspense fallback={<Loader />}><HomePage /></Suspense>} />
                <Route path="/categories" element={<Suspense fallback={<Loader />}><Categories /></Suspense>} />
                <Route path="/wishlist" element={<Suspense fallback={<Loader />}><Wishlist /></Suspense>} />
                <Route path="/orders" element={<Suspense fallback={<Loader />}><Orders /></Suspense>} />
                <Route path="/checkout" element={<Suspense fallback={<Loader />}><Checkout /></Suspense>} />
                <Route path="/product/:id" element={<Suspense fallback={<Loader />}><ProductDetails /></Suspense>} />
                
                {/* Protected Admin Route */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Suspense fallback={<Loader />}>
                      <AdminDashboard />
                    </Suspense>
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
