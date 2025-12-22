"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Determine role from URL path
    const role = pathname.startsWith("/dashboard/buyer") ? "BUYER" : "DEVELOPER";

    // If buyer dashboard, don't wrap with DashboardLayout since buyer page has its own sidebar
    if (pathname.startsWith("/dashboard/buyer")) {
        return <>{children}</>;
    }

    return <DashboardLayout role={role}>{children}</DashboardLayout>;
}
