
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Briefcase,
  Users,
  Building2,
  FileText,
  CalendarDays,
  Clock,
  Wand2,
  Home,
  LogOut,
  UserCircle,
  Database,
  ClipboardCheck,
  ShieldAlert,
} from "lucide-react";
import { useRole } from "@/contexts/role-context";
import type { UserRole } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";
import type { PageKey } from "@/lib/permissions";

const menuItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Overview",
    pageKey: "overview" as PageKey,
  },
  {
    href: "/dashboard/employees",
    icon: Users,
    label: "Employees",
    pageKey: "employees" as PageKey,
  },
  {
    href: "/dashboard/candidates",
    icon: UserCircle,
    label: "Candidates",
    pageKey: "candidates" as PageKey,
  },
  {
    href: "/dashboard/departments",
    icon: Building2,
    label: "Departments",
    pageKey: "departments" as PageKey,
  },
  {
    href: "/dashboard/leaves",
    icon: CalendarDays,
    label: "Leave Requests",
    pageKey: "leaves" as PageKey,
  },
  {
    href: "/dashboard/attendance",
    icon: Clock,
    label: "Attendance",
    pageKey: "attendance" as PageKey,
  },
  {
    href: "/dashboard/tickets",
    icon: ClipboardCheck,
    label: "Tickets",
    pageKey: "tickets" as PageKey,
  },
  {
    href: "/dashboard/job-description-generator",
    icon: Wand2,
    label: "AI Job Generator",
    pageKey: "job-description-generator" as PageKey,
  },
  {
    href: "/dashboard/roles",
    icon: ShieldAlert,
    label: "Roles",
    pageKey: "roles" as PageKey,
  },
  {
    href: "/dashboard/seed-database",
    icon: Database,
    label: "Seed Database",
    pageKey: "seed-database" as PageKey,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { role, setRole } = useRole();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const isNavItemActive = (href: string) => {
    return pathname === href;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-logo" />
          <h2 className="font-headline text-2xl font-semibold text-sidebar-foreground">
            HResource
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={isNavItemActive(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 space-y-2">
          <Label className="text-xs font-medium text-sidebar-foreground/70">Switch Role (Demo)</Label>
          <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
            <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Owner">Owner</SelectItem>
              <SelectItem value="RH">RH</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Employee">Employee</SelectItem>
              <SelectItem value="Dev">Dev</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
