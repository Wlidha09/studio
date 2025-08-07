
"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { WorkSchedule } from "@/lib/types";
import { format, parseISO } from "date-fns";

interface WorkSchedulesTableProps {
    initialSchedules: WorkSchedule[];
}

export default function WorkSchedulesTable({ initialSchedules }: WorkSchedulesTableProps) {
    const [schedules] = useState<WorkSchedule[]>(initialSchedules);
    
    const sortedSchedules = [...schedules].sort((a, b) => 
        new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    );

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
                    {sortedSchedules.map((schedule) => (
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
    );
}
