"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserProfile();
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!user && pathname.startsWith("/dashboard")) {
      window.location.href = "/login";
    }
  }, [user, pathname]);

  return <div className="flex h-screen items-center w-full">{children}</div>;
}
