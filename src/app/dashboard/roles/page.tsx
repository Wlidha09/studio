

"use client";

import { useState, useEffect } from "react";
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
import type { UserRole } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addRole, deleteRole, updateRole, getRoles } from "@/lib/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchRoles() {
      const fetchedRoles = await getRoles();
      setRoles(fetchedRoles);
    }
    fetchRoles();
  }, []);

  const handleEdit = (role: UserRole) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRole(id);
      setRoles(roles.filter((r) => r.id !== id));
      toast({ title: "Role Deleted", description: "The role has been removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete role.", variant: "destructive" });
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roleData = {
        name: formData.get("name") as string,
    };

    if (editingRole) {
      const updatedRole = { ...editingRole, ...roleData };
      try {
        await updateRole(updatedRole);
        setRoles(roles.map(r => r.id === editingRole.id ? updatedRole : r));
        toast({ title: "Role Updated", description: "Role details have been saved." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to update role.", variant: "destructive" });
      }
    } else {
      try {
        const newRole = await addRole(roleData);
        setRoles([...roles, newRole]);
        toast({ title: "Role Added", description: "A new role has been added." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to add role.", variant: "destructive" });
      }
    }

    setIsDialogOpen(false);
    setEditingRole(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Role Management</CardTitle>
          <CardDescription>
            Add, edit, or delete user roles. These roles will be available when assigning a role to an employee.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex justify-end mb-4">
                <Button onClick={() => { setEditingRole(null); setIsDialogOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Role
                </Button>
            </div>
            <div className="border rounded-lg">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map((role) => (
                    <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(role)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(role.id)} className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Add Role"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" defaultValue={editingRole?.name} className="col-span-3" required />
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
