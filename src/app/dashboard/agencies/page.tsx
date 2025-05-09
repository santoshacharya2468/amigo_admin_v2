"use client"

import ApplicationPage from "@/components/application-page"
import { AgencyDataTable } from "./components/agency-data-table"
import { AgencyRepository } from "@/repository/agency.repository"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

const Page = () => {
  const { data: agencies, isLoading } = useQuery({
    queryKey: ["agencies"],
    queryFn: AgencyRepository.getAllAgencies
  })

  return (
    <ApplicationPage title="Agencies">
      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <AgencyDataTable data={agencies || []} />
      )}
    </ApplicationPage>
  )
}

export default Page