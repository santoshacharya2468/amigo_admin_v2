"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { School2Icon, UserIcon } from "lucide-react";
import Link from "next/link";

export function TeamSwitcher() {
  const { user } = useUserProfile();
  if (!user) return null;
  return (
    <SidebarMenu className="hover:cursor-pointer mt-3">
      <Link href={"/dashboard"}>
        <SidebarMenuItem>
          <div className="w-full flex flex-row gap-2 items-center px-1.5">
            <div
              className={cn(
                "flex aspect-square  size-8 items-center justify-center rounded-[4px]   text-sidebar-primary-foreground",
                user.role=="agency" && "bg-blue-500",
                user.role === "admin" && "bg-red-500"
              )}
            >
              {user.role === "agency" && <School2Icon className="size-5" />}
              {user.role === "admin" && <UserIcon className="size-5" />}
            </div>
            <span className="truncate font-bold text-xl">{capitalizeFirstLetter(user.username[0]) }{
              capitalizeFirstLetter(user.username[1])}</span>
          </div>
        </SidebarMenuItem>
      </Link>
    </SidebarMenu>
  );
}
