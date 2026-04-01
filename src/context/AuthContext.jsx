import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('authUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const validUser = users.find(u => u.email === email && u.password === password);
      
      if (validUser) {
        const { password: _, ...userInfo } = validUser;
        setUser(userInfo);
        localStorage.setItem('authUser', JSON.stringify(userInfo));
        toast.success(`Welcome back, ${userInfo.name}!`);
        return { success: true, role: userInfo.role };
      } else {
        toast.error('Invalid email or password');
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (e) {
      toast.error('Connection failed.');
      return { success: false, message: 'DB Error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
