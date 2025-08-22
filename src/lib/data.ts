
import { Employee, Candidate, Department, LeaveRequest } from "./types";

export const employees: Omit<Employee, 'id'>[] = [
  { name: "Hannah Montana", email: "hannah.montana@hresource.com", role: "Owner", department: "Executive", avatar: "https://placehold.co/40x40.png?text=HM", hireDate: "2019-01-01", birthDate: "1980-01-01", actif: true, fcmToken: "token-hannah-montana" },
  { name: "Alice Johnson", email: "alice.johnson@hresource.com", role: "Manager", department: "Engineering", avatar: "https://placehold.co/40x40.png?text=AJ", hireDate: "2022-01-15", birthDate: "1988-05-20", actif: true, managerName: "Hannah Montana", fcmToken: "token-alice-johnson" },
  { name: "Bob Williams", email: "bob.williams@hresource.com", role: "Employee", department: "Engineering", avatar: "https://placehold.co/40x40.png?text=BW", hireDate: "2022-03-10", birthDate: "1992-11-30", actif: true, managerName: "Alice Johnson", fcmToken: "token-bob-williams" },
  { name: "Charlie Brown", email: "charlie.brown@hresource.com", role: "Employee", department: "Engineering", avatar: "https://placehold.co/40x40.png?text=CB", hireDate: "2023-06-01", birthDate: "1995-02-18", actif: true, managerName: "Alice Johnson", fcmToken: "token-charlie-brown" },
  { name: "Diana Prince", email: "diana.prince@hresource.com", role: "Manager", department: "HR", avatar: "https://placehold.co/40x40.png?text=DP", hireDate: "2021-09-20", birthDate: "1985-07-22", actif: true, managerName: "Hannah Montana", fcmToken: "token-diana-prince" },
  { name: "Ethan Hunt", email: "ethan.hunt@hresource.com", role: "RH", department: "HR", avatar: "https://placehold.co/40x40.png?text=EH", hireDate: "2020-11-05", birthDate: "1989-12-15", actif: true, managerName: "Diana Prince", fcmToken: "token-ethan-hunt" },
  { name: "Fiona Glenanne", email: "fiona.glenanne@hresource.com", role: "Manager", department: "Marketing", avatar: "https://placehold.co/40x40.png?text=FG", hireDate: "2022-02-18", birthDate: "1990-08-10", actif: false, managerName: "Hannah Montana", fcmToken: "token-fiona-glenanne" },
  { name: "George Costanza", email: "george.costanza@hresource.com", role: "Employee", department: "Marketing", avatar: "https://placehold.co/40x40.png?text=GC", hireDate: "2023-08-21", birthDate: "1993-04-05", actif: true, managerName: "Fiona Glenanne", fcmToken: "token-george-costanza" },
  { name: "Ian Malcolm", email: "ian.malcolm@hresource.com", role: "Dev", department: "Dev", avatar: "https://placehold.co/40x40.png?text=IM", hireDate: "2024-01-10", birthDate: "1982-03-03", isDev: true, actif: true, managerName: "Hannah Montana", fcmToken: "token-ian-malcolm" },
];

export const candidates: Omit<Candidate, 'id'>[] = [
  { name: "Jack Sparrow", email: "jack.sparrow@hresource.com", status: "Interviewing", appliedRole: "Frontend Developer", avatar: "https://placehold.co/40x40.png?text=JS" },
  { name: "Kara Danvers", email: "kara.danvers@hresource.com", status: "Applied", appliedRole: "UX Designer", avatar: "https://placehold.co/40x40.png?text=KD" },
  { name: "Luke Skywalker", email: "luke.skywalker@hresource.com", status: "Offered", appliedRole: "Backend Developer", avatar: "https://placehold.co/40x40.png?text=LS" },
  { name: "Marge Simpson", email: "marge.simpson@hresource.com", status: "Hired", appliedRole: "HR Coordinator", avatar: "https://placehold.co/40x40.png?text=MS" },
  { name: "Ned Stark", email: "ned.stark@hresource.com", status: "Rejected", appliedRole: "Project Manager", avatar: "https://placehold.co/40x40.png?text=NS" },
];

export const departments: Omit<Department, 'id'>[] = [
  { name: "Engineering", teamLeader: "Alice Johnson" },
  { name: "HR", teamLeader: "Diana Prince" },
  { name: "Marketing", teamLeader: "Fiona Glenanne" },
  { name: "Executive", teamLeader: "Hannah Montana" },
  { name: "Dev", teamLeader: "Ian Malcolm" },
];

export const leaveRequests: Omit<LeaveRequest, 'id'>[] = [
  { employeeId: "2", leaveType: "Vacation", startDate: "2024-08-20", endDate: "2024-08-25", status: "Pending", createdAt: "2024-07-15" },
  { employeeId: "3", leaveType: "Sick Leave", startDate: "2024-07-22", endDate: "2024-07-22", status: "Approved", createdAt: "2024-07-20" },
  { employeeId: "7", leaveType: "Personal", startDate: "2024-09-01", endDate: "2024-09-02", status: "Rejected", createdAt: "2024-08-01" },
  { employeeId: "5", leaveType: "Vacation", startDate: "2024-10-10", endDate: "2024-10-20", status: "Pending", createdAt: "2024-08-10" },
];
