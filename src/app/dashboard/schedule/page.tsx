
"use client";

import { useState } from 'react';
import { addDays, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import WeeklyCalendar from '@/components/dashboard/weekly-calendar';
import { useAuth } from '@/contexts/auth-context';
import { addWorkSchedule } from '@/lib/firestore';
import { Loader2 } from 'lucide-react';

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
    setSelectedDays(currentSelectedDays => {
      const isAlreadySelected = currentSelectedDays.some(d => isSameDay(d, day));
      if (isAlreadySelected) {
        return currentSelectedDays.filter(d => !isSameDay(d, day));
      }
      if (currentSelectedDays.length < 3) {
        return [...currentSelectedDays, day];
      } else {
        toast({
          title: "Selection Limit Reached",
          description: "You can only select up to 3 days.",
          variant: "destructive",
        });
        return currentSelectedDays;
      }
    });
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
    <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Weekly Schedule</CardTitle>
            <CardDescription>
                Select your preferred work days for next week. You can select up to 3 days.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
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
        </CardContent>
        <CardFooter className="flex justify-end">
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
    </Card>
  );
}
