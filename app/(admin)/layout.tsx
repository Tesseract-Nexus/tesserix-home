"use client";

import { AuthProvider } from "@/lib/auth/auth-context";
import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <div className="lg:pl-64">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
