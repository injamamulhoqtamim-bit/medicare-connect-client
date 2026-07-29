'use client';
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto Login on Refresh
  useEffect(() => {
    const token = localStorage.getItem('medicare_token');
    if (token) {
      axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem('medicare_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const registerUser = async (userData) => {
    setLoading(true);
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    localStorage.setItem('medicare_token', res.data.token);
    setUser(res.data.user);
    setLoading(false);
    return res.data;
  };

  const loginUser = async (credentials) => {
    setLoading(true);
    const res = await axios.post(`${API_URL}/auth/login`, credentials);
    localStorage.setItem('medicare_token', res.data.token);
    setUser(res.data.user);
    setLoading(false);
    return res.data;
  };

  const logoutUser = () => {
    localStorage.removeItem('medicare_token');
    setUser(null);
  };

  const authInfo = {
    user,
    loading,
    registerUser,
    loginUser,
    logoutUser
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
}