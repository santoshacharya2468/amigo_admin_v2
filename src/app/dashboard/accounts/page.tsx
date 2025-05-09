"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import ApplicationPage from "@/components/application-page"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
import { AccountCard } from "./components/account-card"
import { PaymentAccount } from "./types"

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<string>("all")
  const queryClient = useQueryClient()

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["payment-accounts", searchQuery, verificationStatus],
    queryFn: async () => {
      const statusQuery = verificationStatus !== "all" ? `&status=${verificationStatus === "verified"}` : ""
      const response = await api.get(`/payments/accounts?query=${searchQuery}${statusQuery}`)
      return response.data.data as PaymentAccount[]
    }
  })

  const verifyAccountMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: boolean }) => {
      const response = await api.patch(`/payments/accounts/${id}/verify?status=${status}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-accounts"] })
      toast.success("Account status updated successfully")
    },
    onError: () => {
      toast.error("Failed to update account status")
    }
  })

  const handleUpdateStatus = async (id: number, status: boolean) => {
    await verifyAccountMutation.mutateAsync({ id, status })
  }

  return (
    <ApplicationPage title="Payment Accounts">
      <div className="mb-6 space-y-4 mx-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={verificationStatus}
          onValueChange={setVerificationStatus}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          accounts?.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        )}
      </div>
    </ApplicationPage>
  )
}