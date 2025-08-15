

"use server";

import { db } from './firebase';
import { collection, getDocs, writeBatch, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp, query, where, getDoc } from 'firebase/firestore';
import { employees as initialEmployees, candidates as initialCandidates, departments as initialDepartments, leaveRequests as initialLeaveRequests } from './data';
import type { Employee, Candidate, Department, LeaveRequest, Holiday, WorkSchedule, UserRole } from './types';
import { getMessaging } from "firebase-admin/messaging";
import { adminApp } from './firebase-admin';


// Helper function to convert Firestore Timestamps to strings
const convertDocTimestamps = (doc: any) => {
  const data = doc.data();
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      // Return ISO string for dates
      data[key] = data[key].toDate().toISOString().split('T')[0];
    }
  }
  return { id: doc.id, ...data };
};

// Seed Database
export async function seedDatabase() {
  try {
    const collectionsToClear = ['employees', 'candidates', 'departments', 'leaveRequests', 'holidays', 'workSchedules'];
    const batch = writeBatch(db);

    // Clear existing data in collections
    for (const collectionName of collectionsToClear) {
        const querySnapshot = await getDocs(collection(db, collectionName));
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
    }

    const employeesCollection = collection(db, 'employees');
    initialEmployees.forEach((employee) => {
      const docRef = doc(employeesCollection);
      batch.set(docRef, {...employee, createdAt: serverTimestamp()});
    });

    const candidatesCollection = collection(db, 'candidates');
    initialCandidates.forEach((candidate) => {
      const docRef = doc(candidatesCollection);
      batch.set(docRef, {...candidate, createdAt: serverTimestamp()});
    });

    const departmentsCollection = collection(db, 'departments');
    initialDepartments.forEach((department) => {
      const docRef = doc(departmentsCollection);
      batch.set(docRef, {...department, createdAt: serverTimestamp()});
    });

    const leaveRequestsCollection = collection(db, 'leaveRequests');
    initialLeaveRequests.forEach((leaveRequest) => {
      const docRef = doc(leaveRequestsCollection);
      batch.set(docRef, {...leaveRequest, createdAt: serverTimestamp()});
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
  return querySnapshot.docs.map(doc => convertDocTimestamps(doc) as Employee);
}

export async function getCandidates(): Promise<Candidate[]> {
    const querySnapshot = await getDocs(collection(db, 'candidates'));
    return querySnapshot.docs.map(doc => convertDocTimestamps(doc) as Candidate);
}

export async function getDepartments(): Promise<Department[]> {
    const querySnapshot = await getDocs(collection(db, 'departments'));
    return querySnapshot.docs.map(doc => convertDocTimestamps(doc) as Department);
}

export async function getLeaveRequests(): Promise<LeaveRequest[]> {
    const querySnapshot = await getDocs(collection(db, 'leaveRequests'));
    return querySnapshot.docs.map(doc => {
      const data = convertDocTimestamps(doc);
      // Omit employeeName from the returned object for this specific case
      const { ...rest } = data;
      return rest;
    }) as LeaveRequest[];
}


// Employee Functions
export async function addEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
  const docRef = await addDoc(collection(db, 'employees'), { ...employee, createdAt: serverTimestamp() });
  const newDoc = await getDoc(docRef);
  return convertDocTimestamps(newDoc) as Employee;
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

export async function getEmployeeByEmail(email: string): Promise<Employee | null> {
    const q = query(collection(db, 'employees'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    const doc = querySnapshot.docs[0];
    return convertDocTimestamps(doc) as Employee;
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
    const docRef = doc(db, 'employees', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return convertDocTimestamps(docSnap) as Employee;
    }
    return null;
}

export async function getEmployeeDepartment(employeeId: string): Promise<string | null> {
    const employee = await getEmployeeById(employeeId);
    return employee ? employee.department : null;
}


// Candidate Functions
export async function addCandidate(candidate: Omit<Candidate, 'id'>): Promise<Candidate> {
    const docRef = await addDoc(collection(db, 'candidates'), { ...candidate, createdAt: serverTimestamp() });
    const newDoc = await getDoc(docRef);
    return convertDocTimestamps(newDoc) as Candidate;
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
    const newDoc = await getDoc(docRef);
    return convertDocTimestamps(newDoc) as Department;
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
    const newDocSnap = await getDoc(docRef);
    return convertDocTimestamps(newDocSnap) as LeaveRequest;
}

export async function updateLeaveRequestStatus(id: string, status: LeaveRequest['status']): Promise<void> {
    const docRef = doc(db, 'leaveRequests', id);
    await updateDoc(docRef, { status });
}

// Holiday Functions
export async function getHolidays(year: number): Promise<Holiday[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const q = query(
        collection(db, 'holidays'),
        where('date', '>=', startDate.toISOString().split('T')[0]),
        where('date', '<=', endDate.toISOString().split('T')[0])
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => convertDocTimestamps(doc) as Holiday);
}

export async function addHoliday(holiday: Omit<Holiday, 'id'>): Promise<Holiday> {
    const docRef = await addDoc(collection(db, 'holidays'), { ...holiday, createdAt: serverTimestamp() });
    const newDoc = await getDoc(docRef);
    return convertDocTimestamps(newDoc) as Holiday;
}

export async function updateHoliday(holiday: Holiday): Promise<void> {
  const { id, ...data } = holiday;
  const docRef = doc(db, 'holidays', id);
  await updateDoc(docRef, data);
}

export async function addHolidays(holidays: Omit<Holiday, 'id'>[], year: number): Promise<void> {
  const batch = writeBatch(db);
  const holidaysCollection = collection(db, 'holidays');

  // To avoid duplicates, we can fetch existing holidays for the year and check against them.
  const existingHolidays = await getHolidays(year);
  const existingDates = new Set(existingHolidays.map(h => h.date));

  holidays.forEach((holiday) => {
    if (!existingDates.has(holiday.date)) {
        const docRef = doc(holidaysCollection);
        batch.set(docRef, {...holiday, createdAt: serverTimestamp()});
    }
  });

  await batch.commit();
}

export async function deleteHoliday(id: string): Promise<void> {
    const docRef = doc(db, 'holidays', id);
    await deleteDoc(docRef);
}

export async function updateHolidayPaidStatus(id: string, paid: boolean): Promise<void> {
    const docRef = doc(db, 'holidays', id);
    await updateDoc(docRef, { paid });
}

// Work Schedule Functions
export async function getWorkSchedules(): Promise<WorkSchedule[]> {
    const querySnapshot = await getDocs(collection(db, 'workSchedules'));
    return querySnapshot.docs.map(doc => convertDocTimestamps(doc) as WorkSchedule);
}

export async function addWorkSchedule(schedule: Omit<WorkSchedule, 'id'>): Promise<WorkSchedule> {
  const docRef = await addDoc(collection(db, 'workSchedules'), { ...schedule, createdAt: serverTimestamp() });
  const newDoc = await getDoc(docRef);
  return convertDocTimestamps(newDoc) as WorkSchedule;
}

// Roles Functions
export async function getRoles(): Promise<UserRole[]> {
  const querySnapshot = await getDocs(collection(db, 'roles'));
  return querySnapshot.docs.map(doc => convertDocTimestamps(doc) as UserRole);
}

export async function addRole(role: Omit<UserRole, 'id'>): Promise<UserRole> {
  const docRef = await addDoc(collection(db, 'roles'), { ...role, createdAt: serverTimestamp() });
  const newDoc = await getDoc(docRef);
  return convertDocTimestamps(newDoc) as UserRole;
}

export async function updateRole(role: UserRole): Promise<void> {
  const { id, ...data } = role;
  const docRef = doc(db, 'roles', id);
  await updateDoc(docRef, data);
}

export async function deleteRole(id: string): Promise<void> {
  const docRef = doc(db, 'roles', id);
  await deleteDoc(docRef);
}


// Notification Functions
export async function sendNotification(token: string, title: string, body: string) {
    if (!token) {
        console.error("FCM token is missing.");
        return;
    }
    const message = {
        notification: { title, body },
        token: token,
    };

    try {
        // await getMessaging(adminApp).send(message);
    } catch (error) {
        console.error("Error sending notification:", error);
    }
}
