"use client";

import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logErrorAction } from "./errors/actions";
import { Bug } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to your database
    console.error(error);
    logErrorAction({
        message: error.message,
        file: "Dashboard Global Boundary",
        stackTrace: error.stack || "No stack trace available",
        level: 'error',
    });
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                    <Bug className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="mt-4">Something Went Wrong</CardTitle>
                <CardDescription>
                    An unexpected error has occurred. The development team has been notified.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => reset()}>
                    Try Again
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
