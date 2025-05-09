"use client"

import { useQuery } from "@tanstack/react-query"
import { AgencyRepository } from "@/repository/agency.repository"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AgencyFilterProps {
  value?: number
  onValueChange: (value: number | undefined) => void
}

export function AgencyFilter({ value, onValueChange }: AgencyFilterProps) {
  const { data: agencies } = useQuery({
    queryKey: ["agencies"],
    queryFn: () => AgencyRepository.getAllAgencies()
  })

  return (
    <Select
      value={value?.toString() || "all"}
      onValueChange={(value) => onValueChange(value === "all" ? undefined : parseInt(value))}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by agency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Agencies</SelectItem>
        {agencies?.map((agency) => (
          <SelectItem key={agency.id} value={agency.id.toString()}>
            {agency.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}