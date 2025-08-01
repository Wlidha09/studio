"use client";

import { useState } from "react";
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
import type { LeaveRequest, Employee } from "@/lib/types";
import { useRole } from "@/contexts/role-context";
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

type Status = "Pending" | "Approved" | "Rejected";

const statusColors: Record<Status, string> = {
  Pending: "bg-yellow-200 text-yellow-800",
  Approved: "bg-green-200 text-green-800",
  Rejected: "bg-red-200 text-red-800",
};

interface LeaveRequestsTableProps {
  initialLeaveRequests: LeaveRequest[];
  employees: Employee[];
}

export default function LeaveRequestsTable({ initialLeaveRequests, employees }: LeaveRequestsTableProps) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { role } = useRole();
  const { toast } = useToast();

  const handleStatusChange = (id: string, status: Status) => {
    setLeaveRequests(
      leaveRequests.map((req) => (req.id === id ? { ...req, status } : req))
    );
    toast({ title: `Leave Request ${status}`, description: `The request has been ${status.toLowerCase()}.` });
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const employeeId = formData.get('employeeId') as string;
    const employee = employees.find(emp => emp.id === employeeId);

    const leaveData = {
      leaveType: formData.get('leaveType'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
    };
    
    const newRequest: LeaveRequest = {
      id: `l${leaveRequests.length + 1}`,
      employeeName: employee?.name || 'Unknown',
      employeeId: employeeId,
      status: 'Pending',
      ...leaveData,
    } as LeaveRequest;
    
    setLeaveRequests([...leaveRequests, newRequest]);
    toast({ title: "Leave Request Submitted", description: "Your request has been sent for approval." });
    
    setIsDialogOpen(false);
  };
  
  const canManage = role === "Manager" || role === "RH" || role === "Owner";
  const isEmployee = role === "Employee";
  const currentUser = isEmployee ? employees.find(e => e.role === 'Employee') : null;

  const filteredRequests = isEmployee 
    ? leaveRequests.filter(req => req.employeeId === currentUser?.id)
    : leaveRequests;


  return (
    <>
      {isEmployee && (
        <div className="flex justify-end mb-4">
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Submit Leave Request
          </Button>
        </div>
      )}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {!isEmployee && <TableHead>Employee</TableHead>}
              <TableHead>Leave Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              {canManage && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                {!isEmployee && <TableCell>{request.employeeName}</TableCell>}
                <TableCell>{request.leaveType}</TableCell>
                <TableCell>{request.startDate} to {request.endDate}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[request.status]}>
                    {request.status}
                  </Badge>
                </TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={request.status !== "Pending"}
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStatusChange(request.id, "Approved")}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(request.id, "Rejected")}>
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Leave Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              {isEmployee && <input type="hidden" name="employeeId" value={currentUser?.id} />}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="leaveType" className="text-right">Leave Type</Label>
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
                <Label htmlFor="startDate" className="text-right">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">End Date</Label>
                <Input id="endDate" name="endDate" type="date" className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
