
"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from '@/lib/auth';
import { getEmployeeByEmail } from '@/lib/firestore';
import type { User } from 'firebase/auth';
import type { Employee } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  employee: Employee | null;
  loading: boolean;
  setEmployee: (employee: Employee | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const employeeData = await getEmployeeByEmail(user.email!);
          setEmployee(employeeData);
        } catch (error) {
            console.error("Failed to fetch employee data", error);
            setEmployee(null);
        }
      } else {
        setEmployee(null);
        if (pathname !== "/login" && !pathname.startsWith('/_next/')) {
            router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);
  
  return (
    <AuthContext.Provider value={{ user, employee, loading, setEmployee }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
