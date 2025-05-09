"use client"

import { useQuery } from '@tanstack/react-query'
import ApplicationPage from '@/components/application-page'
import { LanguageList } from './components/language-list'
import { Loader2 } from 'lucide-react'
import { LanguageRepository } from '@/repository/language.repository'
import { LanguageForm } from './components/language-form'

export default function Page() {
  const { data: languages, isLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: () => LanguageRepository.getLanguages()
  })

  return (
    <ApplicationPage title="Languages" >
      <div className='w-full flex justify-end my-3'>
        {<LanguageForm />}
      </div>
      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <LanguageList languages={languages || []} />
      )}
    </ApplicationPage>
  )
}