import { api } from "@/lib/api"
import { User } from "./livestream.repository"

export type RankingType = "rating" | "gift_holding" | "gift_received" | "gift_sent" | "coin_purchased" | "access_time" | "live_streaming" | "chat" | "fan"

export interface RankingUser {
  user: User
  score: number
}

export interface RankingResponse {
  data: RankingUser[]
  total: number
}

export class RankingRepository {
  static async getRankings(page: number, limit: number, type: RankingType) {
    const response = await api.get(`/users/ranking?page=${page}&limit=${limit}&type=${type}`)
    return response.data as RankingResponse
  }
}