import LeaveRequestsTable from "@/components/dashboard/leave-requests-table";
import { leaveRequests, employees } from "@/lib/data";

export default function LeavesPage() {
  return (
    <div>
      <LeaveRequestsTable initialLeaveRequests={leaveRequests} employees={employees} />
    </div>
  );
}
