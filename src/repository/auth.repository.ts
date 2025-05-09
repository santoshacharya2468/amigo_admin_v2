import { api } from "@/lib/api";
import { redirect } from "next/navigation";



export interface Profile {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  gender: string;
  country?: string;
  birthday: string;
  socialId?: string;
  provider: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lat?: number;
  lng?: number;
  bio?: string;
  showOnFindMatch: boolean;
  showOnline: boolean;
  showIntroAlert: boolean;
  introAudio?: string;
  introVideo?: string;
  appLanguage?: string;
  language?: string;
  points: number;
  relationshipStatus?: string;
  workStatus?: string;
  education?: string;
  interests?: string[];
  audioCallCosts: number;
  videoCallCosts: number;
  audioGreetingCosts: number;
  videoGreetingCosts: number;
  bodyType?: string;
  height?: number;
  religion?: string;
  ethnicity?: string;
  maritalStatus: string;
  smoke: boolean;
  drink: boolean;
  pets?: string;
  lastSeen?: string;
  isOnline: boolean;
  role: "agency" | "admin" | "user";
  hasExchangePassword: boolean;
  eggs: number;
}
export async function getProfile() {
  const response = await api.get("/users/me");
  return response.data.data as Profile;
}

export async function login(
  username: string,
  password: string,
) {
  const response = await api.post("/auth/login", {
    username,
    password,
  });
  localStorage.setItem("token", response.data.data.refresh_token);
  return response.data.data.user as Profile;
}

export async function logout() {
  localStorage.removeItem("token");
  return "ok"
}

interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export const changePassword = async (data: ChangePasswordDto) => {
  const response = await api.patch("/auth/change-password", data);
  return response.data;
};
