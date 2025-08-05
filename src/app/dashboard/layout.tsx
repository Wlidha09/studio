import DashboardSidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { RoleProvider } from "@/contexts/role-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset>
            <Header />
            <main className="flex-1 p-4 md:p-8 bg-background overflow-y-auto">
              {children}
            </main>
          </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  );
}
