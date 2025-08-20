import LeaveRequestsTable from "@/components/dashboard/leave-requests-table";
import { getLeaveRequests, getEmployees, getDepartments } from "@/lib/firestore";

export default async function LeavesPage() {
  const leaveRequests = await getLeaveRequests();
  const employees = await getEmployees();
  const departments = await getDepartments();
  return (
    <LeaveRequestsTable
      initialLeaveRequests={leaveRequests}
      employees={employees}
      departments={departments}
    />
  );
}
