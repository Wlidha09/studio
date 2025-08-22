
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bug, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ErrorLog } from "@/lib/types";
import { getErrors } from "@/lib/firestore";
import { updateErrorStatusAction } from "./actions";
import { useToast } from "@/hooks/use-toast";

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
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({ key: 'timestamp', direction: 'descending' });
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchErrors() {
      setIsLoading(true);
      try {
        const fetchedErrors = await getErrors();
        setErrors(fetchedErrors);
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch error logs.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchErrors();
  }, [toast]);

  const handleStatusChange = async (id: string, status: ErrorLog['status']) => {
    const result = await updateErrorStatusAction(id, status);
    if (result.success) {
      setErrors(errors.map(e => e.id === id ? { ...e, status } : e));
      toast({ title: "Status Updated", description: `Error marked as ${status}.` });
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

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
              This page displays caught exceptions and errors from the application, stored in Firestore.
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
                          <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {isLoading ? (
                        <TableRow><TableCell colSpan={7} className="text-center">Loading errors...</TableCell></TableRow>
                      ) : sortedErrors.length === 0 ? (
                         <TableRow><TableCell colSpan={7} className="text-center">No errors logged yet.</TableCell></TableRow>
                      ) : (
                        sortedErrors.map((error) => (
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
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleStatusChange(error.id, 'resolved')}>Mark as Resolved</DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleStatusChange(error.id, 'ignored')}>Mark as Ignored</DropdownMenuItem>
                                       <DropdownMenuItem onClick={() => handleStatusChange(error.id, 'unresolved')}>Mark as Unresolved</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                      )}
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
