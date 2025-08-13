
"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import type { Employee } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateEmployee } from "@/lib/firestore";

export default function ProfilePage() {
  const { employee, setEmployee } = useAuth();
  const [editableEmployee, setEditableEmployee] = useState<Employee | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (employee) {
      setEditableEmployee(employee);
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editableEmployee) {
      setEditableEmployee({ ...editableEmployee, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editableEmployee) return;

    setIsSaving(true);
    try {
      await updateEmployee(editableEmployee);
      setEmployee(editableEmployee); // Update auth context state
      toast({
        title: "Profile Updated",
        description: "Your personal information has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };


  if (!editableEmployee) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-start py-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">My Profile</CardTitle>
            <CardDescription>
              View and edit your personal and company information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave}>
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={editableEmployee.avatar} alt={editableEmployee.name} />
                        <AvatarFallback>{editableEmployee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1.5">
                        <h2 className="text-2xl font-bold">{editableEmployee.name}</h2>
                        <p className="text-muted-foreground">{editableEmployee.email}</p>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={editableEmployee.name || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emailDisplay">Email</Label>
                            <Input
                                id="emailDisplay"
                                name="emailDisplay"
                                type="email"
                                value={editableEmployee.email || ""}
                                readOnly
                                disabled
                                className="bg-muted"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Birth Date</Label>
                            <Input
                                id="birthDate"
                                name="birthDate"
                                type="date"
                                value={editableEmployee.birthDate || ""}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Company Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" value={editableEmployee.department} readOnly disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" value={editableEmployee.role} readOnly disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hireDate">Hire Date</Label>
                            <Input id="hireDate" type="date" value={editableEmployee.hireDate} readOnly disabled className="bg-muted" />
                        </div>
                    </div>
                </div>

                <Separator />
                
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
