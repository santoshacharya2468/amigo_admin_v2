import { api } from "@/lib/api"

export interface ExchangePayload {
  amount: number
  account: {
    id: number
    name: string
    email: string
    userId: number
    verified: boolean
    createdAt: string
    updatedAt: string
  }
  currency: string
  quantity: number
}

export interface Exchange {
  coin: {
    id: number
    userId: number
    quantity: number
    type: string
    description: string
    payload: string
    createdAt: string
    txnType: string
    verified: boolean
  }
  user: {
    id: number
    name: string
    email: string
    username: string
    avatar: string | null
  }
}

export class ExchangeRepository {
  static async getExchanges(params?: { userId?: number; agencyId?: number ; status?: boolean}) {
    const response = await api.get('/payments/exchange-statements', {
      params: {
        status: status ?? true,
        ...params
      }
    })
    return response.data.data as Exchange[]
  }

  static decodePayload(payload: string): ExchangePayload {
    return JSON.parse(atob(payload))
  }
}