

"use server";

import { db } from './firebase';
import { collection, getDocs, writeBatch, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp, query, where, getDoc, runTransaction } from 'firebase/firestore';
import { employees as initialEmployees, candidates as initialCandidates, departments as initialDepartments, leaveRequests as initialLeaveRequests } from './data';
import type { Employee, Candidate, Department, LeaveRequest, Holiday, WorkSchedule, UserRole, ErrorLog } from './types';
import { getMessaging } from "firebase-admin/messaging";
import { adminApp } from './firebase-admin';


// Helper function to convert Firestore Timestamps to strings
const convertDocTimestamps = (doc: any) => {
  const data = doc.data();
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      // Return ISO string for dates
      data[key] = data[key].toDate().toISOString();
    }
  }
  return { id: doc.id, ...data };
};

// Seed Database
export async function seedDatabase() {
  try {
    const collectionsToClear = ['employees', 'candidates', 'departments', 'leaveRequests', 'holidays', 'workSchedules', 'errors'];
    const batch = writeBatch(db);

    // Clear existing data in collections
    for (const collectionName of collectionsToClear) {
        console.log(`Clearing collection: ${collectionName}`);
        const querySnapshot = await getDocs(collection(db, collectionName));
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
    }

    console.log("Seeding employees...");
    const employeesCollection = collection(db, 'employees');
    initialEmployees.forEach((employee) => {
      const docRef = doc(employeesCollection);
      batch.set(docRef, {...employee, createdAt: serverTimestamp()});
    });

    console.log("Seeding candidates...");
    const candidatesCollection = collection(db, 'candidates');
    initialCandidates.forEach((candidate) => {
      const docRef = doc(candidatesCollection);
      batch.set(docRef, {...candidate, createdAt: serverTimestamp()});
    });

    console.log("Seeding departments...");
    const departmentsCollection = collection(db, 'departments');
    initialDepartments.forEach((department) => {
      const docRef = doc(departmentsCollection);
      batch.set(docRef, {...department, createdAt: serverTimestamp()});
    });

    console.log("Seeding leave requests...");
    const leaveRequestsCollection = collection(db, 'leaveRequests');
    initialLeaveRequests.forEach((leaveRequest) => {
      const docRef = doc(leaveRequestsCollection);
      batch.set(docRef, {...leaveRequest, createdAt: serverTimestamp()});
    });

    await batch.commit();
    console.log("Database seeding complete.");
    return { success: true, message: 'Database seeded successfully!' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: 'Failed to seed database.' };
  }
}

// Get Collections
export async function getEmployees(): Promise<Employee[]> {
  console.log("API Request: Fetching all employees from Firestore.");
  const querySnapshot = await getDocs(collection(db, 'employees'));
  const employees = querySnapshot.docs.map(doc => convertDocTimestamps(doc) as Employee);
  console.log(`API Response: Found ${employees.length} employees.`);
  return employees;
}

export async function getCandidates(): Promise<Candidate[]> {
    console.log("API Request: Fetching all candidates from Firestore.");
    const querySnapshot = await getDocs(collection(db, 'candidates'));
    const candidates = querySnapshot.docs.map(doc => convertDocTimestamps(doc) as Candidate);
    console.log(`API Response: Found ${candidates.length} candidates.`);
    return candidates;
}

export async function getDepartments(): Promise<Department[]> {
    console.log("API Request: Fetching all departments from Firestore.");
    const querySnapshot = await getDocs(collection(db, 'departments'));
    const departments = querySnapshot.docs.map(doc => convertDocTimestamps(doc) as Department);
    console.log(`API Response: Found ${departments.length} departments.`);
    return departments;
}

export async function getLeaveRequests(): Promise<LeaveRequest[]> {
    console.log("API Request: Fetching all leave requests from Firestore.");
    const querySnapshot = await getDocs(collection(db, 'leaveRequests'));
    const requests = querySnapshot.docs.map(doc => {
        const data = convertDocTimestamps(doc);
        const employee = {
            ...data,
            employeeName: data.employeeName || "Unknown"
        };
        return employee as LeaveRequest;
    });
    console.log(`API Response: Found ${requests.length} leave requests.`);
    return requests;
}


// Employee Functions
export async function addEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
  console.log(`API Request: Adding new employee '${employee.name}'.`);
  const docRef = await addDoc(collection(db, 'employees'), { ...employee, createdAt: serverTimestamp() });
  const newDoc = await getDoc(docRef);
  return convertDocTimestamps(newDoc) as Employee;
}

export async function updateEmployee(employee: Employee): Promise<void> {
  const { id, ...data } = employee;
  console.log(`API Request: Updating employee with ID '${id}'.`);
  const docRef = doc(db, 'employees', id);
  await updateDoc(docRef, data);
}

export async function deleteEmployee(id: string): Promise<void> {
  console.log(`API Request: Deleting employee with ID '${id}'.`);
  const docRef = doc(db, 'employees', id);
  await deleteDoc(docRef);
}

export async function getEmployeeByEmail(email: string): Promise<Employee | null> {
    console.log(`API Request: Fetching employee by email '${email}'.`);
    const q = query(collection(db, 'employees'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        console.log(`API Response: No employee found with email '${email}'.`);
        return null;
    }
    const doc = querySnapshot.docs[0];
    return convertDocTimestamps(doc) as Employee;
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
    console.log(`API Request: Fetching employee by ID '${id}'.`);
    const docRef = doc(db, 'employees', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return convertDocTimestamps(docSnap) as Employee;
    }
    console.log(`API Response: No employee found with ID '${id}'.`);
    return null;
}

export async function getEmployeeDepartment(employeeId: string): Promise<string | null> {
    console.log(`API Request: Fetching department for employee ID '${employeeId}'.`);
    const employee = await getEmployeeById(employeeId);
    return employee ? employee.department : null;
}


// Candidate Functions
export async function addCandidate(candidate: Omit<Candidate, 'id'>): Promise<Candidate> {
    console.log(`API Request: Adding new candidate '${candidate.name}'.`);
    const docRef = await addDoc(collection(db, 'candidates'), { ...candidate, createdAt: serverTimestamp() });
    const newDoc = await getDoc(docRef);
    return convertDocTimestamps(newDoc) as Candidate;
}

export async function updateCandidate(candidate: Candidate): Promise<void> {
    const { id, ...data } = candidate;
    console.log(`API Request: Updating candidate with ID '${id}'.`);
    const docRef = doc(db, 'candidates', id);
    await updateDoc(docRef, data);
}

export async function deleteCandidate(id: string): Promise<void> {
    console.log(`API Request: Deleting candidate with ID '${id}'.`);
    const docRef = doc(db, 'candidates', id);
    await deleteDoc(docRef);
}


// Department Functions
export async function addDepartment(department: Omit<Department, 'id'>): Promise<Department> {
    console.log(`API Request: Adding new department '${department.name}'.`);
    const docRef = await addDoc(collection(db, 'departments'), { ...department, createdAt: serverTimestamp() });
    const newDoc = await getDoc(docRef);
    return convertDocTimestamps(newDoc) as Department;
}

export async function updateDepartment(department: Department): Promise<void> {
    const { id, ...data } = department;
    console.log(`API Request: Updating department with ID '${id}'.`);
    const docRef = doc(db, 'departments', id);
    await updateDoc(docRef, data);
}

export async function deleteDepartment(id: string): Promise<void> {
    console.log(`API Request: Deleting department with ID '${id}'.`);
    const docRef = doc(db, 'departments', id);
    await deleteDoc(docRef);
}


// Leave Request Functions
export async function addLeaveRequest(leaveRequest: Omit<LeaveRequest, 'id'>): Promise<LeaveRequest> {
    console.log(`API Request: Adding new leave request for employee ID '${leaveRequest.employeeId}'.`);
    const docRef = await addDoc(collection(db, 'leaveRequests'), { ...leaveRequest, createdAt: serverTimestamp() });
    const newDocSnap = await getDoc(docRef);
    return convertDocTimestamps(newDocSnap) as LeaveRequest;
}

export async function updateLeaveRequestStatus(id: string, status: LeaveRequest['status']): Promise<void> {
    console.log(`API Request: Updating leave request status for ID '${id}' to '${status}'.`);
    const docRef = doc(db, 'leaveRequests', id);
    await updateDoc(docRef, { status });
}

// Holiday Functions
export async function getHolidays(year: number): Promise<Holiday[]> {
    console.log(`API Request: Fetching holidays for year ${year}.`);
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const q = query(
        collection(db, 'holidays'),
        where('date', '>=', startDate.toISOString().split('T')[0]),
        where('date', '<=', endDate.toISOString().split('T')[0])
    );
    const querySnapshot = await getDocs(q);
    const holidays = querySnapshot.docs.map(doc => convertDocTimestamps(doc) as Holiday);
    console.log(`API Response: Found ${holidays.length} holidays for ${year}.`);
    return holidays;
}

export async function addHoliday(holiday: Omit<Holiday, 'id'>): Promise<Holiday> {
    console.log(`API Request: Adding new holiday '${holiday.name}'.`);
    const docRef = await addDoc(collection(db, 'holidays'), { ...holiday, createdAt: serverTimestamp() });
    const newDoc = await getDoc(docRef);
    return convertDocTimestamps(newDoc) as Holiday;
}

export async function updateHoliday(holiday: Holiday): Promise<void> {
  const { id, ...data } = holiday;
  console.log(`API Request: Updating holiday with ID '${id}'.`);
  const docRef = doc(db, 'holidays', id);
  await updateDoc(docRef, data);
}

export async function addHolidays(holidays: Omit<Holiday, 'id'>[], year: number): Promise<void> {
  console.log(`API Request: Batch adding ${holidays.length} holidays for ${year}.`);
  const batch = writeBatch(db);
  const holidaysCollection = collection(db, 'holidays');

  const existingHolidays = await getHolidays(year);
  const existingDates = new Set(existingHolidays.map(h => h.date));
  
  let addedCount = 0;
  holidays.forEach((holiday) => {
    if (!existingDates.has(holiday.date)) {
        const docRef = doc(holidaysCollection);
        batch.set(docRef, {...holiday, createdAt: serverTimestamp()});
        addedCount++;
    }
  });

  await batch.commit();
  console.log(`API Response: Added ${addedCount} new holidays.`);
}

export async function deleteHoliday(id: string): Promise<void> {
    console.log(`API Request: Deleting holiday with ID '${id}'.`);
    const docRef = doc(db, 'holidays', id);
    await deleteDoc(docRef);
}

export async function updateHolidayPaidStatus(id: string, paid: boolean): Promise<void> {
    console.log(`API Request: Updating paid status for holiday ID '${id}' to ${paid}.`);
    const docRef = doc(db, 'holidays', id);
    await updateDoc(docRef, { paid });
}

// Work Schedule Functions
export async function getWorkSchedules(): Promise<WorkSchedule[]> {
    console.log("API Request: Fetching all work schedules from Firestore.");
    const querySnapshot = await getDocs(collection(db, 'workSchedules'));
    const schedules = querySnapshot.docs.map(doc => convertDocTimestamps(doc) as WorkSchedule);
    console.log(`API Response: Found ${schedules.length} work schedules.`);
    return schedules;
}

export async function addWorkSchedule(schedule: Omit<WorkSchedule, 'id'>): Promise<WorkSchedule> {
  console.log(`API Request: Adding new work schedule for employee ID '${schedule.employeeId}'.`);
  const docRef = await addDoc(collection(db, 'workSchedules'), { ...schedule, createdAt: serverTimestamp() });
  const newDoc = await getDoc(docRef);
  return convertDocTimestamps(newDoc) as WorkSchedule;
}

// Roles Functions
export async function getRoles(): Promise<UserRole[]> {
  console.log("API Request: Fetching all roles from Firestore.");
  const querySnapshot = await getDocs(collection(db, 'roles'));
  const roles = querySnapshot.docs.map(doc => convertDocTimestamps(doc) as UserRole);
  console.log(`API Response: Found ${roles.length} roles.`);
  return roles;
}

export async function addRole(role: Omit<UserRole, 'id'>): Promise<UserRole> {
  console.log(`API Request: Adding new role '${role.name}'.`);
  const docRef = await addDoc(collection(db, 'roles'), { ...role, createdAt: serverTimestamp() });
  const newDoc = await getDoc(docRef);
  return convertDocTimestamps(newDoc) as UserRole;
}

export async function updateRole(role: UserRole): Promise<void> {
  const { id, ...data } = role;
  console.log(`API Request: Updating role with ID '${id}'.`);
  const docRef = doc(db, 'roles', id);
  await updateDoc(docRef, data);
}

export async function deleteRole(id: string): Promise<void> {
  console.log(`API Request: Deleting role with ID '${id}'.`);
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
        console.log(`Attempting to send notification to token: ${token}`);
        // The line below is commented out to prevent sending OS-level push notifications.
        // await getMessaging(adminApp).send(message);
        console.log("Notification send function was called (currently commented out).");
    } catch (error) {
        console.error("Error sending notification:", error);
    }
}

// Error Logging Functions
export async function getErrors(): Promise<ErrorLog[]> {
  console.log("API Request: Fetching all error logs from Firestore.");
  const querySnapshot = await getDocs(collection(db, 'errors'));
  const errors = querySnapshot.docs.map(doc => convertDocTimestamps(doc) as ErrorLog);
  console.log(`API Response: Found ${errors.length} error logs.`);
  return errors;
}

export async function addError(errorLog: Omit<ErrorLog, 'id' | 'timestamp' | 'count' | 'status'>): Promise<void> {
  console.log(`API Request: Logging new error for file '${errorLog.file}'.`);
  const errorsRef = collection(db, 'errors');
  const q = query(errorsRef, where("message", "==", errorLog.message), where("file", "==", errorLog.file));

  await runTransaction(db, async (transaction) => {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Error exists, increment count and update timestamp
      const errorDoc = querySnapshot.docs[0];
      const newCount = (errorDoc.data().count || 1) + 1;
      transaction.update(errorDoc.ref, { count: newCount, timestamp: serverTimestamp() });
      console.log(`API Update: Incremented count for existing error.`);
    } else {
      // New error, add it
      const newDocRef = doc(errorsRef);
      transaction.set(newDocRef, { 
        ...errorLog, 
        count: 1, 
        status: 'unresolved', 
        timestamp: serverTimestamp() 
      });
      console.log(`API Update: Created new error log entry.`);
    }
  });
}

export async function updateErrorStatus(id: string, status: ErrorLog['status']): Promise<void> {
    console.log(`API Request: Updating error status for ID '${id}' to '${status}'.`);
    const docRef = doc(db, 'errors', id);
    await updateDoc(docRef, { status });
}
