"use client";

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
import { useRole } from "@/contexts/role-context";
import { employees } from "@/lib/data";
import { Bell, Search } from "lucide-react";
import { Input } from "../ui/input";

function getPageTitle(pathname: string) {
  const segment = pathname.split("/").pop() || "dashboard";
  if (segment === "dashboard") return "Overview";
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

export default function Header() {
  const pathname = usePathname();
  const { role } = useRole();

  const currentUser = employees.find(e => e.role === role);

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
        <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${currentUser?.name.charAt(0)}`} alt={currentUser?.name} />
                <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p>{currentUser?.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{currentUser?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
