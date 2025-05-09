import { api } from "@/lib/api"

export interface User {
  id: number
  name: string
  email: string
  username: string
  avatar: string
  // ... other user fields
}

export interface LiveStream {
  id: number
  userId: number
  type: string
  isPrivate: boolean
  isMultiple: boolean
  allowFreeSpeak: boolean
  channelName: string
  hideComments: boolean
  isActive: boolean
  tags: string[] | null
  password: string | null
  thumbnail: string
  maxAllow: number
  title: string | null
  ack: number
  createdAt: string
  endAt: string | null
}

export interface LiveStreamWithUser {
  user: User
  liveStream: LiveStream
  count: number
}

export interface LiveStreamResponse {
  data: LiveStreamWithUser[]
  total: number
}

export class LiveStreamRepository {
  static async getLiveStreams(page: number = 1, limit: number = 10) {
    const response = await api.get(`/livestreams?limit=${limit}&page=${page}`)
    return response.data as LiveStreamResponse
  }

  static async endLiveStream(id: number) {
    const response = await api.patch(`/livestreams/${id}/leave`)
    return response.data
  }
}