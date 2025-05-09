"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ExchangeRepository } from "@/repository/exchange.repository"
import { ExchangeTable } from "./components/exchange-table"
import ApplicationPage from "@/components/application-page"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AgencyFilter } from "@/components/agency-filter"

export default function Page() {
  const [status, setStatus] = useState<string >("true")
  const [agencyId, setAgencyId] = useState<number | undefined>()

  const { data: exchanges, isLoading } = useQuery({
    queryKey: ["exchanges", status, agencyId],
    queryFn: () => ExchangeRepository.getExchanges({ 
      status: status === "true",
      agencyId 
    })
  })

  return (
    <ApplicationPage title="Exchanges">
      <div className="mb-6 flex gap-4 ms-2">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Verified</SelectItem>
            <SelectItem value="false">Unverified</SelectItem>
          </SelectContent>
        </Select>

        <AgencyFilter 
          value={agencyId} 
          onValueChange={setAgencyId}
        />
      </div>

      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ExchangeTable data={exchanges || []} />
      )}
    </ApplicationPage>
  )
}