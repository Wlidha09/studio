

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
import { PlusCircle, Trash2 } from "lucide-react";
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
import { addRole, deleteRole, getRoles } from "@/lib/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pages } from "@/lib/pages";
import { Checkbox } from "@/components/ui/checkbox";
import { usePermissions } from "@/hooks/use-permissions";
import type { PageKey, Action } from "@/lib/permissions";
import { useRole } from "@/contexts/role-context";

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const { toast } = useToast();
  const { permissions, setPermission, hasPermission } = usePermissions();
  const { role: currentUserRole } = useRole();

  const canCreate = hasPermission('roles', 'create');
  const canDelete = hasPermission('roles', 'delete');
  const canEdit = hasPermission('roles', 'edit');

  useEffect(() => {
    async function fetchRoles() {
      const fetchedRoles = await getRoles();
      setRoles(fetchedRoles);
    }
    fetchRoles();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteRole(id);
      setRoles(roles.filter((r) => r.id !== id));
      toast({ title: "Role Deleted", description: `The role "${name}" has been removed.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete role.", variant: "destructive" });
    }
  };

  const handleAddRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newRoleName) return;

    try {
      const newRole = await addRole({ name: newRoleName });
      setRoles([...roles, newRole]);
      setNewRoleName("");
      toast({ title: "Role Added", description: `The role "${newRoleName}" has been added.` });
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to add role.", variant: "destructive" });
    }
  };

  const displayedRoles = currentUserRole === 'Dev' ? roles : roles.filter(r => r.name !== 'Dev');

  const isViewDisabled = (roleName: string, pageKey: PageKey) => {
    const pagePermissions = permissions[roleName]?.[pageKey];
    if (!pagePermissions) return false;
    return pagePermissions.create || pagePermissions.edit || pagePermissions.delete;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Role Management</CardTitle>
          <CardDescription>
            Configure permissions for different user roles across the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex justify-end mb-4">
                {canCreate && (
                    <Button onClick={() => setIsDialogOpen(true) }>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Role
                    </Button>
                )}
            </div>
            <div className="border rounded-lg overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Page</TableHead>
                        {displayedRoles.map((role) => (
                            <TableHead key={role.id} className="text-center min-w-[150px]">
                                <div className="flex items-center justify-center gap-2">
                                    {role.name}
                                    {canDelete && role.name !== 'Owner' && role.name !== 'Dev' && (
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDelete(role.id, role.name)}>
                                            <Trash2 className="h-4 w-4 text-destructive"/>
                                        </Button>
                                    )}
                                </div>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(pages).map(([pageKey, pageName]) => (
                        <TableRow key={pageKey}>
                            <TableCell className="font-medium">{pageName}</TableCell>
                            {displayedRoles.map(role => (
                                <TableCell key={role.id} className="text-center">
                                    <div className="flex justify-center items-center gap-3">
                                    {(['view', 'create', 'edit', 'delete'] as Action[]).map(action => (
                                        <div key={action} className="flex flex-col items-center gap-1">
                                            <Label htmlFor={`${role.id}-${pageKey}-${action}`} className="text-xs capitalize">{action}</Label>
                                            <Checkbox
                                                id={`${role.id}-${pageKey}-${action}`}
                                                disabled={
                                                    !canEdit || 
                                                    (role.name === "Owner" && pageKey === 'roles' && action === 'edit') ||
                                                    (action === 'view' && isViewDisabled(role.name, pageKey as PageKey))
                                                }
                                                checked={permissions[role.name]?.[pageKey as PageKey]?.[action] ?? false}
                                                onCheckedChange={(checked) => setPermission(role.name, pageKey as PageKey, action, !!checked)}
                                            />
                                        </div>
                                    ))}
                                    </div>
                                </TableCell>
                            ))}
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
            <DialogTitle>Add New Role</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddRole}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} className="col-span-3" required />
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
