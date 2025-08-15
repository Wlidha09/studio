
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
import { addDays, startOfWeek, endOfWeek, format, parseISO } from 'date-fns';

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
        const startOfNextWeek = startOfWeek(addDays(today, 7), { weekStartsOn: 1 });
        const nextWeekStartString = format(startOfNextWeek, 'yyyy-MM-dd');
        
        const allEmployees = await getEmployees();
        const allSchedules = await getWorkSchedules();

        const employeesWithNextWeekSchedule = new Set(
            allSchedules
                .filter(s => {
                    const scheduleWeekStart = startOfWeek(parseISO(s.dates[0]), { weekStartsOn: 1 });
                    return format(scheduleWeekStart, 'yyyy-MM-dd') === nextWeekStartString;
                })
                .map(s => s.employeeId)
        );

        const employeesToNotify = allEmployees.filter(emp => !employeesWithNextWeekSchedule.has(emp.id) && emp.fcmToken);

        if (employeesToNotify.length === 0) {
            return {
                success: true,
                message: "All employees have submitted their schedules for next week.",
                notifiedCount: 0,
            };
        }
        
        const notificationTitle = "Schedule Reminder";
        const notificationBody = "Please submit your work schedule for next week.";

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
        return {
            success: false,
            message: "An error occurred while sending reminders.",
            notifiedCount: 0,
        };
    }
  }
);
