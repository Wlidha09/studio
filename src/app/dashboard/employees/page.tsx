import EmployeeTable from "@/components/dashboard/employee-table";
import { getDepartments, getEmployees } from "@/lib/firestore";

export const dynamic = 'force-dynamic';

export default async function EmployeesPage() {
  const employees = await getEmployees();
  const departments = await getDepartments();
  return (
    <div>
      <EmployeeTable initialEmployees={employees} departments={departments} />
    </div>
  );
}
