
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkSchedules } from "@/lib/firestore";
import WorkSchedulesTable from "@/components/dashboard/work-schedules-table";

export default async function WorkSchedulesPage() {
    const schedules = await getWorkSchedules();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Submitted Work Schedules</CardTitle>
                <CardDescription>
                    This table displays all the weekly work schedules submitted by employees.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <WorkSchedulesTable initialSchedules={schedules} />
            </CardContent>
        </Card>
    )
}
