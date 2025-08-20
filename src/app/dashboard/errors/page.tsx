
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bug } from "lucide-react";

// This is mock data. In a real application, you would fetch this from a logging service.
const errors = [
  { id: 1, message: "Failed to fetch user data in ProfilePage", file: "profile/page.tsx", count: 12, status: "unresolved", level: "error" },
  { id: 2, message: "Cannot read properties of null (reading 'fcmToken')", file: "send-schedule-reminders.ts", count: 5, status: "resolved", level: "error" },
  { id: 3, message: "Date parsing failed for holiday import", file: "import-holidays.ts", count: 3, status: "ignored", level: "warning" },
  { id: 4, message: "Invalid credentials on login", file: "login/page.tsx", count: 28, status: "unresolved", level: "info" },
];

const levelColors: Record<string, string> = {
  error: "bg-red-500 text-white",
  warning: "bg-yellow-500 text-black",
  info: "bg-blue-500 text-white",
};

const statusColors: Record<string, string> = {
  unresolved: "bg-red-200 text-red-800",
  resolved: "bg-green-200 text-green-800",
  ignored: "bg-gray-200 text-gray-800",
};


export default function ErrorsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Bug className="h-6 w-6" /> Application Error Log
        </CardTitle>
        <CardDescription>
            This page displays caught exceptions and errors from the application. For Dev role only.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Level</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Source File</TableHead>
                        <TableHead className="text-center">Count</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {errors.map((error) => (
                        <TableRow key={error.id}>
                            <TableCell>
                                <Badge className={levelColors[error.level]}>{error.level}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{error.message}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{error.file}</TableCell>
                            <TableCell className="text-center font-mono">{error.count}</TableCell>
                             <TableCell className="text-center">
                                <Badge variant="outline" className={statusColors[error.status]}>{error.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
