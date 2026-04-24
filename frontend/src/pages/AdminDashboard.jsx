import React, { useState, useEffect } from 'react';
import { Package, Users, ShoppingBag, Edit, Trash2, Plus, X, Briefcase, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORY_NAMES } from '../data/categories';
import { useAuth } from '../components/AuthContext';
import { useCart } from '../components/CartContext';
import { Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

const STATUS_MAP = {
  'Processing': { icon: Clock, color: 'var(--accent)' },
  'Shipped': { icon: Truck, color: 'var(--primary)' },
  'Delivered': { icon: CheckCircle, color: 'var(--text-muted)' },
  'Cancelled': { icon: XCircle, color: 'var(--danger)' }
};

const AdminDashboard = () => {
  const { user, users, isSuperAdmin, updateRole, register, editUser, deleteUser, categoriesList, addCategory, editCategory, deleteCategory } = useAuth();
  const { orders, updateOrderStatus } = useCart();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryName, setEditingCategoryName] = useState(null);
  const [categoryFormName, setCategoryFormName] = useState('');
  
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierFormData, setSupplierFormData] = useState({ name: '', contactEmail: '', phone: '' });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({ name: '', email: '', password: '', role: 'USER' });

  const [isManageUserModalOpen, setIsManageUserModalOpen] = useState(false);
  const [manageUserFormData, setManageUserFormData] = useState({ userId: null, name: '', email: '', password: '', role: '' });
  const [manageUserStats, setManageUserStats] = useState({ ordersCount: 0 });
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showManageUserPassword, setShowManageUserPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '', category: '', description: '', price: '', imageUrl: '', supplierStr: ''
  });

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const todayStr = new Date().toISOString().split('T')[0];
  const ordersToday = orders ? orders.filter(o => o.date === todayStr).length : 0;

  const fetchProducts = () => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  const fetchSuppliers = () => {
    fetch('http://localhost:8080/api/suppliers')
      .then(res => res.json())
      .then(data => setSuppliers(data));
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const handleDelete = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product?',
      onConfirm: () => {
        fetch(`http://localhost:8080/api/products/${id}`, { method: 'DELETE' })
          .then(res => {
            if(res.ok) {
              setProducts(products.filter(p => p.id !== id));
              toast.success("Product deleted successfully");
            } else throw new Error("Failed to delete");
          }).catch(err => toast.error(err.message));
      }
    });
  };

  const handleRoleChange = (userId, newRole) => {
    updateRole(userId, newRole);
    toast.success(`User role updated to ${newRole}`);
  };

  const handleOpenModal = (product = null) => {
    if(product && product.id) {
      setEditingProduct(product);
      setFormData({
        ...product,
        supplierStr: product.supplier ? product.supplier.id.toString() : ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: '', description: '', price: '', imageUrl: '', supplierStr: '' });
    }
    setIsModalOpen(true);
  };

  const handleOpenSupplierModal = (supplier = null) => {
    if(supplier && supplier.id) {
      setEditingSupplier(supplier);
      setSupplierFormData(supplier);
    } else {
      setEditingSupplier(null);
      setSupplierFormData({ name: '', contactEmail: '', phone: '' });
    }
    setIsSupplierModalOpen(true);
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
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Category',
      message: `Are you sure you want to delete the category "${catName}"?`,
      onConfirm: () => {
        deleteCategory(catName);
        toast.success("Category deleted!");
      }
    });
  };

  const handleSupplierSubmit = (e) => {
    e.preventDefault();
    const method = editingSupplier ? 'PUT' : 'POST';
    const url = editingSupplier 
      ? `http://localhost:8080/api/suppliers/${editingSupplier.id}` 
      : 'http://localhost:8080/api/suppliers';
      
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplierFormData)
    })
    .then(async res => {
      if(!res.ok) throw new Error("Failed connecting to server");
      return res.json();
    })
    .then(data => {
      toast.success(editingSupplier ? "Supplier updated!" : "Supplier added!");
      setIsSupplierModalOpen(false);
      fetchSuppliers();
    })
    .catch(err => toast.error(err.message));
  };

  const handleDeleteSupplier = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Supplier',
      message: 'Are you sure you want to delete this supplier?',
      onConfirm: () => {
        fetch(`http://localhost:8080/api/suppliers/${id}`, { method: 'DELETE' })
          .then(res => {
            if(res.ok) {
              setSuppliers(suppliers.filter(s => s.id !== id));
              toast.success("Supplier deleted!");
            } else throw new Error("Failed to delete (might be linked to products)");
          }).catch(err => toast.error(err.message));
      }
    });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ name: userFormData.name, email: userFormData.email, password: userFormData.password, role: userFormData.role });
      toast.success("User created successfully!");
      setIsUserModalOpen(false);
      setUserFormData({ name: '', email: '', password: '', role: 'USER' });
    } catch (err) {
      toast.error(err.message || "Failed to create user");
    }
  };

  const handleManageUserSubmit = (e) => {
    e.preventDefault();
    editUser(manageUserFormData.userId, { 
       name: manageUserFormData.name, 
       email: manageUserFormData.email, 
       password: manageUserFormData.password,
       role: manageUserFormData.role
    });
    toast.success("User profile updated successfully!");
    setIsManageUserModalOpen(false);
  };

  const handleDeleteTargetUser = (userId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete User',
      message: 'Are you critically sure you want to permanently delete this user?',
      onConfirm: () => {
        deleteUser(userId);
        toast.success("User deleted successfully!");
        setIsManageUserModalOpen(false);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct 
      ? `http://localhost:8080/api/products/${editingProduct.id}` 
      : 'http://localhost:8080/api/products';
      
    const { id, supplierStr, supplier, ...payload } = formData;
    payload.price = parseFloat(payload.price) || 0;
    
    if (supplierStr) {
       payload.supplier = { id: parseInt(supplierStr) };
    }

      
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
          {activeTab === 'suppliers' && (
            <button className="btn btn-primary btn-hover-anim" onClick={() => handleOpenSupplierModal()}>
              <Plus size={18}/> Add Supplier
            </button>
          )}
          {activeTab === 'users' && isSuperAdmin && (
            <button className="btn btn-primary btn-hover-anim" onClick={() => setIsUserModalOpen(true)}>
              <Plus size={18}/> Create User
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
          className={`btn ${activeTab === 'suppliers' ? 'btn-primary' : 'glass-panel'}`} 
          onClick={() => setActiveTab('suppliers')}
        >
          Manage Suppliers
        </button>
        {isSuperAdmin && (
          <>
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
          </>
        )}
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
                <th>Supplier</th>
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
                  <td>{product.supplier ? product.supplier.name : 'Unknown'}</td>
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
                    {(() => {
                      const statusData = STATUS_MAP[order.status] || STATUS_MAP['Processing'];
                      const StatusIcon = statusData.icon;
                      return (
                        <span className="badge" style={{ background: 'transparent', border: `1px solid ${statusData.color}`, color: statusData.color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <StatusIcon size={12} /> {order.status}
                        </span>
                      );
                    })()}
                  </td>
                  <td>
                    {order.status !== 'Cancelled' && (
                      <button className="btn btn-primary btn-hover-anim" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--danger)', color: 'white', border: 'none' }} 
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Cancel Order',
                            message: 'Are you sure you want to cancel this order?',
                            onConfirm: () => {
                              updateOrderStatus(order.id, 'Cancelled');
                              toast.success(`Order ${order.id} cancelled`);
                            }
                          });
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
        ) : activeTab === 'suppliers' ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(sup => (
                <tr key={sup.id}>
                  <td style={{ fontWeight: 500 }}>{sup.name}</td>
                  <td>{sup.contactEmail}</td>
                  <td>{sup.phone}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-icon" onClick={() => handleOpenSupplierModal(sup)}><Edit size={16} /></button>
                      <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteSupplier(sup.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : activeTab === 'users' && isSuperAdmin ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registered</th>
                <th>Actions</th>
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
                        color: u.role === 'SUPER_ADMIN' ? 'var(--danger)' : u.role === 'ADMIN' ? 'var(--primary)' : 'var(--text-main)',
                        borderColor: u.role === 'SUPER_ADMIN' ? 'var(--danger)' : u.role === 'ADMIN' ? 'var(--primary)' : 'var(--border)',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      disabled={u.id === user?.id} // Prevent changing own role easily
                    >
                      <option value="USER" style={{ color: 'var(--text-main)', backgroundColor: 'var(--surface)' }}>USER</option>
                      <option value="ADMIN" style={{ color: 'var(--primary)', backgroundColor: 'var(--surface)' }}>ADMIN</option>
                      <option value="SUPER_ADMIN" style={{ color: 'var(--danger)', backgroundColor: 'var(--surface)' }}>SUPER_ADMIN</option>
                    </select>
                  </td>
                  <td>{u.registered}</td>
                  <td>
                    <button className="btn btn-primary btn-hover-anim" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => {
                        const targetOrders = orders.filter(o => o.user === u.name).length;
                        setManageUserStats({ ordersCount: targetOrders });
                        setManageUserFormData({ userId: u.id, name: u.name, email: u.email, password: u.password, role: u.role });
                        setIsManageUserModalOpen(true);
                      }}>
                      Manage User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
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
                
                <select className="glass-input" style={{ flex: 1, paddingLeft: '16px', backgroundColor: 'var(--surface)', color: 'var(--text-main)', cursor: 'pointer' }}
                  value={formData.supplierStr} onChange={e => setFormData({...formData, supplierStr: e.target.value})}>
                  <option value="">Select Supplier</option>
                  {suppliers.map(sup => <option key={sup.id} value={sup.id.toString()}>{sup.name}</option>)}
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
      
      {isSupplierModalOpen && (
        <div className="cart-overlay open" style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-xl)', width: '100%', maxWidth: '400px', margin: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
              <h3>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h3>
              <button className="btn-icon" onClick={() => setIsSupplierModalOpen(false)}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSupplierSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <input type="text" placeholder="Supplier Name" className="glass-input" style={{ paddingLeft: '16px' }}
                value={supplierFormData.name} onChange={e => setSupplierFormData({...supplierFormData, name: e.target.value})} autoFocus required/>
                
              <input type="email" placeholder="Contact Email (optional)" className="glass-input" style={{ paddingLeft: '16px' }}
                value={supplierFormData.contactEmail} onChange={e => setSupplierFormData({...supplierFormData, contactEmail: e.target.value})} />
                
              <input type="text" placeholder="Phone (optional)" className="glass-input" style={{ paddingLeft: '16px' }}
                value={supplierFormData.phone} onChange={e => setSupplierFormData({...supplierFormData, phone: e.target.value})} />
                
              <button type="submit" className="btn btn-primary btn-hover-anim" style={{ marginTop: 'var(--space-sm)' }}>
                {editingSupplier ? 'Save Changes' : 'Create Supplier'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isUserModalOpen && (
        <div className="cart-overlay open" style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-xl)', width: '100%', maxWidth: '400px', margin: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
              <h3>Create New User</h3>
              <button className="btn-icon" onClick={() => setIsUserModalOpen(false)}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <input type="text" placeholder="Full Name" className="glass-input" style={{ paddingLeft: '16px' }}
                value={userFormData.name} onChange={e => setUserFormData({...userFormData, name: e.target.value})} required/>
              <input type="email" placeholder="Email" className="glass-input" style={{ paddingLeft: '16px' }}
                value={userFormData.email} onChange={e => setUserFormData({...userFormData, email: e.target.value})} required/>
              <div style={{ position: 'relative' }}>
                <input type={showUserPassword ? "text" : "password"} placeholder="Mot de passe" className="glass-input" style={{ paddingLeft: '16px', width: '100%' }}
                  value={userFormData.password} onChange={e => setUserFormData({...userFormData, password: e.target.value})} required/>
                <button type="button" className="btn-icon" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => setShowUserPassword(!showUserPassword)}>
                  {showUserPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <select className="glass-input" style={{ paddingLeft: '16px', backgroundColor: 'var(--surface)', color: 'var(--text-main)', cursor: 'pointer' }}
                value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value})}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
              <button type="submit" className="btn btn-primary btn-hover-anim" style={{ marginTop: 'var(--space-sm)' }}>
                Create User
              </button>
            </form>
          </div>
        </div>
      )}

      {isManageUserModalOpen && (
        <div className="cart-overlay open" style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-xl)', width: '100%', maxWidth: '600px', margin: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
              <h3>Manage User Details</h3>
              <button className="btn-icon" onClick={() => setIsManageUserModalOpen(false)}><X size={20}/></button>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
              
              <div style={{ flex: '1', minWidth: '200px' }}>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>Platform Activity</h4>
                <div className="glass-panel" style={{ padding: 'var(--space-md)', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <h1 style={{ color: 'var(--primary)', margin: 0 }}>{manageUserStats.ordersCount}</h1>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Liftime Orders</span>
                </div>
                <div style={{ marginTop: 'var(--space-xl)' }}>
                  <h4 style={{ color: 'var(--danger)', marginBottom: 'var(--space-sm)' }}>Danger Zone</h4>
                  <button className="btn" type="button" 
                          onClick={() => handleDeleteTargetUser(manageUserFormData.userId)}
                          style={{ width: '100%', backgroundColor: 'rgba(255, 71, 87, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
                    Delete User Profile
                  </button>
                </div>
              </div>

              <div style={{ flex: '2', minWidth: '250px' }}>
                <form onSubmit={handleManageUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full Name</label>
                    <input type="text" className="glass-input" style={{ paddingLeft: '16px', marginTop: '4px' }}
                      value={manageUserFormData.name} onChange={e => setManageUserFormData({...manageUserFormData, name: e.target.value})} required/>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Address</label>
                    <input type="email" className="glass-input" style={{ paddingLeft: '16px', marginTop: '4px' }}
                      value={manageUserFormData.email} onChange={e => setManageUserFormData({...manageUserFormData, email: e.target.value})} required/>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mot de passe (Password)</label>
                    <div style={{ position: 'relative', marginTop: '4px' }}>
                      <input type={showManageUserPassword ? "text" : "password"} className="glass-input" style={{ paddingLeft: '16px', width: '100%' }}
                        value={manageUserFormData.password} onChange={e => setManageUserFormData({...manageUserFormData, password: e.target.value})} required/>
                      <button type="button" className="btn-icon" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => setShowManageUserPassword(!showManageUserPassword)}>
                        {showManageUserPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Privilege Role</label>
                    <select className="glass-input" style={{ paddingLeft: '16px', marginTop: '4px', backgroundColor: 'var(--surface)', color: 'var(--text-main)', cursor: 'pointer' }}
                      disabled={manageUserFormData.userId === user?.id}
                      value={manageUserFormData.role} onChange={e => setManageUserFormData({...manageUserFormData, role: e.target.value})}>
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary btn-hover-anim" style={{ marginTop: 'var(--space-sm)' }}>
                    Save Profile Changes
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}
      {/* Confirmation Modal Card */}
      {confirmDialog.isOpen && (
        <div className="cart-overlay open" style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999 }}>
          <div className="glass-panel" style={{ padding: 'var(--space-xl)', width: '100%', maxWidth: '400px', margin: '0 16px', textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
                <div style={{ background: 'rgba(255, 71, 87, 0.1)', padding: '16px', borderRadius: '50%' }}>
                  <Trash2 color="var(--danger)" size={32} />
                </div>
              </div>
              <h3>{confirmDialog.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>{confirmDialog.message}</p>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
              <button 
                className="btn glass-panel" 
                onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary btn-hover-anim" 
                onClick={() => {
                  if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                  setConfirmDialog({ ...confirmDialog, isOpen: false });
                }}
                style={{ flex: 1, backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
