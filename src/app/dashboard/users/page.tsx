"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { User, UserTable } from "./components/UserTable"
import { Skeleton } from "@/components/ui/skeleton"
import { AgencyFilter } from "@/components/agency-filter"

export default function UsersPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [agencyId, setAgencyId] = useState<number | undefined>(undefined)
  const pageSize = 10

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ["users", page, search, agencyId],
    queryFn: async () => {
      const response = await api.get(`/users/filter?page=${page}&limit=${pageSize}&search=${search??""}&agency_id=${agencyId ?? ""}`)
      return response.data.data as User[]
    },
  })
  const users = usersResponse ?? []
  return (
    <div className="container py-6 space-y-4 px-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex items-center gap-4">
          <AgencyFilter 
            value={agencyId} 
            onValueChange={setAgencyId}
          />
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <UserTable users={users} />
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {users.length} users
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
            disabled={!usersResponse || users.length < pageSize}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}