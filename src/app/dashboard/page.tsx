import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserCircle, Building2, CalendarClock, CalendarCheck } from "lucide-react";
import { getEmployees, getCandidates, getDepartments, getLeaveRequests } from "@/lib/firestore";
import { differenceInDays, parseISO } from 'date-fns';

export default async function DashboardOverview() {
  const employees = await getEmployees();
  const candidates = await getCandidates();
  const departments = await getDepartments();
  const leaveRequests = await getLeaveRequests();

  const totalEmployees = employees.length;
  const totalCandidates = candidates.length;
  const totalDepartments = departments.length;
  const pendingLeaves = leaveRequests.filter(lr => lr.status === 'Pending').length;

  const currentMonth = new Date().getMonth() + 1;
  const totalAccruedLeave = currentMonth * 1.75;

  const approvedLeaveDays = leaveRequests
    .filter(lr => lr.status === 'Approved')
    .reduce((total, lr) => {
      // Assuming YYYY-MM-DD format from the database
      const startDate = parseISO(lr.startDate);
      const endDate = parseISO(lr.endDate);
      const days = differenceInDays(endDate, startDate) + 1;
      return total + days;
    }, 0);

  const leaveDaysLeft = totalAccruedLeave - approvedLeaveDays;


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmployees}</div>
          <p className="text-xs text-muted-foreground">+2 since last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Candidates</CardTitle>
          <UserCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCandidates}</div>
          <p className="text-xs text-muted-foreground">{candidates.filter(c => c.status === 'Applied').length} new applications</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingLeaves}</div>
          <p className="text-xs text-muted-foreground">For approval</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Leave Days Left</CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{leaveDaysLeft.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Accrued this year</p>
        </CardContent>
      </Card>
    </div>
  );
}
