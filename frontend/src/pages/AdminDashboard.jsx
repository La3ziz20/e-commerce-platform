import React, { useState, useEffect } from 'react';
import { Package, Users, ShoppingBag, Edit, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORY_NAMES } from '../data/categories';
import { useAuth } from '../components/AuthContext';
import { useCart } from '../components/CartContext';

const AdminDashboard = () => {
  const { users, updateRole, categoriesList, addCategory, editCategory, deleteCategory } = useAuth();
  const { orders, updateOrderStatus } = useCart();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryName, setEditingCategoryName] = useState(null);
  const [categoryFormName, setCategoryFormName] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', category: '', description: '', price: '', imageUrl: ''
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const ordersToday = orders ? orders.filter(o => o.date === todayStr).length : 0;

  const fetchProducts = () => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    
    fetch(`http://localhost:8080/api/products/${id}`, { method: 'DELETE' })
      .then(res => {
        if(res.ok) {
          setProducts(products.filter(p => p.id !== id));
          toast.success("Product deleted successfully");
        } else throw new Error("Failed to delete");
      }).catch(err => toast.error(err.message));
  };

  const handleRoleChange = (userId, newRole) => {
    updateRole(userId, newRole);
    toast.success(`User role updated to ${newRole}`);
  };

  const handleOpenModal = (product = null) => {
    if(product && product.id) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: '', description: '', price: '', imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const handleOpenCategoryModal = (catName = null) => {
    setEditingCategoryName(catName);
    setCategoryFormName(catName || '');
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!categoryFormName.trim()) return;

    if (editingCategoryName) {
      editCategory(editingCategoryName, categoryFormName.trim());
      toast.success("Category updated!");
    } else {
      addCategory(categoryFormName.trim());
      toast.success("Category added!");
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (catName) => {
    if(!window.confirm(`Are you sure you want to delete the category "${catName}"?`)) return;
    deleteCategory(catName);
    toast.success("Category deleted!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct 
      ? `http://localhost:8080/api/products/${editingProduct.id}` 
      : 'http://localhost:8080/api/products';
      
    const { id, ...payload } = formData;
    payload.price = parseFloat(payload.price) || 0;
      
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(async res => {
      if(!res.ok) {
        let errText = '';
        try {
          errText = await res.text();
        } catch(e) {}
        throw new Error("Failed: " + res.status + " " + errText);
      }
      return res.json();
    })
    .then(data => {
      toast.success(editingProduct ? "Product updated!" : "Product added!");
      setIsModalOpen(false);
      fetchProducts();
    })
    .catch(err => toast.error(err.message || "An unknown error occurred"));
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h2>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          {activeTab === 'categories' && (
            <button className="btn btn-primary btn-hover-anim" onClick={() => handleOpenCategoryModal()}>
              <Plus size={18}/> Add Category
            </button>
          )}
          {activeTab === 'products' && (
            <button className="btn btn-primary btn-hover-anim" onClick={() => handleOpenModal()}>
              <Plus size={18}/> Add Product
            </button>
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <div className="glass-panel" style={{ padding: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '12px' }}><Package color="white" /></div>
          <div>
            <h4 style={{ color: 'var(--text-muted)' }}>Total Products</h4>
            <h2>{products.length}</h2>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{ background: 'var(--accent)', padding: '12px', borderRadius: '12px' }}><Users color="white" /></div>
          <div>
            <h4 style={{ color: 'var(--text-muted)' }}>Active Users</h4>
            <h2>{users.length}</h2>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{ background: 'var(--danger)', padding: '12px', borderRadius: '12px' }}><ShoppingBag color="white" /></div>
          <div>
            <h4 style={{ color: 'var(--text-muted)' }}>Orders Today</h4>
            <h2>{ordersToday}</h2>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <button 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'glass-panel'}`} 
          onClick={() => setActiveTab('products')}
        >
          Products Data
        </button>
        <button 
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'glass-panel'}`} 
          onClick={() => setActiveTab('users')}
        >
          User Accounts
        </button>
        <button 
          className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'glass-panel'}`} 
          onClick={() => setActiveTab('categories')}
        >
          Manage Categories
        </button>
        <button 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'glass-panel'}`} 
          onClick={() => setActiveTab('orders')}
        >
          Manage Orders
        </button>
      </div>

      {/* Views */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: 'var(--space-md)' }}>
        {activeTab === 'products' ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <img src={product.imageUrl || 'https://via.placeholder.com/40'} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                  </td>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td><span className="badge">{product.category}</span></td>
                  <td style={{ fontWeight: 'bold' }}>{product.price.toLocaleString('en-TN')} TND</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-icon" onClick={() => handleOpenModal(product)}><Edit size={16} /></button>
                      <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(product.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : activeTab === 'orders' ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 500 }}>{order.id}</td>
                  <td>{order.user}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{order.date}</td>
                  <td style={{ fontWeight: 'bold' }}>{order.total.toLocaleString('en-TN')} TND</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: order.status === 'Cancelled' ? 'rgba(255, 71, 87, 0.2)' : 'var(--glass-border)', color: order.status === 'Cancelled' ? 'var(--danger)' : 'var(--text-main)' }}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status !== 'Cancelled' && (
                      <button className="btn btn-primary btn-hover-anim" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--danger)', color: 'white', border: 'none' }} 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this order?')) {
                            updateOrderStatus(order.id, 'Cancelled');
                            toast.success(`Order ${order.id} cancelled`);
                          }
                        }}>
                        Cancel Order
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : activeTab === 'categories' ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoriesList.map((cat, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500 }}>{cat}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-icon" onClick={() => handleOpenCategoryModal(cat)}><Edit size={16} /></button>
                      <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteCategory(cat)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td>
                    <select 
                      className="glass-input" 
                      style={{ 
                        padding: '4px 8px', 
                        backgroundColor: 'var(--background)',
                        color: u.role === 'ADMIN' ? 'var(--primary)' : 'var(--text-main)',
                        borderColor: u.role === 'ADMIN' ? 'var(--primary)' : 'var(--border)',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="USER" style={{ color: 'var(--text-main)', backgroundColor: 'var(--surface)' }}>USER</option>
                      <option value="ADMIN" style={{ color: 'var(--primary)', backgroundColor: 'var(--surface)' }}>ADMIN</option>
                    </select>
                  </td>
                  <td>{u.registered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Profile */}
      {isModalOpen && (
        <div className="cart-overlay open" style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-xl)', width: '100%', maxWidth: '500px', margin: '0 16px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <input type="text" placeholder="Product Name" className="glass-input" style={{ paddingLeft: '16px' }}
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
                
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select className="glass-input" style={{ flex: 1, paddingLeft: '16px', backgroundColor: 'var(--surface)', color: 'var(--text-main)', cursor: 'pointer' }}
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                  <option value="" disabled>Select Category</option>
                  {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
                
              <input type="number" step="0.01" placeholder="Price (TND)" className="glass-input" style={{ paddingLeft: '16px' }}
                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required/>
                
              <textarea placeholder="Description" className="glass-input" rows="4" style={{ paddingLeft: '16px', resize: 'none' }}
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
                
              <input type="url" placeholder="Image URL (optional)" className="glass-input" style={{ paddingLeft: '16px' }}
                value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})}/>
                
              <button type="submit" className="btn btn-primary btn-hover-anim" style={{ marginTop: 'var(--space-sm)' }}>
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
      {isCategoryModalOpen && (
        <div className="cart-overlay open" style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-xl)', width: '100%', maxWidth: '400px', margin: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
              <h3>{editingCategoryName ? 'Edit Category' : 'Add New Category'}</h3>
              <button className="btn-icon" onClick={() => setIsCategoryModalOpen(false)}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <input type="text" placeholder="Category Name" className="glass-input" style={{ paddingLeft: '16px' }}
                value={categoryFormName} onChange={e => setCategoryFormName(e.target.value)} autoFocus required/>
                
              <button type="submit" className="btn btn-primary btn-hover-anim" style={{ marginTop: 'var(--space-sm)' }}>
                {editingCategoryName ? 'Save Changes' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
