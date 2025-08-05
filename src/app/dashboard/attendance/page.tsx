
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarPlus, Trash2, Loader2, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Holiday } from "@/lib/types";
import { getHolidays, addHoliday, deleteHoliday } from "@/lib/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";

export default function AttendancePage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { toast } = useToast();

  useEffect(() => {
    async function fetchHolidays() {
      setIsLoading(true);
      try {
        const fetchedHolidays = await getHolidays(currentYear);
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

    // This will run on mount and when the year changes (e.g., on Jan 1st)
    const yearNow = new Date().getFullYear();
    if(yearNow !== currentYear) {
      setCurrentYear(yearNow);
    }

    fetchHolidays();
  }, [currentYear, toast]);

  const handleAddHoliday = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newHolidayData = {
      name: formData.get("name") as string,
      date: formData.get("date") as string,
    };

    if (!newHolidayData.name || !newHolidayData.date) {
        toast({ title: "Missing fields", description: "Please provide both name and date.", variant: "destructive" });
        return;
    }
    
    // Ensure date is within the current year
    if (new Date(newHolidayData.date).getFullYear() !== currentYear) {
        toast({ title: "Invalid Date", description: `The holiday must be in the year ${currentYear}.`, variant: "destructive" });
        return;
    }

    try {
      const newHoliday = await addHoliday(newHolidayData);
      const updatedHolidays = [...holidays, newHoliday].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setHolidays(updatedHolidays);
      toast({ title: "Holiday Added", description: `${newHoliday.name} has been added.` });
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to add holiday.", variant: "destructive" });
    }
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
           <Button onClick={() => setIsDialogOpen(true)}>
             <PlusCircle className="mr-2 h-4 w-4" /> Add Holiday
           </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : holidays.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <CalendarPlus className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No holidays found for {currentYear}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Get started by adding a new holiday.</p>
            </div>
          ) : (
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Day</TableHead>
                        <TableHead>Holiday Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {holidays.map((holiday) => (
                        <TableRow key={holiday.id}>
                            <TableCell className="font-medium">{format(parseISO(holiday.date), 'MMMM d, yyyy')}</TableCell>
                            <TableCell>{format(parseISO(holiday.date), 'eeee')}</TableCell>
                            <TableCell>{holiday.name}</TableCell>
                            <TableCell className="text-right">
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
            <DialogTitle>Add New Holiday</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddHoliday}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Holiday Name</Label>
                <Input id="name" name="name" placeholder="e.g., Revolution and Youth Day" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required />
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
