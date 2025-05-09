"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LanguageRepository } from "@/repository/language.repository"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { Search } from "lucide-react"

interface TranslationEditorProps {
  translations: Record<string, string>
  languageCode: string
}

export function TranslationEditor({ translations, languageCode }: TranslationEditorProps) {
  const [editedTranslations, setEditedTranslations] = useState<Record<string, string>>(translations)
  const [hasChanges, setHasChanges] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const queryClient = useQueryClient()

  const { mutate: updateTranslations, isPending } = useMutation({
    mutationFn: async () => {
      const changes = Object.entries(editedTranslations)
        .filter(([key, value]) => value !== translations[key])
        .map(([key, value]) => ({
          key,
          value
        }))

      await LanguageRepository.addTranslation({
        Language_code: languageCode,
        values: changes
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations', languageCode] })
      toast.success('Translations updated successfully')
      setHasChanges(false)
    },
    onError: () => {
      toast.error('Failed to update translations')
    }
  })

  const handleTranslationChange = (key: string, value: string) => {
    setEditedTranslations(prev => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
  }

  const filteredTranslations = Object.entries(translations).filter(([key, value]) => 
    key.toLowerCase().includes(searchQuery.toLowerCase()) || 
    value.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 mx-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Edit Translations</h2>
        {hasChanges && (
          <Button 
            onClick={() => updateTranslations()} 
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search translations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="grid gap-6 mx-4">
        {filteredTranslations.map(([key, originalValue]) => (
          <div key={key} className="p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">{key}</label>
            <Input
              value={editedTranslations[key]}
              onChange={(e) => handleTranslationChange(key, e.target.value)}
              className={`${editedTranslations[key] !== originalValue ? "border-blue-500 ring-2 ring-blue-200" : ""} focus:ring-2 focus:ring-primary`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}