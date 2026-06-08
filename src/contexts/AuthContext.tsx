// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'prestataire' | 'demandeur';
  telephone?: string;
  photo?: string;
  localisation?: string;
  email_verified_at?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log("AuthProvider - Token présent:", !!token);
      
      if (token && storedUser) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Vérifier la validité du token
          const response = await api.get('/auth/profile');
          if (response.data.success) {
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          console.error("Token invalide, déconnexion");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const login = (token: string, userData: User) => {
    console.log("AuthProvider.login - Utilisateur:", userData.email, "Rôle:", userData.role);
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    console.log("AuthProvider.logout - Déconnexion");
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};