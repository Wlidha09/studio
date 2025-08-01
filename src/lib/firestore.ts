"use server";

import { db } from './firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { employees, candidates, departments, leaveRequests } from './data';
import type { Employee, Candidate, Department, LeaveRequest } from './types';

export async function seedDatabase() {
  try {
    const batch = writeBatch(db);

    // Seed employees
    const employeesCollection = collection(db, 'employees');
    employees.forEach((employee) => {
      const docRef = doc(employeesCollection, employee.id);
      batch.set(docRef, employee);
    });

    // Seed candidates
    const candidatesCollection = collection(db, 'candidates');
    candidates.forEach((candidate) => {
      const docRef = doc(candidatesCollection, candidate.id);
      batch.set(docRef, candidate);
    });

    // Seed departments
    const departmentsCollection = collection(db, 'departments');
    departments.forEach((department) => {
      const docRef = doc(departmentsCollection, department.id);
      batch.set(docRef, department);
    });

    // Seed leave requests
    const leaveRequestsCollection = collection(db, 'leaveRequests');
    leaveRequests.forEach((leaveRequest) => {
      const docRef = doc(leaveRequestsCollection, leaveRequest.id);
      batch.set(docRef, leaveRequest);
    });

    await batch.commit();
    return { success: true, message: 'Database seeded successfully!' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: 'Failed to seed database.' };
  }
}

export async function getEmployees(): Promise<Employee[]> {
  const querySnapshot = await getDocs(collection(db, 'employees'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
}

export async function getCandidates(): Promise<Candidate[]> {
    const querySnapshot = await getDocs(collection(db, 'candidates'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Candidate));
}

export async function getDepartments(): Promise<Department[]> {
    const querySnapshot = await getDocs(collection(db, 'departments'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
}

export async function getLeaveRequests(): Promise<LeaveRequest[]> {
    const querySnapshot = await getDocs(collection(db, 'leaveRequests'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaveRequest));
}
