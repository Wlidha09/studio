
"use client";

import { useState, useEffect } from 'react';
import { addDays, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import WeeklyCalendar from '@/components/dashboard/weekly-calendar';
import { useAuth } from '@/contexts/auth-context';
import { addWorkSchedule, getWorkSchedules } from '@/lib/firestore';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { WorkSchedule } from "@/lib/types";


function AllSchedulesTable() {
    const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSchedules() {
            try {
                const fetchedSchedules = await getWorkSchedules();
                 const sortedSchedules = [...fetchedSchedules].sort((a, b) => 
                    new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
                );
                setSchedules(sortedSchedules);
            } catch (error) {
                console.error("Failed to fetch work schedules", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSchedules();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Employee Name</TableHead>
                        <TableHead>Selected Days</TableHead>
                        <TableHead>Submission Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schedules.map((schedule) => (
                        <TableRow key={schedule.id}>
                            <TableCell className="font-medium">{schedule.employeeName}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-2">
                                    {schedule.dates.map(date => (
                                        <Badge key={date} variant="secondary">
                                            {format(parseISO(date), "EEE, MMM d")}
                                        </Badge>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>{format(parseISO(schedule.submissionDate), "MMMM d, yyyy")}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}


export default function SchedulePage() {
  const { toast } = useToast();
  const { employee } = useAuth();
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  const startOfNextWeek = startOfWeek(addDays(today, 7), { weekStartsOn: 1 });
  const endOfNextWeek = endOfWeek(addDays(today, 7), { weekStartsOn: 1 });
  const nextWeekDays = eachDayOfInterval({ start: startOfNextWeek, end: endOfNextWeek });

  const handleDayClick = (day: Date) => {
    const isAlreadySelected = selectedDays.some(d => isSameDay(d, day));
    if (isAlreadySelected) {
      setSelectedDays(currentSelectedDays => currentSelectedDays.filter(d => !isSameDay(d, day)));
    } else {
      if (selectedDays.length < 3) {
        setSelectedDays(currentSelectedDays => [...currentSelectedDays, day]);
      } else {
        toast({
          title: "Selection Limit Reached",
          description: "You can only select up to 3 days.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (selectedDays.length === 0) {
        toast({
            title: "No days selected",
            description: "Please select at least one day.",
            variant: "destructive",
        });
        return;
    }
    if (!employee) {
        toast({
            title: "Not Authenticated",
            description: "Could not identify the current user.",
            variant: "destructive",
        });
        return;
    }

    setIsSubmitting(true);
    try {
        const scheduleData = {
            employeeId: employee.id,
            employeeName: employee.name,
            dates: selectedDays.map(d => format(d, 'yyyy-MM-dd')),
            submissionDate: format(new Date(), 'yyyy-MM-dd')
        };
        await addWorkSchedule(scheduleData);
        toast({
            title: "Schedule Submitted!",
            description: `Your preferred days for next week have been saved.`,
        });
        setSelectedDays([]); // Clear selection after successful submission
    } catch (error) {
        console.error("Failed to save schedule", error);
        toast({
            title: "Submission Failed",
            description: "Could not save your schedule. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Tabs defaultValue="my-schedule">
      <Card>
          <CardHeader>
              <CardTitle className="font-headline text-2xl">Weekly Schedule</CardTitle>
              <CardDescription>
                  Select your preferred work days for next week or view all submitted schedules.
              </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsList className="mb-4">
                <TabsTrigger value="my-schedule">My Schedule</TabsTrigger>
                <TabsTrigger value="all-schedules">All Schedules</TabsTrigger>
            </TabsList>
            <TabsContent value="my-schedule">
                <div className="flex flex-col items-center gap-4">
                    <WeeklyCalendar 
                        week={nextWeekDays}
                        selectedDays={selectedDays}
                        onDayClick={handleDayClick}
                    />
                    <div className='text-center text-sm text-muted-foreground'>
                        {selectedDays.length > 0 
                            ? `You have selected ${selectedDays.length} day(s).`
                            : "Please pick up to 3 days."
                        }
                    </div>
                </div>
                 <CardFooter className="flex justify-end mt-4">
                    <Button onClick={handleSubmit} disabled={isSubmitting || selectedDays.length === 0}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Schedule'
                        )}
                    </Button>
                </CardFooter>
            </TabsContent>
            <TabsContent value="all-schedules">
                <AllSchedulesTable />
            </TabsContent>
          </CardContent>
      </Card>
    </Tabs>
  );
}
