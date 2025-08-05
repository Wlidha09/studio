
export type UserRole = "Owner" | "RH" | "Manager" | "Employee" | "Dev";

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
  hireDate: string;
  birthDate: string;
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
  employeeName: string;
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
