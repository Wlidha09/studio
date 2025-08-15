
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { Bell, Search, LogOut } from "lucide-react";
import { Input } from "../ui/input";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getMessagingToken, onMessageListener } from "@/lib/firebase-messaging-client";
import { updateEmployee } from "@/lib/firestore";
import React from "react";

function getPageTitle(pathname: string) {
  const segment = pathname.split("/").pop() || "dashboard";
  if (segment === "dashboard") return "Overview";
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

export default function Header() {
  const pathname = usePathname();
  const { employee, setEmployee } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [notificationPermission, setNotificationPermission] = React.useState<NotificationPermission | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [])

  React.useEffect(() => {
    onMessageListener()
      .then((payload) => {
        toast({
          title: payload.notification.title,
          description: payload.notification.body,
        });
      })
      .catch((err) => console.log("failed: ", err));
  }, [toast]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const handleRequestPermission = async () => {
    if (!employee) return;

    if (Notification.permission === 'granted') {
      toast({ title: 'Notifications are already enabled.' });
      return;
    }
    
    if (Notification.permission === 'denied') {
        toast({ title: 'Notification permission was previously denied. Please enable it in your browser settings.', variant: 'destructive'});
        return;
    }

    try {
        const token = await getMessagingToken();
        if (token) {
            const updatedEmployee = { ...employee, fcmToken: token };
            await updateEmployee(updatedEmployee);
            setEmployee(updatedEmployee);
            setNotificationPermission('granted');
            toast({ title: 'Notifications Enabled!', description: 'You will now receive desktop notifications.' });
        } else {
             toast({ title: 'Permission Needed', description: 'Notification permission is required to receive updates.' });
        }
    } catch(err) {
        console.error("Error getting notification permission", err);
        toast({ title: 'Error', description: 'Could not enable notifications.', variant: 'destructive'});
    }
  };


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold tracking-tight">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
         <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] rounded-full"
          />
        </div>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={handleRequestPermission}>
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={employee?.avatar} alt={employee?.name} />
                <AvatarFallback>{employee?.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p>{employee?.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{employee?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
