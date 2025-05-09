"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import ApplicationPage from "@/components/application-page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Loader2, Users } from "lucide-react"
import { LiveStreamRepository } from "@/repository/livestream.repository"
import { EndStreamButton } from "./components/end-stream-button"

export default function Page() {
  const [page, setPage] = useState(1)
  const pageSize = 8

  const { data: liveStreamsResponse, isLoading } = useQuery({
    queryKey: ["livestreams", page],
    queryFn: () => LiveStreamRepository.getLiveStreams(page, pageSize)
  })

  const liveStreams = liveStreamsResponse?.data || []
  const totalPages = Math.ceil((liveStreamsResponse?.total || 0) / pageSize)

  return (
    <ApplicationPage title="Live Streams">
      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {liveStreams.map((stream) => (
              <Card key={stream.liveStream.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    <img
                      src={stream.liveStream.thumbnail ?? stream.user.avatar}
                      alt={`${stream.user.name}'s stream`}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* <Badge variant="destructive" className="bg-red-500">LIVE</Badge> */}
                          <span className="text-white text-sm font-medium truncate">
                            {stream.liveStream.title || `${stream.user.name}'s Stream`}
                          </span>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {stream.count}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={stream.user.avatar} />
                        <AvatarFallback>{stream.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium leading-none">{stream.user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Started {format(new Date(stream.liveStream.createdAt), "p")}
                        </div>
                      </div>
                    </div>
                    <EndStreamButton streamId={stream.liveStream.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
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
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </ApplicationPage>
  )
}