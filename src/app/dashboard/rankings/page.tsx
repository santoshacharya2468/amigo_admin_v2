"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { RankingRepository, RankingType } from "@/repository/ranking.repository"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { RankingCard } from "./components/ranking-card"
import ApplicationPage from "@/components/application-page"

const rankingTypes: { value: RankingType; label: string }[] = [
  { value: "rating", label: "Rating" },
  { value: "gift_holding", label: "Gift Holding" },
  { value: "gift_received", label: "Gift Received" },
  { value: "gift_sent", label: "Gift Sent" },
  { value: "coin_purchased", label: "Coins Purchased" },
  { value: "access_time", label: "Access Time" },
  { value: "live_streaming", label: "Live Streaming" },
  { value: "chat", label: "Chat" },
  { value: "fan", label: "Fans" }
]

export default function Page() {
  const [page, setPage] = useState(1)
  const [type, setType] = useState<RankingType>("rating")
  const limit = 10

  const { data: rankings, isLoading } = useQuery({
    queryKey: ["rankings", page, type],
    queryFn: () => RankingRepository.getRankings(page, limit, type)
  })

  const totalPages = Math.ceil((rankings?.total || 0) / limit)

  return (
    <ApplicationPage title="Rankings">
      <div className="mb-6 ms-2">
        <Select value={type} onValueChange={(value) => setType(value as RankingType)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select ranking type" />
          </SelectTrigger>
          <SelectContent>
            {rankingTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          rankings?.data.map((ranking, index) => (
            <RankingCard
              key={ranking.user.id}
              ranking={ranking}
              position={index + 1 + (page - 1) * limit}
            />
          ))
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={rankings?.data.length === 0 || page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </ApplicationPage>
  )
}