import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORY_NAMES } from '../data/categories';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const initialMockUsers = [
  { id: 1, name: "Aziz M.", email: "aziz@aura.com", password: "password123", role: "SUPER_ADMIN", registered: "2026-03-12" },
  { id: 2, name: "Sarah K.", email: "sarah@example.com", password: "password123", role: "USER", registered: "2026-03-15" },
  { id: 3, name: "Mohamed L.", email: "mohamed@example.com", password: "password123", role: "USER", registered: "2026-04-01" },
  { id: 4, name: "Admin", email: "admin@aura.com", password: "password123", role: "SUPER_ADMIN", registered: "2026-03-01" },
];

export const AuthProvider = ({ children }) => {
  // Load users from localStorage or hit initial defaults
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('aura_users');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old users from previous sessions that lacked the new fields:
      return parsed.map(u => {
        let updatedUser = { ...u };
        if (!updatedUser.password) updatedUser.password = "password123";
        if (updatedUser.email === "admin@aura.com" && updatedUser.role === "ADMIN") updatedUser.role = "SUPER_ADMIN";
        if (updatedUser.email === "aziz@aura.com" && updatedUser.role === "ADMIN") updatedUser.role = "SUPER_ADMIN";
        return updatedUser;
      });
    }
    return initialMockUsers;
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

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser && foundUser.password === password) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (userData) => {
    const newUser = {
      ...userData,
      password: userData.password || "password123",
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

  const editUser = (userId, updatedData) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    if (user && user.id === userId) {
       setUser(prev => ({ ...prev, ...updatedData }));
    }
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    // Provide safeguards if a super admin deletes themselves
    if (user && user.id === userId) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, isAdmin, isSuperAdmin, login, register, logout, updateRole, editUser, deleteUser, categoriesList, addCategory, editCategory, deleteCategory }}>
      {children}
    </AuthContext.Provider>
  );
};
