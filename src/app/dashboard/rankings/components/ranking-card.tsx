import { RankingUser } from "@/repository/ranking.repository"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal } from "lucide-react"

interface RankingCardProps {
  ranking: RankingUser
  position: number
}

export function RankingCard({ ranking, position }: RankingCardProps) {
  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return "text-yellow-500"
      case 2:
        return "text-gray-400"
      case 3:
        return "text-amber-700"
      default:
        return "text-muted-foreground"
    }
  }

  const getPositionIcon = (position: number) => {
    if (position <= 3) {
      return <Trophy className={`h-5 w-5 ${getMedalColor(position)}`} />
    }
    return <span className="text-muted-foreground font-medium">{position}</span>
  }

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-8 flex items-center justify-center">
            {getPositionIcon(position)}
          </div>
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarImage src={ranking.user.avatar} />
              <AvatarFallback>{ranking.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">{ranking.user.name}</div>
              <div className="text-sm text-muted-foreground">{ranking.user.username}</div>
            </div>
            <div className="font-semibold text-primary">{ranking.score}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}