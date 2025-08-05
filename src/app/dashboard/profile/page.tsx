
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateEmployee } from "@/lib/firestore";
import type { Employee } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { employee, setEmployee } = useAuth();
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        birthDate: employee.birthDate,
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!employee) return;

    setIsLoading(true);
    try {
      const updatedData: Employee = {
        ...employee,
        ...formData,
      };
      await updateEmployee(updatedData);
      setEmployee(updatedData);
      toast({ title: "Success", description: "Your profile has been updated." });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            View and update your personal information.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex justify-center mb-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={`https://placehold.co/96x96.png?text=${employee.name.charAt(0)}`} alt={employee.name} />
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={employee.email}
                  readOnly
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate || ""}
                    onChange={handleChange}
                    required
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="hireDate">Hire Date</Label>
                    <Input
                    id="hireDate"
                    name="hireDate"
                    type="date"
                    value={employee.hireDate}
                    readOnly
                    disabled
                    className="bg-muted"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                    id="department"
                    name="department"
                    value={employee.department}
                    readOnly
                    disabled
                    className="bg-muted"
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                    id="role"
                    name="role"
                    value={employee.role}
                    readOnly
                    disabled
                    className="bg-muted"
                    />
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
