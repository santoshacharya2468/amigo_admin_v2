"use client";

import DynamicBreadcrumb from "@/components/app-breadcrumb";
import { AppSidebar } from "@/components/app-sidebar";
import { NavActions } from "@/components/nav-actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { Loader } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserProfile();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden">
        <header className="flex z-10 h-12 shrink-0 items-center bg-popover/30 backdrop-blur-lg  gap-2 border-border/50 border-b-2 pb-4 mt-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        <ScrollArea>{children}</ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
