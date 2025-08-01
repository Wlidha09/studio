import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function AttendancePage() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Clock className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-2xl">Time and Attendance</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-semibold text-foreground">Feature Coming Soon</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                We're currently building out our time and attendance tracking system. Check back soon for updates!
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
