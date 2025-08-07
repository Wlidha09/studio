
"use client";

import { useState } from 'react';
import { addDays, startOfWeek, endOfWeek, format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';

export default function SchedulePage() {
  const { toast } = useToast();
  const [days, setDays] = useState<Date[] | undefined>();

  const today = new Date();
  const startOfNextWeek = startOfWeek(addDays(today, 7), { weekStartsOn: 1 });
  const endOfNextWeek = endOfWeek(addDays(today, 7), { weekStartsOn: 1 });

  const handleSelect = (selectedDays: Date[] | undefined) => {
    if (selectedDays && selectedDays.length > 3) {
      toast({
        title: "Selection Limit Reached",
        description: "You can only select up to 3 days.",
        variant: "destructive",
      });
      setDays(days);
    } else {
      setDays(selectedDays);
    }
  };

  let footer = <p>Please pick up to 3 days.</p>;
  if (days && days.length > 0) {
    footer = <p>You selected {days.length} day(s).</p>;
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Weekly Schedule</CardTitle>
            <CardDescription>
                Select your preferred work days for next week. You can select up to 3 days.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
             <Calendar
                mode="multiple"
                selected={days}
                onSelect={handleSelect}
                fromDate={startOfNextWeek}
                toDate={endOfNextWeek}
                defaultMonth={startOfNextWeek}
                className="rounded-md border"
                footer={footer}
                showOutsideDays={false}
                fixedWeeks
            />
        </CardContent>
    </Card>
  );
}
