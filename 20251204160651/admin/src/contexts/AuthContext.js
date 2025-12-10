import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟登录检查
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // 简化的登录逻辑
      if (username === 'admin' && password === 'iluck2024') {
        const token = 'mock-token-' + Date.now();
        localStorage.setItem('token', token);
        setUser({ username, token });
        return { success: true };
      } else {
        return { 
          success: false, 
          message: '用户名或密码错误' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: '登录失败' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};