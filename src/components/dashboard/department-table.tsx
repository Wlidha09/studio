
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
import type { Department, Employee } from "@/lib/types";
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
import { addDepartment, deleteDepartment, updateDepartment } from "@/lib/firestore";
import { useRole } from "@/contexts/role-context";
import { useAtomValue } from "jotai";
import { permissionsAtom } from "@/lib/permissions";

interface DepartmentTableProps {
  initialDepartments: Department[];
  employees: Employee[];
}

export default function DepartmentTable({ initialDepartments, employees }: DepartmentTableProps) {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const { toast } = useToast();
  const { role } = useRole();
  const permissions = useAtomValue(permissionsAtom);
  const canCreate = permissions[role]?.departments?.create;
  const canEdit = permissions[role]?.departments?.edit;
  const canDelete = permissions[role]?.departments?.delete;


  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteDepartment(id);
      setDepartments(departments.filter((d) => d.id !== id));
      toast({ title: "Department Deleted", description: "The department has been removed." });
    } catch(error) {
      toast({ title: "Error", description: "Failed to delete department.", variant: "destructive" });
    }
  };
  
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const departmentData = Object.fromEntries(formData.entries()) as Omit<Department, 'id'>;

    if (editingDepartment) {
      const updatedDepartment = { ...editingDepartment, ...departmentData };
      try {
        await updateDepartment(updatedDepartment);
        setDepartments(departments.map(dep => dep.id === editingDepartment.id ? updatedDepartment : dep));
        toast({ title: "Department Updated", description: "Department details have been saved." });
      } catch(error) {
        toast({ title: "Error", description: "Failed to update department.", variant: "destructive" });
      }
    } else {
      try {
        const newDepartment = await addDepartment(departmentData);
        setDepartments([...departments, newDepartment]);
        toast({ title: "Department Added", description: "A new department has been added." });
      } catch(error) {
        toast({ title: "Error", description: "Failed to add department.", variant: "destructive" });
      }
    }
    
    setIsDialogOpen(false);
    setEditingDepartment(null);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        {canCreate && (
            <Button onClick={() => { setEditingDepartment(null); setIsDialogOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Department
            </Button>
        )}
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department Name</TableHead>
              <TableHead>Team Leader</TableHead>
              {(canEdit || canDelete) && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell>{department.teamLeader}</TableCell>
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
                        {canEdit && <DropdownMenuItem onClick={() => handleEdit(department)}>Edit</DropdownMenuItem>}
                        {canDelete && <DropdownMenuItem onClick={() => handleDelete(department.id)} className="text-destructive">Delete</DropdownMenuItem>}
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
            <DialogTitle>{editingDepartment ? "Edit Department" : "Add Department"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" defaultValue={editingDepartment?.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teamLeader" className="text-right">Team Leader</Label>
                 <Select name="teamLeader" defaultValue={editingDepartment?.teamLeader}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a leader" />
                    </SelectTrigger>
                    <SelectContent>
                        {employees.map(e => <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>)}
                    </SelectContent>
                 </Select>
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
