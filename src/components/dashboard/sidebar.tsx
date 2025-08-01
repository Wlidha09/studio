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

const menuItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Overview",
    roles: ["Owner", "RH", "Manager", "Employee", "Dev"],
  },
  {
    href: "/dashboard/employees",
    icon: Users,
    label: "Employees",
    roles: ["Owner", "RH", "Manager", "Dev"],
  },
  {
    href: "/dashboard/candidates",
    icon: UserCircle,
    label: "Candidates",
    roles: ["Owner", "RH", "Manager", "Dev"],
  },
  {
    href: "/dashboard/departments",
    icon: Building2,
    label: "Departments",
    roles: ["Owner", "RH", "Dev"],
  },
  {
    href: "/dashboard/leaves",
    icon: CalendarDays,
    label: "Leave Requests",
    roles: ["Owner", "RH", "Manager", "Employee"],
  },
  {
    href: "/dashboard/attendance",
    icon: Clock,
    label: "Attendance",
    roles: ["Owner", "RH", "Manager", "Employee", "Dev"],
  },
  {
    href: "/dashboard/job-description-generator",
    icon: Wand2,
    label: "AI Job Generator",
    roles: ["Owner", "RH", "Manager", "Dev"],
  },
  {
    href: "/dashboard/seed-database",
    icon: Database,
    label: "Seed Database",
    roles: ["Dev", "Owner"],
  }
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { role, setRole } = useRole();

  const isNavItemActive = (href: string) => {
    return pathname === href;
  };

  const availableMenuItems = menuItems.filter(item => (item.roles as UserRole[]).includes(role));

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-primary" />
          <h2 className="font-headline text-2xl font-semibold text-sidebar-foreground">
            HResource
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {availableMenuItems.map((item) => (
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
            <Link href="/">
              <SidebarMenuButton>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
