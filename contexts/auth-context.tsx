'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'user' | 'admin' | 'owner' | 'trainer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  city: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  signup: (data: {
    name: string;
    email: string;
    mobile: string;
    city: string;
    password: string;
    role: UserRole;
  }) => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DUMMY_USERS: Record<string, { password: string; user: AuthUser }> = {
  'user@example.com': {
    password: 'user123',
    user: {
      id: 'user_1',
      name: 'John Fitness',
      email: 'user@example.com',
      mobile: '+91-9876543210',
      city: 'Mumbai',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    },
  },
  'admin@example.com': {
    password: 'admin123',
    user: {
      id: 'admin_1',
      name: 'Admin Manager',
      email: 'admin@example.com',
      mobile: '+91-9876543211',
      city: 'Mumbai',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  },
  'owner@example.com': {
    password: 'owner123',
    user: {
      id: 'owner_1',
      name: 'Gym Owner',
      email: 'owner@example.com',
      mobile: '+91-9876543212',
      city: 'Delhi',
      role: 'owner',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner',
    },
  },
  'trainer@example.com': {
    password: 'trainer123',
    user: {
      id: 'trainer_1',
      name: 'Fitness Trainer',
      email: 'trainer@example.com',
      mobile: '+91-9876543213',
      city: 'Bangalore',
      role: 'trainer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trainer',
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load auth from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('[v0] Failed to parse saved user:', error);
      }
    }
  }, []);

  const login = (email: string, password: string) => {
    const userRecord = DUMMY_USERS[email];
    if (!userRecord) {
      return { success: false, message: 'User not found. Try user@example.com' };
    }
    if (userRecord.password !== password) {
      return { success: false, message: 'Invalid password' };
    }

    const authUser = userRecord.user;
    localStorage.setItem('auth_user', JSON.stringify(authUser));
    setUser(authUser);
    setIsAuthenticated(true);
    return { success: true, message: 'Login successful' };
  };

  const signup = (data: {
    name: string;
    email: string;
    mobile: string;
    city: string;
    password: string;
    role: UserRole;
  }) => {
    if (DUMMY_USERS[data.email]) {
      return { success: false, message: 'Email already exists' };
    }

    if (!data.password || data.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    const newUser: AuthUser = {
      id: `${data.role}_${Date.now()}`,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      city: data.city,
      role: data.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
    };

    DUMMY_USERS[data.email] = {
      password: data.password,
      user: newUser,
    };

    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
    return { success: true, message: 'Signup successful' };
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
