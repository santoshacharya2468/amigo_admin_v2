'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { AddPromotionDialog } from './components/AddPromotionDialog'

interface User {
  id: number
  name: string
  email: string
  avatar: string
  username: string
}

interface PromotedUser {
  user: User
  expiresAt: string
  promotionType: string
}

interface ApiResponse {
  status: number
  message: string
  data: PromotedUser[]
}

const fetchPromotedUsers = async (type: string, page: number) => {
  const { data } = await api.get<ApiResponse>(`/users/promoted`, {
    params: {
      page,
      limit: 10,
      promotion_type: type
    }
  })
  return data
}

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState('featured_user')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['promotedUsers', activeTab, currentPage],
    queryFn: () => fetchPromotedUsers(activeTab, currentPage),
  })

  const deletePromotion = useMutation({
    mutationFn: async (userId: number) => {
      await api.delete('/users/promote', {
        data: {
          promotion_type: activeTab,
          user_id: userId
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotedUsers'] })
      toast.success('User promotion removed successfully')
    },
    onError: () => {
      toast.error('Failed to remove user promotion')
    }
  })

  const UserCard = ({ user, promotionType }: { user: User; promotionType: string }) => (
    <Card className="mb-4 group relative">
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deletePromotion.mutate(user.id)}
          disabled={deletePromotion.isPending}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </CardContent>
    </Card>
  )

  const hasMore = (data?.data?.length ?? 0) === 10

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="mb-4">
          <CardContent className="flex items-center gap-4 p-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="container mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0  z-10 pb-4">
          <TabsList className="w-full">
            <TabsTrigger value="featured_user" className="w-full">Featured Users</TabsTrigger>
            <TabsTrigger value="pro_user" className="w-full">Pro Users</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="featured_user">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {data?.data.map((item) => (
                <UserCard 
                  key={item.user.id} 
                  user={item.user} 
                  promotionType={item.promotionType}
                />
              ))}
            </>
          )}
        </TabsContent>

        <TabsContent value="pro_user">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {data?.data.map((item) => (
                <UserCard 
                  key={item.user.id} 
                  user={item.user} 
                  promotionType={item.promotionType}
                />
              ))}
            </>
          )}
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={isLoading || !hasMore}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <AddPromotionDialog />
    </div>
  )
}

export default Page