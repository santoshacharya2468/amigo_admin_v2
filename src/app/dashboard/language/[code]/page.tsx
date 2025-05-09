"use client"

import { useQuery } from '@tanstack/react-query'
import { LanguageRepository } from '@/repository/language.repository'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { TranslationEditor } from '../components/translation-editor'

export default function LanguageTranslationPage() {
  const params = useParams()
  const languageCode = params.code as string

  const { data: translations, isLoading } = useQuery({
    queryKey: ['translations', languageCode],
    queryFn: () => LanguageRepository.getTranslations(languageCode)
  })

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <TranslationEditor translations={translations} languageCode={languageCode} />
    </div>
  )
}