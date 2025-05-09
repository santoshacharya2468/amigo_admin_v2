"use client";

import {
  ChevronsUpDown,
  LogOut
} from "lucide-react";

import ChangePasswordDialog from "@/app/(auth)/components/changePassword";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { logout } from "@/repository/auth.repository";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { setUser, user } = useUserProfile();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.avatar }
                  alt={user?.name ?? user?.email ?? ""}
                />
                <AvatarFallback className="rounded-lg bg-stone-800 text-white">
    {
      user?.name?.length !== 0 ? user?.name[0]:  (user?.email[0] ?? user.username[0])
    }
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.email ?? ""}
                </span>
                <span className="truncate text-xs">{user?.phone ?? ""}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg -ms-10"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.avatar}
                    alt={user?.name ?? ""}
                  />
                  <AvatarFallback className="rounded-lg">
                  {user?.name?.length !==0 ? user?.name[0]:  (user?.email[0] || user.username[0]) }
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name ?? ""}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <ChangePasswordDialog />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await toast.promise(logout(), {
                  loading: "Logging out...",
                  success: (data) => {
                    setUser(null);
                    router.replace("/login");
                    return "Logged out";
                  },
                  error: "Failed to log out",
                });
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
