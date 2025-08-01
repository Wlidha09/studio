import EmployeeTable from "@/components/dashboard/employee-table";
import { employees } from "@/lib/data";

export default function EmployeesPage() {
  return (
    <div>
      <EmployeeTable initialEmployees={employees} />
    </div>
  );
}
