
"use client";

import { useState } from 'react';
import { addDays, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import WeeklyCalendar from '@/components/dashboard/weekly-calendar';

export default function SchedulePage() {
  const { toast } = useToast();
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);

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
    </Card>
  );
}

