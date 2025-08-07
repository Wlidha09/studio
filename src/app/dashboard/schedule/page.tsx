
"use client";

import { useState } from 'react';
import { addDays, startOfWeek, endOfWeek } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';

export default function SchedulePage() {
  const { toast } = useToast();
  const [days, setDays] = useState<Date[] | undefined>();

  const nextWeek = startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 });

  const handleSelect = (selectedDays: Date[] | undefined) => {
    if (selectedDays && selectedDays.length > 3) {
      toast({
        title: "Selection Limit Reached",
        description: "You can only select up to 3 days.",
        variant: "destructive",
      });
      // Keep the previous selection
      setDays(days);
    } else {
      setDays(selectedDays);
    }
  };

  let footer = <p>Please pick one or more days.</p>;
  if (days && days.length > 0) {
    footer = <p>You selected {days.length} day(s).</p>;
  }


  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Schedule</CardTitle>
            <CardDescription>
                Select up to 3 days from next week's calendar.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
             <Calendar
                mode="multiple"
                min={3}
                selected={days}
                onSelect={handleSelect}
                defaultMonth={nextWeek}
                fromDate={nextWeek}
                toDate={endOfWeek(nextWeek, { weekStartsOn: 1})}
                className="rounded-md border"
                footer={footer}
                showOutsideDays={false}
                disableNavigation
            />
        </CardContent>
    </Card>
  );
}
