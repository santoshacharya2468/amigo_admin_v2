"use client"

import { Card, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/api"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"
import { useRef, useCallback, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Loading from "@/components/loading"



interface User {
  id: number
  name: string
  avatar: string
  isOnline: boolean | null
  lastSeen: string | null
}

interface ChatMessage {
  id: number
  senderId: number
  receiverId: number
  message: string
  createdAt: string
  attachment: string | null
  status: number
}

export default function ChatsPage() {
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")
  const user2Id = searchParams.get("user2Id")
  const observerRef = useRef<IntersectionObserver | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const {
    data: messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["chat-messages", userId, user2Id],
    queryFn: async ({ pageParam = 1 }) => {
      if (!userId || !user2Id) return []
      const response = await api.get(
        `/messages/messages-with/${userId}?user=${user2Id}&page=${pageParam}`
      )
      return response.data.data as ChatMessage[]
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length === 10 ? allPages.length + 1 : undefined
    },
    enabled: !!userId && !!user2Id,
  })

  const { data: user1 } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null
      const response = await api.get(`/users/${userId}`)
      return response.data.data as User
    },
    enabled: !!userId,
  })

  const { data: user2 } = useQuery({
    queryKey: ["user", user2Id],
    queryFn: async () => {
      if (!user2Id) return null
      const response = await api.get(`/users/${user2Id}`)
      return response.data.data as User
    },
    enabled: !!user2Id,
  })

  const allMessages = messages?.pages.flat().sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  }) || []


useEffect(() => {
  if (!scrollAreaRef.current) return

  // Scroll to bottom whenever userId or user2Id changes (new chat opened)
  scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
}, [userId, user2Id, allMessages.length])

  // const firstMessageRef = useCallback(
  //   (node: HTMLDivElement | null) => {
  //     if (isFetchingNextPage || !hasNextPage) return
  //     if (observerRef.current) observerRef.current.disconnect()

  //     if (node) {
  //       observerRef.current = new IntersectionObserver(entries => {
  //         if (entries[0].isIntersecting) {
  //           fetchNextPage()
  //         }
  //       })
  //       observerRef.current.observe(node)
  //     }
  //   },
  //   [fetchNextPage, hasNextPage, isFetchingNextPage]
  // )

  if (!userId || !user2Id) {
    return (
      <Card className="flex-1 flex items-center justify-center text-muted-foreground">
        Select Chat Head
      </Card>
    )
  }

  if (status === 'pending') {
    return (
      <Card className="flex-1 flex items-center justify-center">
        <Loading />
      </Card>
    )
  }

  if (status === 'error') {
    return (
      <Card className="flex-1 flex items-center justify-center text-muted-foreground">
        Error: {"Select Chat Head"}
      </Card>
    )
  }

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader className="border-b flex-none">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user2?.avatar || undefined} alt={user2?.name || "User"} />
              <AvatarFallback>
                {user2?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${
                user2?.isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
          <div>
            <h3 className="font-medium">{user2?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {user2?.isOnline
                ? "Online"
                : user2?.lastSeen
                ? `Last seen ${format(new Date(user2.lastSeen), "PPp")}`
                : "Offline"}
            </p>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
        <div className="flex flex-col justify-end min-h-full gap-2">
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Loading />
            </div>
          )}
          {allMessages.map((message, index) => {
            const isCurrentUser = message.senderId.toString() === userId
            const userAvatar = isCurrentUser ? user1?.avatar : user2?.avatar
            const userName = isCurrentUser ? user1?.name : user2?.name

            return (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  isCurrentUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar || undefined} alt={userName || "User"} />
                    <AvatarFallback>
                      {userName?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background ${
                      isCurrentUser
                        ? user1?.isOnline
                          ? "bg-green-500"
                          : "bg-gray-400"
                        : user2?.isOnline
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                </div>
                <div className="flex flex-col max-w-[70%]">
                  <div
                    className={`rounded-lg py-2 px-3 ${
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                  <span
                    className={`text-xs text-muted-foreground mt-0.5 ${
                      isCurrentUser ? "text-right" : "text-left"
                    }`}
                  >
                    {format(new Date(message.createdAt), "HH:mm")}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </Card>
  )
}
