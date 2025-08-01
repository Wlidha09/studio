import DashboardSidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleProvider } from "@/contexts/role-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <DashboardSidebar />
          <main className="flex-1 flex flex-col">
            <Header />
            <div className="flex-1 p-4 md:p-8 bg-background overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </RoleProvider>
  );
}
