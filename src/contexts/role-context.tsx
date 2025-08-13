
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './auth-context';
import { getEmployeeByEmail } from '@/lib/firestore';

interface RoleContextType {
  role: string;
  setRole: (role: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string>('Employee'); // Default to least privileged
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserRole() {
        if(user && user.email) {
            const employee = await getEmployeeByEmail(user.email);
            if(employee) {
                if (employee.isDev) {
                    setRole('Dev');
                } else if (employee.role) {
                    setRole(employee.role);
                }
            }
        }
    }
    fetchUserRole();
  }, [user])

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
