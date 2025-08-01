import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserCircle, Building2, CalendarClock } from "lucide-react";
import { getEmployees, getCandidates, getDepartments, getLeaveRequests } from "@/lib/firestore";

export default async function DashboardOverview() {
  const employees = await getEmployees();
  const candidates = await getCandidates();
  const departments = await getDepartments();
  const leaveRequests = await getLeaveRequests();

  const totalEmployees = employees.length;
  const totalCandidates = candidates.length;
  const totalDepartments = departments.length;
  const pendingLeaves = leaveRequests.filter(lr => lr.status === 'Pending').length;

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
          <CardTitle className="text-sm font-medium">Departments</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDepartments}</div>
          <p className="text-xs text-muted-foreground">1 new department added</p>
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
    </div>
  );
}
