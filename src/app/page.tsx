import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <main className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Briefcase className="h-12 w-12 text-primary" />
            <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              HResource
            </h1>
          </div>

          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Streamline your HR processes with our intuitive management system. From employee onboarding to payroll, we've got you covered.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="link" size="lg">
              <a href="#">Learn more &rarr;</a>
            </Button>
          </div>
        </div>

        <div className="mt-16 flow-root sm:mt-24">
          <Card className="rounded-xl shadow-2xl">
            <CardContent className="p-2">
              <Image
                src="https://placehold.co/1200x600.png"
                alt="App screenshot"
                width={1200}
                height={600}
                className="rounded-lg"
                data-ai-hint="human resources dashboard"
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} HResource. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
