'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Label } from "@/components/ui/label"
import toast from 'react-hot-toast'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface User {
  id: number
  name: string
  email: string
  avatar: string
  username: string
}

export function AddPromotionDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [promotionType, setPromotionType] = useState<'featured_user' | 'pro_user'>('featured_user')
  const [duration, setDuration] = useState<string>("")
  const queryClient = useQueryClient()

  const { data: users, isLoading } = useQuery({
    queryKey: ['searchUsers', search],
    queryFn: async () => {
      if (!search) return []
      const response = await api.get(`/users/filter`, {
        params: {
          page: 1,
          limit: 5,
          search
        }
      })
      return response.data.data as User[]
    },
    enabled: !!search
  })

  const addPromotion = useMutation({
    mutationFn: async () => {
      if (!selectedUser || !duration) return
      await api.post('/users/promote', {
        PromotionType: promotionType,
        duration_minutes: parseInt(duration),
        user_id: selectedUser.id
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotedUsers'] })
      toast.success('User promoted successfully')
      handleClose()
    },
    onError: () => {
      toast.error('Failed to promote user')
    }
  })

  const handleClose = () => {
    setIsOpen(false)
    setSearch("")
    setSelectedUser(null)
    setDuration("")
  }

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 shadow-lg"
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-4 w-4" />
         Promote
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add User to Promotion</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!selectedUser ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {isLoading ? (
                    <div className="text-sm text-muted-foreground">Searching...</div>
                  ) : users?.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">@{user.username}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{selectedUser.name}</div>
                    <div className="text-sm text-muted-foreground">@{selectedUser.username}</div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedUser(null)}>
                    Change
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Promotion Type</Label>
                  <RadioGroup
                    value={promotionType}
                    onValueChange={(value: 'featured_user' | 'pro_user') => setPromotionType(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="featured_user" id="featured" />
                      <Label htmlFor="featured">Featured User</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pro_user" id="pro" />
                      <Label htmlFor="pro">Pro User</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Enter duration in minutes"
                    min="1"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() => addPromotion.mutate()}
                  disabled={!duration || addPromotion.isPending}
                >
                  {addPromotion.isPending ? "Adding..." : "Add to Promotion"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}