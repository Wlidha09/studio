import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Zap, ShieldCheck, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="mr-4 flex items-center">
              <Briefcase className="h-7 w-7 mr-3 text-logo" />
              <span className="text-xl font-bold">HResource</span>
            </div>
          </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-4xl flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
              An Intuitive Management System for Your HR Needs
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Streamline your HR processes with our modern platform. From employee onboarding to payroll, we've got you covered.
            </p>
            <div className="space-x-4 mt-4">
              <Button asChild size="lg" className="px-8 py-6 text-lg">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </section>
        <section className="container space-y-8 py-8 dark:bg-background md:py-12 lg:py-24">
            <div className="mx-auto flex max-w-4xl flex-col items-center space-y-4 text-center">
                <h2 className="font-heading text-4xl leading-[1.1] sm:text-4xl md:text-5xl font-bold tracking-tight">
                  Modern. Fast. Reliable.
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                  HResource is built on top of the latest technologies to provide a seamless and fast experience for your entire team.
                </p>
            </div>
            <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                           <Zap className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Feature-rich</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Packed with features to streamline your HR processes.</p>
                    </CardContent>
                </Card>
                <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Modern & Secure</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Sleek and intuitive interface that's easy and safe to use.</p>
                    </CardContent>
                </Card>
                <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                     <CardHeader className="flex flex-row items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                           <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">24/7 Uptime</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Reliable and always available when you need it.</p>
                    </CardContent>
                </Card>
            </div>
        </section>
      </main>
      <footer className="py-6 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by Studio. The source code is available on GitHub.
            </p>
        </div>
      </footer>
    </div>
  );
}
