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

const giftFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  coinsRequired: z.coerce.number().min(1, "Coins required must be at least 1"),
  iconUrl: z.string().min(1, "Icon URL is required"),
  soundUrl: z.string().min(1, "Sound URL is required"),
  animationUrl: z.string().min(1, "Animation URL is required"),
})

type GiftFormValues = z.infer<typeof giftFormSchema>

interface GiftEditFormProps {
  gift: Gift
  onClose: () => void
}

export function GiftEditForm({ gift, onClose }: GiftEditFormProps) {
  const queryClient = useQueryClient()

  const updateGiftMutation = useMutation({
    mutationFn: async (values: GiftFormValues) => {
      const response = await api.put(`/gifts/${gift.id}`, values)
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
      name: gift.name,
      coinsRequired: gift.coinsRequired,
      iconUrl: gift.iconUrl,
      soundUrl: gift.soundUrl,
      animationUrl: gift.animationUrl,
    },
  })

  function onSubmit(values: GiftFormValues) {
    updateGiftMutation.mutate(values)
  }

  return (
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
        <Button type="submit" disabled={updateGiftMutation.isPending}>
          {updateGiftMutation.isPending ? "Updating..." : "Update Gift"}
        </Button>
      </form>
    </Form>
  )
}