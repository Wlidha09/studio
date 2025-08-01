import DepartmentTable from "@/components/dashboard/department-table";
import { getDepartments, getEmployees } from "@/lib/firestore";

export default async function DepartmentsPage() {
  const departments = await getDepartments();
  const employees = await getEmployees();
  return (
    <div>
      <DepartmentTable initialDepartments={departments} employees={employees} />
    </div>
  );
}
