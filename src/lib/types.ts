

export type UserRole = {
  id: string;
  name: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  hireDate: string;
  birthDate: string;
  isDev?: boolean;
  actif: boolean;
  managerName?: string;
  fcmToken?: string;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  status: "Applied" | "Interviewing" | "Offered" | "Hired" | "Rejected";
  appliedRole: string;
  avatar: string;
};

export type Department = {
  id:string;
  name: string;
  teamLeader: string;
};

export type LeaveRequest = {
  id: string;
  employeeId: string;
  leaveType: "Vacation" | "Sick Leave" | "Personal";
  startDate: string;
  endDate: string;
  status: "Pending" | "ApprovedByManager" | "Approved" | "Rejected";
};

export type Holiday = {
    id: string;
    name: string;
    date: string; // YYYY-MM-DD
    paid: boolean;
};

export type WorkSchedule = {
  id: string;
  employeeId: string;
  employeeName: string;
  dates: string[]; // YYYY-MM-DD format
  submissionDate: string;
}
