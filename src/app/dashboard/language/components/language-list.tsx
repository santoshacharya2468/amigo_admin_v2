"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface Language {
  id: number
  name: string
  code: string
}

interface LanguageListProps {
  languages: Language[]
}

export const LanguageList: React.FC<LanguageListProps> = ({ languages }) => {
  const router = useRouter()

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {languages.map((language) => (
        <Card 
          key={language.code}
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => router.push(`/dashboard/language/${language.code}`)}
        >
          <CardContent className="p-4">
            <h3 className="font-semibold">{language.name}</h3>
            <p className="text-sm text-muted-foreground">{language.code}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}