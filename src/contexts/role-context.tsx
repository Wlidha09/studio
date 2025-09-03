

"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './auth-context';

interface RoleContextType {
  role: string;
  setRole: (role: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string>('Employee'); // Default to least privileged
  const { employee, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to finish loading
    }
    
    if (employee) {
        if (employee.isDev) {
            setRole('Dev');
        } else if (employee.isHr) {
            setRole('RH');
        } else if (employee.role) {
            setRole(employee.role);
        } else {
            setRole('Employee');
        }
    } else {
        setRole('Employee'); // Default for logged-out users
    }
  }, [employee, authLoading]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
