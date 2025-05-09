"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { PaymentAccount } from "../types"

interface AccountCardProps {
  account: PaymentAccount
  onUpdateStatus: (id: number, status: boolean) => Promise<void>
}

export function AccountCard({ account, onUpdateStatus }: AccountCardProps) {
  const [selectedStatus, setSelectedStatus] = useState(account.verified ? "verified" : "unverified")
  const [isUpdating, setIsUpdating] = useState(false)
  const [hasChanged, setHasChanged] = useState(false)

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    setHasChanged(value === "verified" ? !account.verified : account.verified)
  }

  const handleUpdate = async () => {
    try {
      setIsUpdating(true)
      await onUpdateStatus(account.id, selectedStatus === "verified")
      setHasChanged(false)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{account.name}</h3>
            <p className="text-sm text-muted-foreground">{account.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Created on {format(new Date(account.createdAt), "PPp")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={selectedStatus}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            {hasChanged && (
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}