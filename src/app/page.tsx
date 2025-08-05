import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex items-center">
              <Briefcase className="h-6 w-6 mr-2" />
              <span className="font-bold">HResource</span>
            </div>
          </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              An intuitive management system for your HR needs
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Streamline your HR processes with our modern platform. From employee onboarding to payroll, we've got you covered.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="link" size="lg">
                <a href="#">Learn more &rarr;</a>
              </Button>
            </div>
          </div>
        </section>
        <section className="container space-y-6 bg-slate-50/50 py-8 dark:bg-transparent md:py-12 lg:py-24">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                Modern. Fast. Reliable.
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                HResource is built on top of the latest technologies to provide a seamless and fast experience for your entire team.
                </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                    <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                        <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                            <path d="M12.75 16.5C12.75 17.3284 12.0784 18 11.25 18C10.4216 18 9.75 17.3284 9.75 16.5C9.75 15.6716 10.4216 15 11.25 15C12.0784 15 12.75 15.6716 12.75 16.5Z" />
                            <path d="M15.75 12C15.75 12.8284 15.0784 13.5 14.25 13.5C13.4216 13.5 12.75 12.8284 12.75 12C12.75 11.1716 13.4216 10.5 14.25 10.5C15.0784 10.5 15.75 11.1716 15.75 12Z" />
                            <path d="M8.25 12C8.25 12.8284 7.57843 13.5 6.75 13.5C5.92157 13.5 5.25 12.8284 5.25 12C5.25 11.1716 5.92157 10.5 6.75 10.5C7.57843 10.5 8.25 11.1716 8.25 12Z" />
                            <path d="M12.75 7.5C12.75 8.32843 12.0784 9 11.25 9C10.4216 9 9.75 8.32843 9.75 7.5C9.75 6.67157 10.4216 6 11.25 6C12.0784 6 12.75 6.67157 12.75 7.5Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 19.5C7.85786 19.5 4.5 16.1421 4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12C19.5 16.1421 16.1421 19.5 12 19.5Z" />
                        </svg>
                        <div className="space-y-2">
                            <h3 className="font-bold">Feature-rich</h3>
                            <p className="text-sm text-muted-foreground">Packed with features to streamline your HR processes.</p>
                        </div>
                    </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                    <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                        <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current"><path d="M21.707 13.293l-11-11a1 1 0 00-1.414 0l-11 11a1 1 0 000 1.414l11 11a1 1 0 001.414 0l11-11a1 1 0 000-1.414zM12 21.586L3.414 13 12 4.414 20.586 13 12 21.586z" /></svg>
                        <div className="space-y-2">
                            <h3 className="font-bold">Modern Design</h3>
                            <p className="text-sm">Sleek and intuitive interface that's easy to use.</p>
                        </div>
                    </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                    <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                        <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" /><path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" /></svg>
                        <div className="space-y-2">
                            <h3 className="font-bold">24/7 Uptime</h3>
                            <p className="text-sm">Reliable and always available when you need it.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <footer className="py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by Studio. The source code is available on GitHub.
            </p>
        </div>
      </footer>
    </div>
  );
}
