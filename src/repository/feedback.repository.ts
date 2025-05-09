import { api } from "@/lib/api"

export interface Feedback {
  id: number
  userId: number
  status: number
  title: string
  email: string
  attachments: string[]
  feedback: string
  createdAt: string
  updatedAt: string
  reply: string | null
}

export const FeedbackStatus = {
  ALL: -1,
  PENDING: 0,
  IN_PROGRESS: 1,
  CLOSED: 2,
  REJECTED: 3,
  ABANDONED: 4,
  DUPLICATE: 5
} as const

export type FeedbackStatusType = typeof FeedbackStatus[keyof typeof FeedbackStatus]

export class FeedbackRepository {
  static async getFeedbacks(status?: FeedbackStatusType) {
    const response = await api.get("/feedbacks" + (status !== undefined ? `?status=${status}` : ""))
    return response.data.data as Feedback[]
  }

  static async updateFeedback(id: number, data: { status: number; reply: string }) {
    const response = await api.patch(`/feedbacks/${id}`, data)
    return response.data
  }
}