import { api } from "@/lib/api"
import { User } from "./livestream.repository"

export interface UserReport {
  id: number
  userId: number
  targetUserId: number
  title: string
  content: string
  status: number
  createdAt: string
}

export interface UserReportWithUsers {
  userReport: UserReport
  user: User
  user2: User
}

export class UserReportRepository {
  static async getUserReports() {
    const response = await api.get("/users/reports")
    return response.data.data as UserReportWithUsers[]
  }

  static async updateReportStatus(id: number, status: number) {
    const response = await api.patch(`/users/reports/${id}`, { status })
    return response.data
  }
}