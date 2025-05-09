"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Play, Pause, Trash2, Pencil } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useState } from "react"
import { GiftEditForm } from "./GiftEditForm"
import dynamic from "next/dynamic"
const SVGAPlayer = dynamic(() => import('@/components/svga-player'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-accent">Loading...</div>
})
interface Gift {
  id: number
  iconUrl: string
  name: string
  coinsRequired: number
  soundUrl: string
  animationUrl: string
  createdAt: string
  updatedAt: string
}

interface GiftCardProps {
  gift: Gift
  onPlaySound: (soundUrl: string, giftId: number) => void
  isPlaying: boolean
  playingGiftId: number | null
  currentTime: number
  duration: number
  onSeek: (value: number[]) => void
  formatTime: (time: number) => string
  playingAnimationId: number | null
  setPlayingAnimationId: (id: number | null) => void
}

export function GiftCard({
  gift,
  onPlaySound,
  isPlaying,
  playingGiftId,
  currentTime,
  duration,
  onSeek,
  formatTime,
  playingAnimationId,
  setPlayingAnimationId,
}: GiftCardProps) {
  const [editingGift, setEditingGift] = useState<Gift | null>(null)
  const queryClient = useQueryClient()

  const deleteGiftMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/gifts/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] })
    },
  })

  return (
    <Card key={gift.id} className="p-4">
      <div className="flex justify-end mb-2">
        <Dialog
          open={editingGift?.id === gift.id}
          onOpenChange={(open) => {
            if (!open) setEditingGift(null)
            if (open) setEditingGift(gift)
          }}
        >
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="mr-2">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Gift</DialogTitle>
              <DialogDescription>
                Update the gift information. Fill in all the required fields below.
              </DialogDescription>
            </DialogHeader>
            <GiftEditForm gift={gift} onClose={() => setEditingGift(null)} />
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Gift</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this gift? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteGiftMutation.mutate(gift.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteGiftMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-accent">
        <SVGAPlayer
          src={gift.animationUrl}
          classname="w-full h-full"
        />
        <Button
          onClick={() => setPlayingAnimationId(playingAnimationId === gift.id ? null : gift.id)}
        >
          {playingAnimationId === gift.id ? "Stop" : "Play"}
        </Button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{gift.name}</h3>
          <span className="text-sm text-muted-foreground">
            {gift.coinsRequired} coins
          </span>
        </div>
        {playingGiftId === gift.id && (
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={onSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
        <button
          onClick={() => onPlaySound(gift.soundUrl, gift.id)}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md py-2 hover:opacity-90 transition-opacity"
        >
          {playingGiftId === gift.id && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playingGiftId === gift.id && isPlaying ? "Pause" : "Play"} Sound
        </button>
      </div>
    </Card>
  )
}