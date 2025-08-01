import LeaveRequestsTable from "@/components/dashboard/leave-requests-table";
import { getLeaveRequests, getEmployees } from "@/lib/firestore";

export default async function LeavesPage() {
  const leaveRequests = await getLeaveRequests();
  const employees = await getEmployees();
  return (
    <div>
      <LeaveRequestsTable initialLeaveRequests={leaveRequests} employees={employees} />
    </div>
  );
}
