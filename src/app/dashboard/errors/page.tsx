
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bug, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// This is mock data. In a real application, you would fetch this from a logging service.
const initialErrors = [
  { id: 1, message: "Failed to fetch user data in ProfilePage", file: "profile/page.tsx", count: 12, status: "unresolved", level: "error", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), stackTrace: "TypeError: Cannot read properties of undefined (reading 'map')\n    at ProfilePage (profile/page.tsx:42:15)\n    at renderWithHooks (react-dom.development.js:14985:18)" },
  { id: 2, message: "Cannot read properties of null (reading 'fcmToken')", file: "send-schedule-reminders.ts", count: 5, status: "resolved", level: "error", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), stackTrace: "TypeError: Cannot read properties of null (reading 'fcmToken')\n    at sendScheduleRemindersFlow (send-schedule-reminders.ts:55:25)" },
  { id: 3, message: "Date parsing failed for holiday import", file: "import-holidays.ts", count: 3, status: "ignored", level: "warning", timestamp: new Date().toISOString(), stackTrace: "Error: Invalid date format\n    at importHolidaysFlow (import-holidays.ts:30:11)" },
  { id: 4, message: "Invalid credentials on login", file: "login/page.tsx", count: 28, status: "unresolved", level: "info", timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), stackTrace: "Info: User 'test@atolls.com' failed to log in." },
];

type ErrorLog = typeof initialErrors[0];
type SortKey = "level" | "message" | "file" | "count" | "status" | "timestamp";

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
  const [errors] = useState(initialErrors);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({ key: 'timestamp', direction: 'descending' });
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  const sortedErrors = [...errors].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortKey) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'descending' ? '▼' : '▲';
  };

  return (
    <>
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
                          <TableHead className="cursor-pointer" onClick={() => requestSort('timestamp')}>
                            <div className="flex items-center gap-2">Date & Time {getSortIndicator('timestamp')}</div>
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => requestSort('level')}>
                            <div className="flex items-center gap-2">Level {getSortIndicator('level')}</div>
                          </TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Source File</TableHead>
                          <TableHead className="text-center cursor-pointer" onClick={() => requestSort('count')}>
                            <div className="flex items-center justify-center gap-2">Count {getSortIndicator('count')}</div>
                          </TableHead>
                          <TableHead className="text-center cursor-pointer" onClick={() => requestSort('status')}>
                            <div className="flex items-center justify-center gap-2">Status {getSortIndicator('status')}</div>
                          </TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {sortedErrors.map((error) => (
                          <TableRow key={error.id}>
                              <TableCell>
                                  {format(new Date(error.timestamp), "yyyy-MM-dd HH:mm:ss")}
                              </TableCell>
                              <TableCell>
                                  <Badge className={levelColors[error.level]}>{error.level}</Badge>
                              </TableCell>
                              <TableCell>
                                  <Button variant="link" className="p-0 h-auto font-medium" onClick={() => setSelectedError(error)}>
                                      {error.message}
                                  </Button>
                              </TableCell>
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

      <Dialog open={!!selectedError} onOpenChange={(open) => !open && setSelectedError(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Error Details</DialogTitle>
            <DialogDescription>
              {selectedError?.message}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-semibold text-right">File:</div>
              <div className="col-span-3 text-muted-foreground">{selectedError?.file}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-semibold text-right">Status:</div>
              <div className="col-span-3">
                <Badge variant="outline" className={statusColors[selectedError?.status ?? 'unresolved']}>
                  {selectedError?.status}
                </Badge>
              </div>
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
                <div className="font-semibold text-right pt-1">Stack Trace:</div>
                <div className="col-span-3">
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                        <code>{selectedError?.stackTrace}</code>
                    </pre>
                </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
