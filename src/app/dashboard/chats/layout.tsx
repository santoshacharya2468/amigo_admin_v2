"use client"

import ApplicationPage from "@/components/application-page"
import Loading from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { ReactNode, useState } from "react"

interface Message {
  id: number
  senderId: number
  receiverId: number
  message: string
  createdAt: string
  attachment: string | null
  status: number
}

interface User {
  id: number
  name: string
  avatar: string
  isOnline: boolean | null
  lastSeen: string | null
}

interface ChatRoom {
  message: Message
  user: User
  user2: User
}

export default function ChatsLayout({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedUserId = searchParams.get("userId")
  const selectedUser2Id = searchParams.get("user2Id")

  const { data: chatRoomsResponse, isLoading } = useQuery({
    queryKey: ["chat-rooms", page, search],
    queryFn: async () => {
      const response = await api.get(`/messages/chat-rooms?page=${page}&limit=${pageSize}&search=${search}`)
      return {
        data: response.data.data as ChatRoom[],
        total: response.data.total as number
      }
    },
  })

  const hasData = chatRoomsResponse?.data && chatRoomsResponse.data.length > 0

  return (
    <ApplicationPage title="Chat Rooms">
      <div className="flex h-[calc(100vh-180px)] gap-4">
        <Card className="w-80 flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-2 p-4">
              {isLoading ? (
                <Loading/>
              ) : (
                chatRoomsResponse?.data.map((room) => (
                  <div
                    key={room.message.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent ${
                      (selectedUserId === room.user.id.toString() && selectedUser2Id === room.user2.id.toString()) ||
                      (selectedUserId === room.user2.id.toString() && selectedUser2Id === room.user.id.toString())
                        ? "bg-accent"
                        : ""
                    }`}
                    onClick={() => {
                      const searchParams = new URLSearchParams(window.location.search);
                      searchParams.set("userId", room.user.id.toString());
                      searchParams.set("user2Id", room.user2.id.toString());
                      router.push(`/dashboard/chats?${searchParams.toString()}`);
                    }}
                  >
                    <div className="relative">
                      <Image
                        src={room.user.avatar}
                        alt={room.user.name}
                        width={40}
                        height={40}
                        className="rounded-full h-[40px] w-[40px]"
                      />
                      <div
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                          room.user.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium truncate">{room.user.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(room.message.createdAt), "HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {room.message.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || !hasData}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={!hasData || (chatRoomsResponse?.data.length || 0) < pageSize}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
        {children}
      </div>
    </ApplicationPage>
  )
}