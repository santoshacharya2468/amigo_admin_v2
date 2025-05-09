import { api } from "@/lib/api";

export interface Agency {
  id: number;
  name: string;
  phone: string;
  logo: string;
  description: string;
  userId: number;
  linkedUser: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgencyResponse {
  status: number;
  message: string;
  data: Agency[];
}

export interface AgencyCreate {
  id: number;
  name: string;
  description: string;
  email: string;
  password: string;
  phone: string;
  logo: string;
  verified?:boolean
}
export const AgencyRepository = {
  getAllAgencies: async (): Promise<Agency[]> => {
      const response = await api.get<AgencyResponse>("/agencies");
      return response.data.data;
  },
  createAgency: async (data: Omit<AgencyCreate,"id">): Promise<Agency> => {
      const response = await api.post<{ data: Agency }>("/agencies", data);
      return response.data.data;
  },

  updateAgency: async (id: string, data: Partial<AgencyCreate>): Promise<Agency> => {
      const response = await api.put<{ data: Agency }>(`/agencies/${id}`, data);
      return response.data.data;
  },

  deleteAgency: async (id: string): Promise<void> => {
      await api.delete(`/agencies/${id}`);
    
  },
};