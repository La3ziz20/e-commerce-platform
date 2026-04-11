import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Heart, MessageSquare } from 'lucide-react';
import { useCart } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';
import { useWishlist } from '../components/WishlistContext';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth() || {};
  const { toggleWishlist, isWishlisted } = useWishlist() || {};

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch Product
    fetch(`http://localhost:8080/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(data => {
        setProduct(data);
        return fetch(`http://localhost:8080/api/reviews/product/${id}`);
      })
      .then(res => res.json())
      .then(data => {
        setReviews(data || []);
        setLoading(false);
      })
      .catch(err => {
        toast.error(err.message);
        navigate('/');
      });
  }, [id, navigate]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to leave a review.");
      navigate('/login');
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }
    
    setIsSubmitting(true);
    const payload = {
      productId: Number(id),
      author: user.name,
      rating: rating,
      comment: comment.trim()
    };

    fetch('http://localhost:8080/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(async res => {
      if(!res.ok) throw new Error("Failed to submit review");
      return res.json();
    })
    .then(newReview => {
      setReviews([...reviews, newReview]);
      setComment('');
      setRating(5);
      toast.success("Review posted successfully!");
    })
    .catch(err => toast.error(err.message))
    .finally(() => setIsSubmitting(false));
  };

  const wished = product && isWishlisted ? isWishlisted(product.id) : false;
  
  const averageRating = reviews.length 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-xl)' }}><div className="spinner"></div></div>;
  }

  if (!product) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
      <button className="btn glass-panel btn-hover-anim" style={{ alignSelf: 'flex-start', padding: '8px 16px' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Main Product Section */}
      <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)', overflow: 'hidden' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--space-xl)' }}>
          <img src={product.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'} alt={product.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
        </div>
        
        <div style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column' }}>
          <div className="badge" style={{ alignSelf: 'flex-start', marginBottom: 'var(--space-sm)' }}>{product.category}</div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1,2,3,4,5].map(star => (
                <Star key={star} size={20} fill={star <= averageRating ? "var(--accent)" : "transparent"} color={star <= averageRating ? "var(--accent)" : "var(--text-muted)"} />
              ))}
            </div>
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
              {averageRating > 0 ? `(${averageRating} out of ${reviews.length} reviews)` : '(No reviews yet)'}
            </span>
          </div>

          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: 'var(--space-xl)', flexGrow: 1 }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {product.price.toLocaleString('en-TN', { style: 'currency', currency: 'TND' })}
            </span>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button className="btn-icon glass-panel btn-hover-anim" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)' }} onClick={() => toggleWishlist(product)}>
                <Heart size={20} fill={wished ? 'var(--danger)' : 'transparent'} color={wished ? 'var(--danger)' : 'var(--text-main)'} />
              </button>
              <button className="btn btn-primary btn-hover-anim" style={{ padding: '0 var(--space-xl)' }} onClick={() => { addToCart(product); toast.success("Added to cart"); }}>
                <ShoppingCart size={20} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-xl)' }}>
        
        {/* Review Form */}
        <div className="glass-panel" style={{ padding: 'var(--space-xl)', height: 'fit-content' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-md)' }}>
            <MessageSquare size={20} color="var(--primary)" /> Write a Review
          </h3>
          
          {user ? (
            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your Rating</label>
                <div style={{ display: 'flex', gap: '4px', cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      type="button"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star 
                        size={28} 
                        fill={(hoverRating || rating) >= star ? "var(--accent)" : "transparent"} 
                        color={(hoverRating || rating) >= star ? "var(--accent)" : "var(--text-muted)"} 
                        style={{ transition: 'all var(--transition-fast)' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your Comment</label>
                <textarea 
                  className="glass-input" 
                  rows="4" 
                  placeholder="What did you think of this product?" 
                  style={{ width: '100%', resize: 'vertical', paddingTop: '12px', paddingLeft: '16px' }}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary btn-hover-anim" disabled={isSubmitting} style={{ width: '100%' }}>
                {isSubmitting ? 'Posting...' : 'Post Review'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>You must be logged in to leave a review.</p>
              <button className="btn glass-panel btn-hover-anim" onClick={() => navigate('/login')}>Login Now</button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <h3 style={{ marginBottom: '8px' }}>Customer Reviews ({reviews.length})</h3>
          
          {reviews.length === 0 ? (
            <div className="glass-panel" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
              <Star size={40} color="var(--border)" style={{ marginBottom: '16px' }} />
              <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to rate this product!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {reviews.map(review => (
                <div key={review.id} className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 600 }}>{review.author}</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} size={14} fill={star <= review.rating ? "var(--accent)" : "transparent"} color={star <= review.rating ? "var(--accent)" : "var(--text-muted)"} />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
