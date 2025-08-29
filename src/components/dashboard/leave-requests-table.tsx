
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import type { LeaveRequest, Employee, Department } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { addLeaveRequest, updateLeaveRequestStatus } from "@/lib/firestore";
import { usePermissions } from "@/hooks/use-permissions";
import { useRole } from "@/contexts/role-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Status = "Pending" | "ApprovedByManager" | "Approved" | "Rejected";

const statusColors: Record<Status, string> = {
  Pending: "bg-yellow-200 text-yellow-800",
  ApprovedByManager: "bg-blue-200 text-blue-800",
  Approved: "bg-green-200 text-green-800",
  Rejected: "bg-red-200 text-red-800",
};

interface LeaveRequestsTableProps {
  initialLeaveRequests: LeaveRequest[];
  employees: Employee[];
  departments: Department[];
}

export default function LeaveRequestsTable({
  initialLeaveRequests,
  employees,
  departments,
}: LeaveRequestsTableProps) {
  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(initialLeaveRequests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { employee: currentUser } = useAuth();
  const { toast } = useToast();
  const { hasPermission } = usePermissions();
  const { role } = useRole();

  const isRH = role === 'RH';
  const isOwner = role === 'Owner';
  const isManager = role === 'Manager';
  const isDev = role === 'Dev';

  const canCreate = hasPermission("leaves", "create");
  const canEdit = hasPermission("leaves", "edit");
  
  const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

  useEffect(() => {
    setLeaveRequests(initialLeaveRequests);
  }, [initialLeaveRequests]);


  const handleStatusChange = async (id: string, status: Status) => {
    try {
      await updateLeaveRequestStatus(id, status);
      setLeaveRequests(
        leaveRequests.map((req) => (req.id === id ? { ...req, status } : req))
      );
      toast({
        title: `Leave Request Updated`,
        description: `The request has been updated to ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update leave request.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      toast({
        title: "Not Authenticated",
        description: "You must be logged in to submit a request.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const leaveData = {
      leaveType: formData.get("leaveType") as LeaveRequest["leaveType"],
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
    };
    
    const isLeader = !!departments.find(d => d.teamLeader === currentUser.name);

    const newRequestData: Omit<LeaveRequest, "id"> = {
      employeeId: currentUser.id,
      status: isLeader ? "ApprovedByManager" : "Pending", // Skip manager approval for leaders
      ...leaveData,
      createdAt: new Date().toISOString(),
    };

    try {
      const newRequest = await addLeaveRequest(newRequestData as Omit<LeaveRequest, 'id'>);
      setLeaveRequests([...leaveRequests, newRequest]);
      toast({
        title: "Leave Request Submitted",
        description: "Your request has been sent for approval.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit leave request.",
        variant: "destructive",
      });
    }

    setIsDialogOpen(false);
  };

  const categorizedRequests = useMemo(() => {
    const defaultCategories = { pending: [], preApproved: [], approved: [], rejected: [] };
    if (!currentUser) return defaultCategories;

    const managerDepartmentName = isManager ? departments.find(d => d.teamLeader === currentUser.name)?.name : undefined;

    const visibleRequests = leaveRequests.filter(request => {
      // Owner, HR, and Dev can see all requests
      if (isOwner || isRH || isDev) {
        return true;
      }
      
      const employeeOfRequest = employeeMap.get(request.employeeId);
      const isMyRequest = request.employeeId === currentUser.id;

      // Manager can see their own requests and pending requests from their team
      if (isManager) {
        const isMyTeamRequest = employeeOfRequest?.department === managerDepartmentName;
        return isMyRequest || (isMyTeamRequest && request.status === 'Pending');
      }
      
      // Default employee can only see their own requests
      return isMyRequest;
    });
    
    return leaveRequests.reduce((acc, request) => {
        const isVisibleToCurrentUser = () => {
            if (isOwner || isRH || isDev) return true;
            if (isManager) {
                const requestingEmployee = employeeMap.get(request.employeeId);
                const isMyTeam = requestingEmployee?.department === managerDepartmentName;
                // A manager can see their own requests, plus their team's requests that are pending.
                return request.employeeId === currentUser.id || (isMyTeam && request.status === 'Pending');
            }
            // Regular employees can only see their own requests.
            return request.employeeId === currentUser.id;
        };

        if (isVisibleToCurrentUser()) {
            if (request.status === "Pending") acc.pending.push(request);
            else if (request.status === "ApprovedByManager") acc.preApproved.push(request);
            else if (request.status === "Approved") acc.approved.push(request);
            else if (request.status === "Rejected") acc.rejected.push(request);
        }

        return acc;
    }, defaultCategories);

  }, [leaveRequests, currentUser, role, employeeMap, departments, isOwner, isRH, isManager, isDev]);


  const getManagerApprovalAction = (request: LeaveRequest) => {
    if (!currentUser || !isManager || request.status !== 'Pending') return null;

    const requestingEmployee = employeeMap.get(request.employeeId);
    if (!requestingEmployee || requestingEmployee.id === currentUser.id) return null;

    const managerDepartmentName = departments.find(d => d.teamLeader === currentUser.name)?.name;
    const employeeDepartment = requestingEmployee.department;
    
    if (managerDepartmentName === employeeDepartment) {
      return (
        <DropdownMenuItem onClick={() => handleStatusChange(request.id, "ApprovedByManager")}>
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          Approve (Manager)
        </DropdownMenuItem>
      );
    }
    
    return null;
  }
  
  const getRHApprovalAction = (request: LeaveRequest) => {
     if ((isOwner || isRH) && request.status === "ApprovedByManager") {
        return (
            <DropdownMenuItem onClick={() => handleStatusChange(request.id, "Approved")}>
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Approve (Final)
            </DropdownMenuItem>
        );
     }
     return null;
  }

  const getRejectAction = (request: LeaveRequest) => {
    if (request.status === 'Approved' || request.status === 'Rejected' || !currentUser) return null;

    const requestingEmployee = employeeMap.get(request.employeeId);
    if (!requestingEmployee) return null;

    let canReject = false;
    // Manager can reject pending requests from their team
    if (isManager && request.status === 'Pending') {
        const managerDepartmentName = departments.find(d => d.teamLeader === currentUser.name)?.name;
        if (requestingEmployee.department === managerDepartmentName && requestingEmployee.id !== currentUser.id) {
            canReject = true;
        }
    }
    // Owner/RH can reject pre-approved or pending requests
    if ((isOwner || isRH) && (request.status === 'ApprovedByManager' || request.status === 'Pending')) {
        canReject = true;
    }
    
    if (canReject) {
        return (
            <DropdownMenuItem onClick={() => handleStatusChange(request.id, "Rejected")} className="text-destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Reject
            </DropdownMenuItem>
        )
    }

    return null;
  }

  const renderTable = (requests: LeaveRequest[]) => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                    No requests found.
                </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => {
              const managerApprovalAction = getManagerApprovalAction(request);
              const rhApprovalAction = getRHApprovalAction(request);
              const rejectAction = getRejectAction(request);
              const canPerformAction = canEdit && (managerApprovalAction || rhApprovalAction || rejectAction);
              const employeeName = employeeMap.get(request.employeeId)?.name || 'Unknown Employee';

              return (
                <TableRow key={request.id}>
                  <TableCell>{employeeName}</TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{request.leaveType}</TableCell>
                  <TableCell>
                    {request.startDate} to {request.endDate}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[request.status]}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {canPerformAction && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            disabled={request.status === "Approved" || request.status === "Rejected"}
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {managerApprovalAction}
                          {rhApprovalAction}
                          {rejectAction}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
           <h2 className="text-2xl font-bold tracking-tight">Leave Requests</h2>
           {canCreate && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Submit Leave Request
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">
                Pending <Badge variant="secondary" className="ml-2">{categorizedRequests.pending.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="preApproved">
                Approved By Manager <Badge variant="secondary" className="ml-2">{categorizedRequests.preApproved.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved <Badge variant="secondary" className="ml-2">{categorizedRequests.approved.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected <Badge variant="secondary" className="ml-2">{categorizedRequests.rejected.length}</Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
              {renderTable(categorizedRequests.pending.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))}
            </TabsContent>
            <TabsContent value="preApproved" className="mt-4">
              {renderTable(categorizedRequests.preApproved.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))}
            </TabsContent>
            <TabsContent value="approved" className="mt-4">
              {renderTable(categorizedRequests.approved.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))}
            </TabsContent>
            <TabsContent value="rejected" className="mt-4">
              {renderTable(categorizedRequests.rejected.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Leave Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="leaveType" className="text-right">
                  Leave Type
                </Label>
                <Select name="leaveType" required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vacation">Vacation</SelectItem>
                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
