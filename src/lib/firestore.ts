"use server";

import { db } from './firebase';
import { collection, getDocs, writeBatch, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { employees as initialEmployees, candidates as initialCandidates, departments as initialDepartments, leaveRequests as initialLeaveRequests } from './data';
import type { Employee, Candidate, Department, LeaveRequest } from './types';

// Seed Database
export async function seedDatabase() {
  try {
    const batch = writeBatch(db);

    const employeesCollection = collection(db, 'employees');
    initialEmployees.forEach((employee) => {
      const docRef = doc(employeesCollection, employee.id);
      batch.set(docRef, employee);
    });

    const candidatesCollection = collection(db, 'candidates');
    initialCandidates.forEach((candidate) => {
      const docRef = doc(candidatesCollection, candidate.id);
      batch.set(docRef, candidate);
    });

    const departmentsCollection = collection(db, 'departments');
    initialDepartments.forEach((department) => {
      const docRef = doc(departmentsCollection, department.id);
      batch.set(docRef, department);
    });

    const leaveRequestsCollection = collection(db, 'leaveRequests');
    initialLeaveRequests.forEach((leaveRequest) => {
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

// Get Collections
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


// Employee Functions
export async function addEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
  const docRef = await addDoc(collection(db, 'employees'), { ...employee, createdAt: serverTimestamp() });
  return { id: docRef.id, ...employee };
}

export async function updateEmployee(employee: Employee): Promise<void> {
  const { id, ...data } = employee;
  const docRef = doc(db, 'employees', id);
  await updateDoc(docRef, data);
}

export async function deleteEmployee(id: string): Promise<void> {
  const docRef = doc(db, 'employees', id);
  await deleteDoc(docRef);
}


// Candidate Functions
export async function addCandidate(candidate: Omit<Candidate, 'id'>): Promise<Candidate> {
    const docRef = await addDoc(collection(db, 'candidates'), { ...candidate, createdAt: serverTimestamp() });
    return { id: docRef.id, ...candidate };
}

export async function updateCandidate(candidate: Candidate): Promise<void> {
    const { id, ...data } = candidate;
    const docRef = doc(db, 'candidates', id);
    await updateDoc(docRef, data);
}

export async function deleteCandidate(id: string): Promise<void> {
    const docRef = doc(db, 'candidates', id);
    await deleteDoc(docRef);
}


// Department Functions
export async function addDepartment(department: Omit<Department, 'id'>): Promise<Department> {
    const docRef = await addDoc(collection(db, 'departments'), { ...department, createdAt: serverTimestamp() });
    return { id: docRef.id, ...department };
}

export async function updateDepartment(department: Department): Promise<void> {
    const { id, ...data } = department;
    const docRef = doc(db, 'departments', id);
    await updateDoc(docRef, data);
}

export async function deleteDepartment(id: string): Promise<void> {
    const docRef = doc(db, 'departments', id);
    await deleteDoc(docRef);
}


// Leave Request Functions
export async function addLeaveRequest(leaveRequest: Omit<LeaveRequest, 'id'>): Promise<LeaveRequest> {
    const docRef = await addDoc(collection(db, 'leaveRequests'), { ...leaveRequest, createdAt: serverTimestamp() });
    return { id: docRef.id, ...leaveRequest };
}

export async function updateLeaveRequestStatus(id: string, status: LeaveRequest['status']): Promise<void> {
    const docRef = doc(db, 'leaveRequests', id);
    await updateDoc(docRef, { status });
}
