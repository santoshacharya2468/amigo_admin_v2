"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { api } from "@/lib/api"
import { Exchange, ExchangeRepository } from "@/repository/exchange.repository"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Eye } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

interface ExchangeTableProps {
  data: Exchange[]
}

export function ExchangeTable({ data }: ExchangeTableProps) {
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null)
  const queryClient = useQueryClient()

  const toggleVerificationMutation = useMutation({
    mutationKey: ["exchanges"],
    mutationFn: async ({ id, verified }: { id: number; verified: boolean }) => {
      const response = await api.patch(`/payments/exchange/${id}/verify?status=${verified}`, {
        verified
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchanges"] })
      toast.success("Verification status updated successfully")
    },
    onError: () => {
      toast.error("Failed to update verification status")
    }
  })

  const handleToggleVerification = (exchange: Exchange) => {
    toggleVerificationMutation.mutate({
      id: exchange.coin.id,
      verified: !exchange.coin.verified
    })
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>TXN Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No data
                </TableCell>
              </TableRow>
            )}
            {data.map((exchange) => (
              <TableRow key={exchange.coin.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={exchange.user.avatar || undefined} />
                      <AvatarFallback>{exchange.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{exchange.user.name}</div>
                      <div className="text-sm text-muted-foreground">{exchange.user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={exchange.coin.type === "credit" ? "default" : "destructive"}>
                    {exchange.coin.txnType}
                  </Badge>
                </TableCell>
                <TableCell>{exchange.coin.quantity}</TableCell>
                <TableCell>{exchange.coin.description}</TableCell>
                <TableCell>{format(new Date(exchange.coin.createdAt), "PPp")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={exchange.coin.verified}
                      onCheckedChange={() => handleToggleVerification(exchange)}
                      disabled={toggleVerificationMutation.isPending}
                    />
                    <Badge variant={exchange.coin.verified ? "default" : "secondary"}>
                      {exchange.coin.verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedExchange(exchange)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Exchange Details</SheetTitle>
                      </SheetHeader>
                      {selectedExchange && (
                        <div className="mt-6 space-y-6">
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Transaction Details</h3>
                            <div className="rounded-lg border p-4 space-y-3">
                              {(() => {
                                const payload = ExchangeRepository.decodePayload(
                                  selectedExchange.coin.payload
                                )
                                return (
                                  <>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Amount</span>
                                      <span>{payload.amount} {payload.currency}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Coins</span>
                                      <span>{payload.quantity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Account Name</span>
                                      <span>{payload.account.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Account Email</span>
                                      <span>{payload.account.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Account Status</span>
                                      <Badge variant={payload.account.verified ? "default" : "secondary"}>
                                        {payload.account.verified ? "Verified" : "Unverified"}
                                      </Badge>
                                    </div>
                                  </>
                                )
                              })()}
                            </div>
                          </div>
                        </div>
                      )}
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}