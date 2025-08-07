
"use client";

import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface WeeklyCalendarProps {
    week: Date[];
    selectedDays: Date[];
    onDayClick: (day: Date) => void;
}

export default function WeeklyCalendar({ week, selectedDays, onDayClick }: WeeklyCalendarProps) {
    return (
        <div className="w-full max-w-3xl border rounded-lg overflow-hidden">
            <div className="grid grid-cols-7">
                {week.map(day => (
                    <div key={day.toISOString()} className="text-center border-b border-r last:border-r-0">
                        <div className="p-2 bg-muted">
                            <p className="text-sm font-medium">{format(day, 'EEE')}</p>
                            <p className="text-2xl font-bold">{format(day, 'd')}</p>
                        </div>
                        <div 
                            className={cn(
                                "p-4 cursor-pointer h-24 flex items-center justify-center transition-colors",
                                isSameDay(new Date(), day) ? "bg-blue-50" : "bg-background",
                                selectedDays.some(d => isSameDay(d, day)) 
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                                    : "hover:bg-accent hover:text-accent-foreground"
                            )}
                            onClick={() => onDayClick(day)}
                        >
                            {/* You can add content for each day here if needed */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

