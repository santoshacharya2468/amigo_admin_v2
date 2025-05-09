"use client";

import {
  AlertCircle,
  ArrowLeftRight,
  BarChart2,
  Bell,
  Box,
  BuildingIcon,
  ChartPieIcon,
  CircleDollarSign,
  CircleFadingArrowUpIcon,
  Clock,
  Copy,
  CrownIcon,
  FlagIcon,
  GiftIcon,
  Home,
  MessageCircle,
  MessageSquareReply,
  Presentation,
  Settings2,
  Swords,
  TicketCheckIcon,
  TrophyIcon,
  TvIcon,
  UserCheck2,
  UserIcon,
  Users
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: ChartPieIcon,
      isActive: true,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: UserIcon,
      isActive: true,
    },
    
    {
      title: "Exchange",
      url: "/dashboard/exchange",
      icon: ArrowLeftRight,
      isActive: true,
    },
    
    {
      title: "Gifts",
      url: "/dashboard/gifts",
      icon: GiftIcon,
      isActive: true,
    },
    {
      title: "Sales",
      url: "/dashboard/sales",
      icon: CircleDollarSign,
      isActive: true,
    },
    {
      title: "Livestreams",
      url: "/dashboard/liveStreams",
      icon: TvIcon,
      isActive: true,
    },
    {
      title: "Agencies",
      url: "/dashboard/agencies",
      icon: BuildingIcon,
      isActive: true,
    },
    {
      title: "Accounts",
      url: "/dashboard/accounts",
      icon: TicketCheckIcon,
      isActive: true,
    },
    {
      title: "Languages",
      url: "/dashboard/language",
      icon: Settings2,
      isActive: true,
    },
    {
      title: "User Promotions",
      url: "/dashboard/userPromotions",
      icon: CircleFadingArrowUpIcon,
      isActive: true,
    },
    {
      title: "Chats",
      url: "/dashboard/chats",
      icon: MessageCircle,
      isActive: true,
    },
   
    {
      title: "Rankings",
      url: "/dashboard/rankings",
      icon: TrophyIcon,
      isActive: true,
    },
    {
      title: "User Feedbacks",
      url: "/dashboard/userFeedbacks",
      icon: MessageSquareReply,
      isActive: true,
    },
    {
      title: "User Reports",
      url: "/dashboard/userReports",
      icon: FlagIcon,
      isActive: true,
    },

  ] as const,
};
export function NavMain() {
  const pathName = usePathname();
  return (
    <SidebarMenu className="mt-5">
      {data.navMain.map((item) => {
       
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              className="h-10"
              asChild
              isActive={pathName === item.url}
            >
              <Link href={item.url}>
                <item.icon className="me-1" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
