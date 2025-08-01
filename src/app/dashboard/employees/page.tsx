import EmployeeTable from "@/components/dashboard/employee-table";
import { getEmployees } from "@/lib/firestore";

export default async function EmployeesPage() {
  const employees = await getEmployees();
  return (
    <div>
      <EmployeeTable initialEmployees={employees} />
    </div>
  );
}
