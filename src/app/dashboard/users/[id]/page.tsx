'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface UserDetails {
  user: {
    id: number
    name: string
    email: string
    username: string
    avatar: string
    gender: string
    provider: string
    isActive: boolean
    bio: string | null
    points: number
    role: string
  }
  totalProfileVisits: number
  totalProfileLikes: number
  totalFriends: number
  totalFans: number
  eggs: number
}

interface GalleryItem {
  id: number
  userId: number
  url: string
  createdAt: string
}

const Page = () => {
  const params = useParams()
  const userId = params.id as string
  const queryClient = useQueryClient()

  const { data: userDetails, isLoading: isLoadingUser } = useQuery({
    queryKey: ['userDetails', userId],
    queryFn: async () => {
      const { data } = await api.get<{ data: UserDetails }>(`/users/${userId}/details`)
      return data.data
    }
  })

  const { data: gallery, isLoading: isLoadingGallery } = useQuery({
    queryKey: ['gallery', userId],
    queryFn: async () => {
      const { data } = await api.get<{ data: GalleryItem[] }>(`/gallery`, {
        params: { user: userId }
      })
      return data.data
    }
  })

  const deleteGalleryItem = useMutation({
    mutationFn: async (galleryId: number) => {
      await api.delete(`/gallery/${galleryId}`, {
        params: { user: userId }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery', userId] })
      toast.success('Gallery item deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete gallery item')
    }
  })

  if (isLoadingUser) {
    return <UserDetailsSkeleton />
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* User Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userDetails?.user.avatar} alt={userDetails?.user.name} />
              <AvatarFallback>{userDetails?.user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{userDetails?.user.name}</h2>
              <p className="text-gray-500">{userDetails?.user.email}</p>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="font-semibold">{userDetails?.totalProfileVisits}</span> visits
                </div>
                <div>
                  <span className="font-semibold">{userDetails?.totalProfileLikes}</span> likes
                </div>
                <div>
                  <span className="font-semibold">{userDetails?.totalFriends}</span> friends
                </div>
                <div>
                  <span className="font-semibold">{userDetails?.totalFans}</span> fans
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Section */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingGallery ? (
            <GallerySkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery?.map((item) => (
                <div key={item.id} className="relative group">
                  <img
                    src={item.url}
                    alt={`Gallery ${item.id}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteGalleryItem.mutate(item.id)}
                    disabled={deleteGalleryItem.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const UserDetailsSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-32" />
    </CardHeader>
    <CardContent>
      <div className="flex items-start gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

const GallerySkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <Skeleton key={i} className="w-full h-48 rounded-lg" />
    ))}
  </div>
)

export default Page