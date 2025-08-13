import AllSchedulesTable from "@/components/dashboard/all-schedules-table";
import { getEmployees, getWorkSchedules } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function AllSchedulesPage() {
    const employees = await getEmployees();
    const schedules = await getWorkSchedules();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">All Work Schedules</CardTitle>
                <CardDescription>
                    This table displays the weekly work schedule for all employees for the current week.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AllSchedulesTable employees={employees} schedules={schedules} />
            </CardContent>
        </Card>
    );
}
