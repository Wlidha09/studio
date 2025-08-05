
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Employee } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { employee } = useAuth();
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        birthDate: employee.birthDate,
        email: employee.email,
        department: employee.department,
        role: employee.role,
        hireDate: employee.hireDate,
      });
    }
  }, [employee]);

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">My Profile</CardTitle>
          <CardDescription>
            View your personal and company information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={`https://placehold.co/96x96.png?text=${employee.name.charAt(0)}`} alt={employee.name} />
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1.5">
                    <h2 className="text-2xl font-bold">{employee.name}</h2>
                    <p className="text-muted-foreground">{employee.email}</p>
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
                            value={formData.name || ""}
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
                            value={formData.birthDate || ""}
                            readOnly
                            disabled
                            className="bg-muted"
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
                        <Input id="department" value={employee.department} readOnly disabled className="bg-muted" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" value={employee.role} readOnly disabled className="bg-muted" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="hireDate">Hire Date</Label>
                        <Input id="hireDate" type="date" value={employee.hireDate} readOnly disabled className="bg-muted" />
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
