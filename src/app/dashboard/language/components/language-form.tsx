"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LanguageRepository } from "@/repository/language.repository"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import toast from "react-hot-toast"

export function LanguageForm() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    icon: "",
    description: ""
  })

  const queryClient = useQueryClient()

  const { mutate: addLanguage, isPending } = useMutation({
    mutationFn: LanguageRepository.addLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] })
      toast.success("Language added successfully")
      setOpen(false)
      setFormData({ code: "", name: "", icon: "", description: "" })
    },
    onError: () => {
      toast.error("Failed to add language")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addLanguage(formData)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="gap-2" size={"icon"}>
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Language</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter language name"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="code">Code</label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              placeholder="Enter language code (e.g., en, es)"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="icons">Icon</label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="Enter icon URL"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter language description"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Language'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}