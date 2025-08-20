
'use server';

/**
 * @fileOverview Sends schedule submission reminders to employees.
 *
 * - sendScheduleReminders - A function that identifies employees who have not submitted their schedule and sends them a notification.
 * - SendScheduleRemindersOutput - The return type for the sendScheduleReminders function.
 */

import { ai } from '@/ai/genkit';
import { getEmployees, getWorkSchedules, sendNotification } from '@/lib/firestore';
import { z } from 'genkit';
import { addDays, startOfWeek, endOfWeek, parseISO, isWithinInterval, format } from 'date-fns';

const SendScheduleRemindersOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    notifiedCount: z.number(),
});
export type SendScheduleRemindersOutput = z.infer<typeof SendScheduleRemindersOutputSchema>;


export async function sendScheduleReminders(): Promise<SendScheduleRemindersOutput> {
  return sendScheduleRemindersFlow();
}

const sendScheduleRemindersFlow = ai.defineFlow(
  {
    name: 'sendScheduleRemindersFlow',
    outputSchema: SendScheduleRemindersOutputSchema,
  },
  async () => {
    try {
        const today = new Date();
        // Set the start of next week to Monday
        const startOfNextWeek = startOfWeek(addDays(today, 7), { weekStartsOn: 1 });
        const endOfNextWeek = endOfWeek(startOfNextWeek);
        
        const allEmployees = await getEmployees();
        const allSchedules = await getWorkSchedules();

        const employeesWithNextWeekSchedule = new Set(
            allSchedules
                .filter(s => {
                    // Ensure the schedule has dates before proceeding
                    if (!s.dates || s.dates.length === 0) {
                        return false;
                    }
                    // A schedule is for next week if ANY of its dates fall within the next week interval
                    return s.dates.some(dateStr => {
                        try {
                            const scheduleDate = parseISO(dateStr);
                            return isWithinInterval(scheduleDate, { start: startOfNextWeek, end: endOfNextWeek });
                        } catch (e) {
                            // Ignore invalid date strings
                            return false;
                        }
                    });
                })
                .map(s => s.employeeId)
        );

        const employeesToNotify = allEmployees.filter(emp => 
            emp.actif && // Only active employees
            emp.fcmToken && // Only employees with a notification token
            !employeesWithNextWeekSchedule.has(emp.id) // Only employees who have NOT submitted
        );

        if (employeesToNotify.length === 0) {
            return {
                success: true,
                message: "All active employees have submitted their schedules for next week, or no employees need reminders.",
                notifiedCount: 0,
            };
        }
        
        const notificationTitle = "Schedule Submission Reminder";
        const notificationBody = `Please remember to submit your work schedule for the week of ${format(startOfNextWeek, 'MMM d')}.`;

        for (const employee of employeesToNotify) {
            if (employee.fcmToken) {
                await sendNotification(employee.fcmToken, notificationTitle, notificationBody);
            }
        }
        
        return {
            success: true,
            message: `Successfully sent reminders to ${employeesToNotify.length} employees.`,
            notifiedCount: employeesToNotify.length,
        };

    } catch (error) {
        console.error("Error sending schedule reminders:", error);
        // Provide a more descriptive error message
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return {
            success: false,
            message: `An error occurred while sending reminders: ${errorMessage}`,
            notifiedCount: 0,
        };
    }
  }
);
