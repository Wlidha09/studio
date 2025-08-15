
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { sendScheduleReminders } from '@/ai/flows/send-schedule-reminders';
import { BellRing, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SendScheduleRemindersPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [resultMessage, setResultMessage] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSendReminders = async () => {
        setIsLoading(true);
        setResultMessage(null);
        try {
            const result = await sendScheduleReminders();
            if (result.success) {
                toast({
                    title: 'Reminders Sent!',
                    description: result.message,
                });
                setResultMessage(result.message);
            } else {
                toast({
                    title: 'Error',
                    description: result.message,
                    variant: 'destructive',
                });
                 setResultMessage(result.message);
            }
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'An unexpected error occurred.',
                variant: 'destructive',
            });
            setResultMessage('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Send Schedule Reminders</CardTitle>
                <CardDescription>
                    This will send a notification to all employees who have not yet submitted their work schedule for the upcoming week.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert>
                    <BellRing className="h-4 w-4" />
                    <AlertTitle>How it works</AlertTitle>
                    <AlertDescription>
                        Clicking the button will check all employee schedules for next week. Anyone who hasn't submitted will receive a desktop notification, provided they have granted permission.
                    </AlertDescription>
                </Alert>
                <Button onClick={handleSendReminders} disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending Reminders...
                        </>
                    ) : (
                        <>
                            <BellRing className="mr-2 h-4 w-4" />
                             Send Reminder Notifications
                        </>
                    )}
                </Button>
                {resultMessage && (
                    <Alert variant={resultMessage.includes('Error') || resultMessage.includes('Failed') ? 'destructive' : 'default'}>
                        <AlertTitle>Result</AlertTitle>
                        <AlertDescription>{resultMessage}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}

