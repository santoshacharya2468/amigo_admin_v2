"use client"

import { Button } from "@/components/ui/button"
import { Loader2, X } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LiveStreamRepository } from "@/repository/livestream.repository"
import toast from "react-hot-toast"
import { queryClient } from "@/providers"

interface EndStreamButtonProps {
  streamId: number
}

export function EndStreamButton({ streamId }: EndStreamButtonProps) {
  
  const endStreamMutation = useMutation({
    mutationFn: LiveStreamRepository.endLiveStream,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livestreams"] })
      toast.success("Live stream ended successfully")
    },
    onError: () => {
      toast.error("Failed to end live stream")
    }
  })

  return (
    <Button
      variant="destructive"
      size="icon"
      className="h-8 w-8"
      onClick={() => endStreamMutation.mutate(streamId)}
      disabled={endStreamMutation.isPending}
    >
      {endStreamMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <X className="h-4 w-4" />
      )}
    </Button>
  )
}