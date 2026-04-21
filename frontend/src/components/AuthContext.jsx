import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORY_NAMES } from '../data/categories';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aura_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState([]);

  const [categoriesList, setCategoriesList] = useState(() => {
    const saved = localStorage.getItem('aura_categories_list');
    return saved ? JSON.parse(saved) : CATEGORY_NAMES;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('aura_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aura_current_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('aura_categories_list', JSON.stringify(categoriesList));
  }, [categoriesList]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error("Failed to fetch users", e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const register = async (userData) => {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error("Registration failed");
    fetchUsers(); // Refresh users list
    return true;
  };

  const verifyEmail = async (email, code) => {
    const response = await fetch('http://localhost:8080/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data);
      fetchUsers(); // Refresh users list
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateRole = async (userId, newRole) => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        if (user && user.id === userId) setUser(prev => ({ ...prev, role: newRole }));
      }
    } catch (e) {
      console.error("Failed to update role", e);
    }
  };

  const editUser = async (userId, updatedData) => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
        if (user && user.id === userId) setUser(prev => ({ ...prev, ...updatedData }));
      }
    } catch (e) {
      console.error("Failed to edit user", e);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        if (user && user.id === userId) setUser(null);
      }
    } catch (e) {
      console.error("Failed to delete user", e);
    }
  };

  const addCategory = (categoryName) => {
    if (!categoriesList.includes(categoryName)) {
      setCategoriesList(prev => [...prev, categoryName]);
    }
  };

  const editCategory = (oldName, newName) => {
    setCategoriesList(prev => prev.map(c => c === oldName ? newName : c));
  };

  const deleteCategory = (categoryName) => {
    setCategoriesList(prev => prev.filter(c => c !== categoryName));
  };

  return (
    <AuthContext.Provider value={{ user, users, isAdmin, isSuperAdmin, login, register, verifyEmail, logout, updateRole, editUser, deleteUser, categoriesList, addCategory, editCategory, deleteCategory }}>
      {children}
    </AuthContext.Provider>
  );
};
