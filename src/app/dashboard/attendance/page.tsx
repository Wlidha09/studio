
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarPlus, Trash2, Loader2, PlusCircle, RefreshCw, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Holiday } from "@/lib/types";
import { getHolidays, addHoliday, deleteHoliday, updateHoliday, updateHolidayPaidStatus } from "@/lib/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { importHolidays } from "@/ai/flows/import-holidays";

export default function AttendancePage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchHolidays(year: number) {
      setIsLoading(true);
      try {
        const fetchedHolidays = await getHolidays(year);
        // Sort holidays by date
        fetchedHolidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setHolidays(fetchedHolidays);
      } catch (error) {
        toast({
          title: "Error fetching holidays",
          description: "Could not retrieve the list of holidays.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    const yearNow = new Date().getFullYear();
    if(yearNow !== currentYear) {
      setCurrentYear(yearNow);
    }
    fetchHolidays(currentYear);
  }, [currentYear, toast]);

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setIsDialogOpen(true);
  };

  const handleSaveHoliday = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const holidayData = {
      name: formData.get("name") as string,
      date: formData.get("date") as string,
      paid: (formData.get("paid") as string) === 'on',
    };

    if (!holidayData.name || !holidayData.date) {
        toast({ title: "Missing fields", description: "Please provide both name and date.", variant: "destructive" });
        return;
    }
    
    if (new Date(holidayData.date).getFullYear() !== currentYear) {
        toast({ title: "Invalid Date", description: `The holiday must be in the year ${currentYear}.`, variant: "destructive" });
        return;
    }

    if (editingHoliday) {
        const updatedHoliday = { ...editingHoliday, ...holidayData };
        try {
            await updateHoliday(updatedHoliday);
            const updatedHolidays = holidays.map(h => h.id === updatedHoliday.id ? updatedHoliday : h).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setHolidays(updatedHolidays);
            toast({ title: "Holiday Updated", description: `${updatedHoliday.name} has been updated.` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update holiday.", variant: "destructive" });
        }
    } else {
        try {
          const newHoliday = await addHoliday(holidayData);
          const updatedHolidays = [...holidays, newHoliday].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setHolidays(updatedHolidays);
          toast({ title: "Holiday Added", description: `${newHoliday.name} has been added.` });
        } catch (error) {
          toast({ title: "Error", description: "Failed to add holiday.", variant: "destructive" });
        }
    }
    
    setIsDialogOpen(false);
    setEditingHoliday(null);
  };

  const handleDeleteHoliday = async (id: string) => {
    try {
      await deleteHoliday(id);
      setHolidays(holidays.filter((h) => h.id !== id));
      toast({ title: "Holiday Deleted", description: "The holiday has been removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete holiday.", variant: "destructive" });
    }
  };

  const handlePaidChange = async (id: string, paid: boolean) => {
    try {
      await updateHolidayPaidStatus(id, paid);
      setHolidays(holidays.map(h => h.id === id ? { ...h, paid } : h));
      toast({ title: "Holiday Updated", description: "Paid status has been changed." });
    } catch (error) {
       toast({ title: "Error", description: "Failed to update paid status.", variant: "destructive" });
    }
  };

  const handleSyncHolidays = async () => {
    setIsSyncing(true);
    try {
      await importHolidays({ year: currentYear });
      toast({ title: "Holidays Synced", description: `Public holidays for ${currentYear} have been imported.` });
      // Refetch holidays to show the newly imported ones
      const fetchedHolidays = await getHolidays(currentYear);
      fetchedHolidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setHolidays(fetchedHolidays);
    } catch (error) {
      toast({ title: "Error", description: "Failed to sync holidays.", variant: "destructive" });
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Public Holidays {currentYear}</CardTitle>
            <CardDescription>
              Manage the list of official public holidays for the current year. This list is updated automatically on January 1st.
            </CardDescription>
          </div>
           <div className="flex gap-2">
            <Button onClick={handleSyncHolidays} disabled={isSyncing}>
            {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Sync Holidays
            </Button>
            <Button onClick={() => { setEditingHoliday(null); setIsDialogOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Holiday
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {holidays.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <CalendarPlus className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No holidays found for {currentYear}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Get started by adding a new holiday or syncing from Google.</p>
            </div>
          ) : (
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Day</TableHead>
                        <TableHead>Holiday Name</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {holidays.map((holiday) => (
                        <TableRow key={holiday.id}>
                            <TableCell className="font-medium">{format(parseISO(holiday.date), 'MMMM d, yyyy')}</TableCell>
                            <TableCell>{format(parseISO(holiday.date), 'eeee')}</TableCell>
                            <TableCell>{holiday.name}</TableCell>
                            <TableCell>
                                <Checkbox
                                    checked={holiday.paid}
                                    onCheckedChange={(checked) => handlePaidChange(holiday.id, !!checked)}
                                />
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(holiday)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteHoliday(holiday.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHoliday ? "Edit Holiday" : "Add New Holiday"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveHoliday}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Holiday Name</Label>
                <Input id="name" name="name" defaultValue={editingHoliday?.name} placeholder="e.g., Revolution and Youth Day" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={editingHoliday?.date} required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="paid" name="paid" defaultChecked={editingHoliday?.paid ?? true} />
                <Label
                  htmlFor="paid"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Paid Holiday
                </Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Holiday</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
