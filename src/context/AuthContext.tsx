import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthContextType } from '../types';

interface ExtendedAuthContextType extends AuthContextType {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<ExtendedAuthContextType | undefined>(undefined);

// Sample users for demonstration
const sampleUsers: User[] = [
  {
    id: '1',
    email: 'master@school.edu',
    password: 'master123',
    role: 'master_admin',
    firstName: 'Master',
    lastName: 'Administrator',
    isActive: true
  },
  {
    id: '2',
    email: 'admin@school.edu',
    password: 'admin123',
    role: 'admin',
    firstName: 'School',
    lastName: 'Administrator',
    isActive: true
  },
  {
    id: '3',
    email: 'jane.wilson@school.edu',
    password: 'teacher123',
    role: 'teacher',
    firstName: 'Dr. Jane',
    lastName: 'Wilson',
    profileId: '1',
    isActive: true
  },
  {
    id: '4',
    email: 'john.doe@email.com',
    password: 'student123',
    role: 'student',
    firstName: 'John',
    lastName: 'Doe',
    profileId: '1',
    isActive: true
  },
  {
    id: '5',
    email: 'robert.doe@email.com',
    password: 'parent123',
    role: 'parent',
    firstName: 'Robert',
    lastName: 'Doe',
    children: ['1'],
    isActive: true
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(sampleUsers);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email && u.password === password && u.isActive);
    
    if (foundUser) {
      const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const addUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, ...userData } : u
    ));
    
    // Update current user if editing self
    if (user?.id === id) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (id: string) => {
    // Prevent deleting admin users
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete?.role === 'admin') {
      alert('Cannot delete admin users');
      return;
    }
    
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      users,
      login,
      logout,
      isAuthenticated,
      addUser,
      updateUser,
      deleteUser
    }}>
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