import DepartmentTable from "@/components/dashboard/department-table";
import { departments, employees } from "@/lib/data";

export default function DepartmentsPage() {
  return (
    <div>
      <DepartmentTable initialDepartments={departments} employees={employees} />
    </div>
  );
}
