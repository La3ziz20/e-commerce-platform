import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORY_NAMES } from '../data/categories';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const initialMockUsers = [
  { id: 1, name: "Aziz M.", email: "aziz@aura.com", role: "ADMIN", registered: "2026-03-12" },
  { id: 2, name: "Sarah K.", email: "sarah@example.com", role: "USER", registered: "2026-03-15" },
  { id: 3, name: "Mohamed L.", email: "mohamed@example.com", role: "USER", registered: "2026-04-01" },
  { id: 4, name: "Admin", email: "admin@aura.com", role: "ADMIN", registered: "2026-03-01" },
];

export const AuthProvider = ({ children }) => {
  // Load users from localStorage or hit initial defaults
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('aura_users');
    return saved ? JSON.parse(saved) : initialMockUsers;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aura_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [categoriesList, setCategoriesList] = useState(() => {
    const saved = localStorage.getItem('aura_categories_list');
    return saved ? JSON.parse(saved) : CATEGORY_NAMES;
  });

  useEffect(() => {
    localStorage.setItem('aura_users', JSON.stringify(users));
  }, [users]);

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

  const isAdmin = user?.role === "ADMIN";

  const login = (email) => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      registered: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateRole = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (user && user.id === userId) {
      setUser(prev => ({ ...prev, role: newRole }));
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
    <AuthContext.Provider value={{ user, users, isAdmin, login, register, logout, updateRole, categoriesList, addCategory, editCategory, deleteCategory }}>
      {children}
    </AuthContext.Provider>
  );
};
