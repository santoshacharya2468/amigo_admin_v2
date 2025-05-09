"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MediaUpload } from "@/components/ui/media-upload"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

const giftFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  coinsRequired: z.coerce.number().min(1, "Coins required must be at least 1"),
  iconUrl: z.string().min(1, "Icon URL is required"),
  soundUrl: z.string().min(1, "Sound URL is required"),
  animationUrl: z.string().min(1, "Animation URL is required"),
})

type GiftFormValues = z.infer<typeof giftFormSchema>

interface GiftCreateFormProps {
  onClose: () => void
}

export function GiftCreateForm({ onClose }: GiftCreateFormProps) {
  const queryClient = useQueryClient()

  const createGiftMutation = useMutation({
    mutationFn: async (values: GiftFormValues) => {
      const response = await api.post('/gifts', values)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] })
      onClose()
      form.reset()
    },
  })

  const form = useForm<GiftFormValues>({
    resolver: zodResolver(giftFormSchema),
    defaultValues: {
      name: "",
      coinsRequired: 1,
      iconUrl: "",
      soundUrl: "",
      animationUrl: "",
    },
  })

  function onSubmit(values: GiftFormValues) {
    createGiftMutation.mutate(values)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Gift
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Gift</DialogTitle>
          <DialogDescription>
            Add a new gift to the collection. Fill in all the required fields below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coinsRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coins Required</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iconUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <MediaUpload
                      type="image"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="soundUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sound</FormLabel>
                  <FormControl>
                    <MediaUpload
                      type="audio"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="animationUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Animation</FormLabel>
                  <FormControl>
                    <MediaUpload
                      type="svga"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createGiftMutation.isPending} className="w-full">
              {createGiftMutation.isPending ? "Creating..." : "Create Gift"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}