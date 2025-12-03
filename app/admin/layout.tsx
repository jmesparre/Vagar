import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const collapsedCookie = cookieStore.get("adminSidebarCollapsed");
  const isCollapsed = collapsedCookie?.value === "true";

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 h-screen overflow-hidden">
      <AdminSidebar initialCollapsed={isCollapsed} />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
        <Toaster />
      </main>
    </div>
  );
}
