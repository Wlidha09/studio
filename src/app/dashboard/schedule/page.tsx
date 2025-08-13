

"use client";

import { useState, useEffect } from 'react';
import { addDays, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import WeeklyCalendar from '@/components/dashboard/weekly-calendar';
import { useAuth } from '@/contexts/auth-context';
import { addWorkSchedule, getWorkSchedules, getEmployees } from '@/lib/firestore';
import { Loader2 } from 'lucide-react';
import AllSchedulesTable from '@/components/dashboard/all-schedules-table';
import type { Employee, WorkSchedule } from '@/lib/types';

export default function SchedulePage() {
  const { toast } = useToast();
  const { employee } = useAuth();
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [weekToShow, setWeekToShow] = useState<Date[]>([]);
  
  // For AllSchedulesTable
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);

  useEffect(() => {
    const today = new Date();
    const startOfNextWeek = startOfWeek(addDays(today, 7), { weekStartsOn: 1 });
    const endOfNextWeek = endOfWeek(addDays(today, 7), { weekStartsOn: 1 });
    const nextWeekDays = eachDayOfInterval({ start: startOfNextWeek, end: endOfNextWeek });
    setWeekToShow(nextWeekDays);
  }, []);

   useEffect(() => {
    async function fetchUserData() {
      if (employee && weekToShow.length > 0) {
        setIsLoading(true);
        const allSchedules = await getWorkSchedules();
        setSchedules(allSchedules);

        const nextWeekStartString = format(weekToShow[0], 'yyyy-MM-dd');

        const userScheduleForNextWeek = allSchedules.find(s => 
          s.employeeId === employee.id &&
          s.dates.some(d => {
              const scheduleWeekStart = startOfWeek(parseISO(d), { weekStartsOn: 1 });
              return format(scheduleWeekStart, 'yyyy-MM-dd') === nextWeekStartString;
          })
        );
        
        if (userScheduleForNextWeek) {
          setSelectedDays(userScheduleForNextWeek.dates.map(d => parseISO(d)));
          setHasSubmitted(true);
          // If user has submitted, we also need employee data for the table
          const allEmployees = await getEmployees();
          setEmployees(allEmployees);
        } else {
          setSelectedDays([]);
          setHasSubmitted(false);
        }
        setIsLoading(false);
      }
    }
    fetchUserData();
  }, [employee, weekToShow]);


  const handleDayClick = (day: Date) => {
    if(hasSubmitted) {
        toast({
            title: "Already Submitted",
            description: "You have already submitted your schedule for this week.",
            variant: "destructive"
        });
        return;
    }
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
        setHasSubmitted(true);
        // Refetch employees for the table view
        const allEmployees = await getEmployees();
        setEmployees(allEmployees);
        toast({
            title: "Schedule Submitted!",
            description: `Your preferred days for next week have been saved.`,
        });
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

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (hasSubmitted) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">All Work Schedules</CardTitle>
                <CardDescription>
                    This table displays the weekly work schedule for all employees for the current week. Your submission for next week has been recorded.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AllSchedulesTable employees={employees} schedules={schedules} />
            </CardContent>
        </Card>
    );
  }


  return (
      <Card>
          <CardHeader>
              <CardTitle className="font-headline text-2xl">My Weekly Schedule</CardTitle>
              <CardDescription>
                  Select your preferred work days for next week. You can select up to 3 days.
              </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
                <WeeklyCalendar 
                    week={weekToShow}
                    selectedDays={selectedDays}
                    onDayClick={handleDayClick}
                />
                <div className='text-center text-sm text-muted-foreground'>
                    { hasSubmitted 
                        ? `You have submitted your schedule for this week.`
                        : selectedDays.length > 0 
                        ? `You have selected ${selectedDays.length} day(s).`
                        : "Please pick up to 3 days."
                    }
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end mt-4">
                <Button onClick={handleSubmit} disabled={isSubmitting || selectedDays.length === 0 || hasSubmitted}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        hasSubmitted ? 'Submitted' : 'Submit Schedule'
                    )}
                </Button>
            </CardFooter>
      </Card>
  );
}


