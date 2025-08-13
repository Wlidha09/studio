

"use client";

import { useState, useEffect } from "react";
import type { Employee, WorkSchedule } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, parseISO } from "date-fns";
import { Loader2, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AllSchedulesTableProps {
    employees: Employee[];
    schedules: WorkSchedule[];
}

export default function AllSchedulesTable({ employees, schedules }: AllSchedulesTableProps) {
    const [weekDays, setWeekDays] = useState<Date[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const today = new Date();
        const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
        const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start: startOfThisWeek, end: endOfThisWeek });
        setWeekDays(days);
        setIsLoading(false);
    }, []);

    const getEmployeeScheduleForWeek = (employeeId: string) => {
        if (weekDays.length === 0) return [];
        const weekStartString = format(weekDays[0], 'yyyy-MM-dd');
        
        const schedule = schedules.find(s => 
            s.employeeId === employeeId &&
            s.dates.some(d => {
                const scheduleWeekStart = startOfWeek(parseISO(d), { weekStartsOn: 1 });
                return format(scheduleWeekStart, 'yyyy-MM-dd') === weekStartString;
            })
        );
        return schedule ? schedule.dates.map(d => parseISO(d)) : [];
    };

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
                        <TableHead className="min-w-[200px]">Employee</TableHead>
                        {weekDays.map(day => (
                            <TableHead key={day.toISOString()} className="text-center">
                                {format(day, 'EEE')} <br/> {format(day, 'd')}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map(employee => {
                        const employeeScheduledDays = getEmployeeScheduleForWeek(employee.id);
                        return (
                            <TableRow key={employee.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={employee.avatar} alt={employee.name} />
                                            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{employee.name}</span>
                                    </div>
                                </TableCell>
                                {weekDays.map(day => {
                                    const isWorking = employeeScheduledDays.some(scheduledDay => isSameDay(day, scheduledDay));
                                    return (
                                        <TableCell key={day.toISOString()} className="text-center">
                                            {isWorking && <Check className="h-5 w-5 mx-auto text-green-500" />}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

