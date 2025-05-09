"use client";
import { AuthContext } from "@/contexts/authContext";
import { getProfile, Profile } from "@/repository/auth.repository";
import { Loader } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);

        if (pathname === "/login") {
          router.replace("/dashboard");
        }
      } catch (error) {
        if (pathname.startsWith("/dashboard")) {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading && pathname.startsWith("/dashboard")) {
    return (
      <div className="bg-background flex w-screen h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
