"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Gift,
  Image as ImageIcon,
  Video,
  Building2,
  Egg,
  MessageSquare,
  Mic,
  Video as VideoIcon,
  Eye,
  CreditCard,
  Users as UsersIcon,
  DollarSign,
} from "lucide-react";
import ApplicationPage from "@/components/application-page";
import { api } from "@/lib/api";
import Loading from "@/components/loading";

interface DashboardStats {
  totalusers: number;
  newuserstoday: number;
  totalgifts: number;
  totalimages: number;
  totalonginglivestreamings: number;
  totalagency: number;
  totaleggs: number;
  totalfeedback: number;
  totalaudiointros: number;
  totalvideointros: number;
  totalprofilevisits: number;
  totaluserspaidtoday: number;
  totaluserspaidlifetime: number;
  totalusersfeetoday: number;
}

function StatsCard({
  title,
  value,
  icon: Icon,
  className,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery<{ data: DashboardStats }>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await api.get("/users/dashboard-stats");
      return response.data;
    },
  });

  const stats = data?.data;

  if (isLoading) {
    return (
      <ApplicationPage title="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
      <Loading/>
        </div>
      </ApplicationPage>
    );
  }

  return (
    <ApplicationPage title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats?.totalusers || 0}
          icon={Users}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10"
        />
        <StatsCard
          title="New Users Today"
          value={stats?.newuserstoday || 0}
          icon={UsersIcon}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10"
        />
        <StatsCard
          title="Total Gifts"
          value={stats?.totalgifts || 0}
          icon={Gift}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10"
        />
        <StatsCard
          title="Total Images"
          value={stats?.totalimages || 0}
          icon={ImageIcon}
          className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-900/10"
        />
        <StatsCard
          title="Live Streamings"
          value={stats?.totalonginglivestreamings || 0}
          icon={Video}
          className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10"
        />
        <StatsCard
          title="Total Agencies"
          value={stats?.totalagency || 0}
          icon={Building2}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10"
        />
        <StatsCard
          title="Total Eggs"
          value={stats?.totaleggs || 0}
          icon={Egg}
          className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10"
        />
        <StatsCard
          title="Total Feedback"
          value={stats?.totalfeedback || 0}
          icon={MessageSquare}
          className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10"
        />
        <StatsCard
          title="Audio Intros"
          value={stats?.totalaudiointros || 0}
          icon={Mic}
          className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10"
        />
        <StatsCard
          title="Video Intros"
          value={stats?.totalvideointros || 0}
          icon={VideoIcon}
          className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-900/10"
        />
        <StatsCard
          title="Profile Visits"
          value={stats?.totalprofilevisits || 0}
          icon={Eye}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10"
        />
        <StatsCard
          title="Users Paid Today"
          value={stats?.totaluserspaidtoday || 0}
          icon={CreditCard}
          className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-900/10"
        />
        <StatsCard
          title="Total Paid Users"
          value={stats?.totaluserspaidlifetime || 0}
          icon={Users}
          className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-900/10"
        />
        <StatsCard
          title="User Fees Today"
          value={stats?.totalusersfeetoday || 0}
          icon={DollarSign}
          className="bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 dark:from-fuchsia-900/20 dark:to-fuchsia-900/10"
        />
      </div>
    </ApplicationPage>
  );
}
