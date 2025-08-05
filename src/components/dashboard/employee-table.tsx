
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import type { Department, Employee, UserRole } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { addEmployee, deleteEmployee, updateEmployee } from "@/lib/firestore";
import { useRole } from "@/contexts/role-context";
import { useAtomValue } from "jotai";
import { permissionsAtom } from "@/lib/permissions";

const roleColors: Record<UserRole, string> = {
  Owner: "bg-amber-500",
  Dev: "bg-purple-500",
  RH: "bg-blue-500",
  Manager: "bg-green-500",
  Employee: "bg-slate-500",
};

interface EmployeeTableProps {
  initialEmployees: Employee[];
  departments: Department[];
}

export default function EmployeeTable({ initialEmployees, departments }: EmployeeTableProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();
  const { role } = useRole();
  const permissions = useAtomValue(permissionsAtom);
  const canCreate = permissions[role]?.employees?.create;
  const canEdit = permissions[role]?.employees?.edit;
  const canDelete = permissions[role]?.employees?.delete;

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee(id);
      setEmployees(employees.filter((e) => e.id !== id));
      toast({ title: "Employee Deleted", description: "The employee has been removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete employee.", variant: "destructive" });
    }
  };
  
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const employeeData = Object.fromEntries(formData.entries()) as Omit<Employee, 'id' | 'avatar'> & { role: UserRole };
    
    if (editingEmployee) {
      const updatedEmployee = { ...editingEmployee, ...employeeData };
      try {
        await updateEmployee(updatedEmployee);
        setEmployees(employees.map(emp => emp.id === editingEmployee.id ? updatedEmployee : emp));
        toast({ title: "Employee Updated", description: "Employee details have been saved." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to update employee.", variant: "destructive" });
      }
    } else {
      const newEmployeeData = {
        ...employeeData,
        avatar: `https://placehold.co/40x40.png?text=${employeeData.name.charAt(0)}`,
      };
      try {
        const newEmployee = await addEmployee(newEmployeeData);
        setEmployees([...employees, newEmployee]);
        toast({ title: "Employee Added", description: "A new employee has been added." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to add employee.", variant: "destructive" });
      }
    }
    
    setIsDialogOpen(false);
    setEditingEmployee(null);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        {canCreate && (
            <Button onClick={() => { setEditingEmployee(null); setIsDialogOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
            </Button>
        )}
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              {(canEdit || canDelete) && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://placehold.co/40x40.png?text=${employee.name.charAt(0)}`} />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {employee.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`${roleColors[employee.role]} text-white`}>{employee.role}</Badge>
                </TableCell>
                {(canEdit || canDelete) && (
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        {canEdit && <DropdownMenuItem onClick={() => handleEdit(employee)}>Edit</DropdownMenuItem>}
                        {canDelete && <DropdownMenuItem onClick={() => handleDelete(employee.id)} className="text-destructive">Delete</DropdownMenuItem>}
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
            <DialogTitle>{editingEmployee ? "Edit Employee" : "Add Employee"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" defaultValue={editingEmployee?.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={editingEmployee?.email} className="col-span-3" required/>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hireDate" className="text-right">Hire Date</Label>
                <Input id="hireDate" name="hireDate" type="date" defaultValue={editingEmployee?.hireDate} className="col-span-3" required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">Department</Label>
                 <Select name="department" defaultValue={editingEmployee?.department}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                        {departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                    </SelectContent>
                 </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                 <Select name="role" defaultValue={editingEmployee?.role}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Employee">Employee</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="RH">RH</SelectItem>
                        <SelectItem value="Owner">Owner</SelectItem>
                        <SelectItem value="Dev">Dev</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birthDate" className="text-right">Birth Date</Label>
                <Input id="birthDate" name="birthDate" type="date" defaultValue={editingEmployee?.birthDate} className="col-span-3" required/>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
