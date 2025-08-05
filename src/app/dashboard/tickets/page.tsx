
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEmployees, getLeaveRequests, getHolidays } from "@/lib/firestore";
import type { Employee, LeaveRequest, Holiday } from "@/lib/types";
import { differenceInDays, getDaysInMonth, isSameDay, isWeekend, parseISO, startOfMonth } from "date-fns";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface TicketResult {
    totalDays: number;
    workableDays: number;
    workedDays: number;
    leaveDays: number;
    publicHolidaysCount: number;
    weekendDays: number;
}


export default function TicketPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(new Date()));
    const [ticketResult, setTicketResult] = useState<TicketResult | null>(null);

    useEffect(() => {
        async function fetchData() {
            const currentYear = new Date().getFullYear();
            const [emps, leaves, hols] = await Promise.all([
                getEmployees(), 
                getLeaveRequests(),
                getHolidays(currentYear)
            ]);
            setEmployees(emps);
            setLeaveRequests(leaves);
            setHolidays(hols);
        }
        fetchData();
    }, []);
    
    const calculateWorkDays = () => {
        if (!selectedEmployeeId) return;

        const totalDays = getDaysInMonth(selectedMonth);
        let weekendDays = 0;
        
        const paidHolidaysInMonth = holidays.filter(h => 
            h.paid && parseISO(h.date).getMonth() === selectedMonth.getMonth()
        ).map(h => parseISO(h.date));

        let publicHolidaysCount = 0;

        for (let i = 1; i <= totalDays; i++) {
            const day = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i);
            if (isWeekend(day)) {
                weekendDays++;
            } else if (paidHolidaysInMonth.some(holiday => isSameDay(holiday, day))) {
                publicHolidaysCount++;
            }
        }

        const employeeLeaveRequests = leaveRequests.filter(
            (req) => req.employeeId === selectedEmployeeId && req.status === "Approved"
        );
        
        let leaveDays = 0;
        employeeLeaveRequests.forEach(req => {
            const startDate = parseISO(req.startDate);
            const endDate = parseISO(req.endDate);
            if(startDate.getMonth() === selectedMonth.getMonth() || endDate.getMonth() === selectedMonth.getMonth()) {
                 const days = differenceInDays(endDate, startDate) + 1;
                 leaveDays += days;
            }
        });

        const workableDays = totalDays - weekendDays - publicHolidaysCount;
        const workedDays = workableDays - leaveDays;

        setTicketResult({
            totalDays,
            workableDays,
            workedDays,
            leaveDays,
            publicHolidaysCount,
            weekendDays,
        });
    }

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Monthly Work Ticket</CardTitle>
                <CardDescription>
                    Calculate the number of days worked per month for an employee, including paid holidays and leave.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2">
                        <Label>Employee</Label>
                        <Select onValueChange={setSelectedEmployeeId} value={selectedEmployeeId ?? undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map(emp => (
                                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                         <Label>Month</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !selectedMonth && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedMonth ? selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' }) : <span>Pick a month</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={selectedMonth}
                                onSelect={(date) => date && setSelectedMonth(startOfMonth(date))}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="flex items-end">
                        <Button onClick={calculateWorkDays} className="w-full" disabled={!selectedEmployeeId}>Generate Ticket</Button>
                    </div>
                </div>

                {ticketResult && (
                    <div className="border-t pt-6">
                        <h3 className="text-xl font-semibold mb-4">Calculation Result</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Total Days in Month</p>
                                <p className="text-2xl font-bold">{ticketResult.totalDays}</p>
                            </div>
                             <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Weekend Days</p>
                                <p className="text-2xl font-bold">{ticketResult.weekendDays}</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Paid Public Holidays</p>
                                <p className="text-2xl font-bold">{ticketResult.publicHolidaysCount}</p>
                            </div>
                            <div className="p-4 bg-secondary rounded-lg">
                                <p className="text-sm text-secondary-foreground">Workable Days</p>
                                <p className="text-2xl font-bold">{ticketResult.workableDays}</p>
                            </div>
                            <div className="p-4 bg-destructive/20 rounded-lg">
                                <p className="text-sm text-destructive">Leave Days Taken</p>
                                <p className="text-2xl font-bold text-destructive">{ticketResult.leaveDays}</p>
                            </div>
                            <div className="p-4 bg-primary rounded-lg text-primary-foreground">
                                <p className="text-sm">Net Worked Days</p>
                                <p className="text-2xl font-bold">{ticketResult.workedDays}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
