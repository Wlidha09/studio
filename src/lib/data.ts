import { Employee, Candidate, Department, LeaveRequest } from "./types";

export const employees: Omit<Employee, 'id'>[] = [
  { name: "Alice Johnson", email: "alice.j@example.com", role: "Manager", department: "Engineering", avatar: "/avatars/01.png", hireDate: "2022-01-15", birthDate: "1988-05-20", actif: true },
  { name: "Bob Williams", email: "bob.w@example.com", role: "Employee", department: "Engineering", avatar: "/avatars/02.png", hireDate: "2022-03-10", birthDate: "1992-11-30", actif: true },
  { name: "Charlie Brown", email: "charlie.b@example.com", role: "Employee", department: "Engineering", avatar: "/avatars/03.png", hireDate: "2023-06-01", birthDate: "1995-02-18", actif: true },
  { name: "Diana Prince", email: "diana.p@example.com", role: "Manager", department: "HR", avatar: "/avatars/04.png", hireDate: "2021-09-20", birthDate: "1985-07-22", actif: true },
  { name: "Ethan Hunt", email: "ethan.h@example.com", role: "RH", department: "HR", avatar: "/avatars/05.png", hireDate: "2020-11-05", birthDate: "1989-12-15", actif: true },
  { name: "Fiona Glenanne", email: "fiona.g@example.com", role: "Manager", department: "Marketing", avatar: "/avatars/06.png", hireDate: "2022-02-18", birthDate: "1990-08-10", actif: false },
  { name: "George Costanza", email: "george.c@example.com", role: "Employee", department: "Marketing", avatar: "/avatars/07.png", hireDate: "2023-08-21", birthDate: "1993-04-05", actif: true },
  { name: "Hannah Montana", email: "hannah.m@example.com", role: "Owner", department: "Executive", avatar: "/avatars/08.png", hireDate: "2019-01-01", birthDate: "1980-01-01", actif: true },
  { name: "Ian Malcolm", email: "ian.m@example.com", role: "Dev", department: "Dev", avatar: "/avatars/09.png", hireDate: "2024-01-10", birthDate: "1982-03-03", isDev: true, actif: true },
];

export const candidates: Omit<Candidate, 'id'>[] = [
  { name: "Jack Sparrow", email: "jack.s@pirates.com", status: "Interviewing", appliedRole: "Frontend Developer", avatar: "/avatars/10.png" },
  { name: "Kara Danvers", email: "kara.d@catco.com", status: "Applied", appliedRole: "UX Designer", avatar: "/avatars/11.png" },
  { name: "Luke Skywalker", email: "luke.s@rebellion.org", status: "Offered", appliedRole: "Backend Developer", avatar: "/avatars/12.png" },
  { name: "Marge Simpson", email: "marge.s@evergreen.com", status: "Hired", appliedRole: "HR Coordinator", avatar: "/avatars/13.png" },
  { name: "Ned Stark", email: "ned.s@winterfell.gov", status: "Rejected", appliedRole: "Project Manager", avatar: "/avatars/14.png" },
];

export const departments: Omit<Department, 'id'>[] = [
  { name: "Engineering", teamLeader: "Alice Johnson" },
  { name: "HR", teamLeader: "Diana Prince" },
  { name: "Marketing", teamLeader: "Fiona Glenanne" },
  { name: "Executive", teamLeader: "Hannah Montana" },
  { name: "Dev", teamLeader: "Ian Malcolm" },
];

export const leaveRequests: Omit<LeaveRequest, 'id'>[] = [
  { employeeName: "Bob Williams", employeeId: "2", leaveType: "Vacation", startDate: "2024-08-20", endDate: "2024-08-25", status: "Pending" },
  { employeeName: "Charlie Brown", employeeId: "3", leaveType: "Sick Leave", startDate: "2024-07-22", endDate: "2024-07-22", status: "Approved" },
  { employeeName: "George Costanza", employeeId: "7", leaveType: "Personal", startDate: "2024-09-01", endDate: "2024-09-02", status: "Rejected" },
  { employeeName: "Ethan Hunt", employeeId: "5", leaveType: "Vacation", startDate: "2024-10-10", endDate: "2024-10-20", status: "Pending" },
];
