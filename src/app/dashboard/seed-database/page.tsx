"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { seedDatabase } from "@/lib/firestore";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function SeedDatabasePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsLoading(true);
    const result = await seedDatabase();
    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Seed Database</CardTitle>
        <CardDescription>
          Click the button below to populate your Firestore database with the
          initial sample data. This is a one-time operation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSeed} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Seeding...
            </>
          ) : (
            "Seed Database"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
