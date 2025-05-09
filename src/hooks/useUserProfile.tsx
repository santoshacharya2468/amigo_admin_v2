import { useAuth } from "@/contexts/authContext";
export const useUserProfile = () => {
  const { user, setUser } = useAuth();
  return { user, setUser };
};
