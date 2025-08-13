
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
import type { LeaveRequest } from "@/lib/types";
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

type Status = "Pending" | "ApprovedByManager" | "Approved" | "Rejected";

const statusColors: Record<Status, string> = {
  Pending: "bg-yellow-200 text-yellow-800",
  ApprovedByManager: "bg-blue-200 text-blue-800",
  Approved: "bg-green-200 text-green-800",
  Rejected: "bg-red-200 text-red-800",
};

interface LeaveRequestsTableProps {
  initialLeaveRequests: LeaveRequest[];
}

export default function LeaveRequestsTable({ initialLeaveRequests }: LeaveRequestsTableProps) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { employee } = useAuth();
  const { toast } = useToast();
  const { hasPermission } = usePermissions();

  const canCreate = hasPermission('leaves', 'create');
  const canEdit = hasPermission('leaves', 'edit');

  const handleStatusChange = async (id: string, status: Status) => {
    try {
      await updateLeaveRequestStatus(id, status);
      setLeaveRequests(
        leaveRequests.map((req) => (req.id === id ? { ...req, status } : req))
      );
      toast({ title: `Leave Request Updated`, description: `The request has been updated to ${status}.` });
    } catch(error) {
       toast({ title: "Error", description: "Failed to update leave request.", variant: "destructive" });
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!employee) {
        toast({ title: "Not Authenticated", description: "You must be logged in to submit a request.", variant: "destructive" });
        return;
    };
    
    const formData = new FormData(e.currentTarget);
    const leaveData = {
      leaveType: formData.get('leaveType') as LeaveRequest['leaveType'],
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
    };
    
    const newRequestData: Omit<LeaveRequest, 'id'> = {
      employeeName: employee.name,
      employeeId: employee.id,
      status: 'Pending',
      ...leaveData,
    };
    
    try {
      const newRequest = await addLeaveRequest(newRequestData);
      setLeaveRequests([...leaveRequests, newRequest]);
      toast({ title: "Leave Request Submitted", description: "Your request has been sent for approval." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit leave request.", variant: "destructive" });
    }
    
    setIsDialogOpen(false);
  };
  
  const sortedRequests = leaveRequests.sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());


  return (
    <>
      <div className="flex justify-end mb-4">
        {canCreate && (
            <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Submit Leave Request
            </Button>
        )}
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.employeeName}</TableCell>
                <TableCell>{request.leaveType}</TableCell>
                <TableCell>{request.startDate} to {request.endDate}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[request.status]}>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    {canEdit && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                disabled={
                                    request.status === "Approved" ||
                                    request.status === "Rejected"
                                }
                                >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {request.status === "Pending" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(request.id, "ApprovedByManager")}>
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                        Approve (Manager)
                                    </DropdownMenuItem>
                                )}
                                {request.status === "ApprovedByManager" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(request.id, "Approved")}>
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                        Approve (RH)
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleStatusChange(request.id, "Rejected")} disabled={request.status === 'Rejected' || request.status === 'Approved'}>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                Reject
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </TableCell>
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
