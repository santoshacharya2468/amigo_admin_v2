"use client"

import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { GiftCard } from "./components/GiftCard"
import { GiftCreateForm } from "./components/GiftCreateForm"

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

export default function Page() {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playingGiftId, setPlayingGiftId] = useState<number | null>(null)
  const [playingAnimationId, setPlayingAnimationId] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const { data: giftsResponse } = useQuery({
    queryKey: ["gifts"],
    queryFn: async () => {
      const response = await api.get("/gifts")
      return response.data.data as Gift[]
    },
  })

  const handlePlaySound = (soundUrl: string, giftId: number) => {
    if (currentAudio) {
      if (playingGiftId === giftId) {
        if (isPlaying) {
          currentAudio.pause()
          setIsPlaying(false)
        } else {
          currentAudio.play()
          setIsPlaying(true)
        }
        return
      }
      currentAudio.pause()
      currentAudio.currentTime = 0
    }
    
    if (audioRef.current) {
      audioRef.current.src = soundUrl
      audioRef.current.play()
      setCurrentAudio(audioRef.current)
      setIsPlaying(true)
      setPlayingGiftId(giftId)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="container py-6">
      <audio 
        ref={audioRef} 
        className="hidden" 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false)
          setPlayingGiftId(null)
        }}
      />
     <div className="w-full mb-2 flex flex-row justify-end pe-10">
       <GiftCreateForm onClose={()=>{}}/>
     </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-2">
        {giftsResponse?.map((gift) => (
          <GiftCard
            key={gift.id}
            gift={gift}
            onPlaySound={handlePlaySound}
            isPlaying={isPlaying}
            playingGiftId={playingGiftId}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            formatTime={formatTime}
            playingAnimationId={playingAnimationId}
            setPlayingAnimationId={setPlayingAnimationId}
          />
        ))}
      </div>
    </div>
  )
}