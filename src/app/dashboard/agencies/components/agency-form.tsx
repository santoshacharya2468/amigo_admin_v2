"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AgencyCreate, AgencyRepository } from "@/repository/agency.repository"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Switch } from "@/components/ui/switch"
import { MediaUpload } from "@/components/ui/media-upload"

interface AgencyFormProps {
  agency?: AgencyCreate
  onClose: () => void
}

export function AgencyForm({ agency, onClose }: AgencyFormProps) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { isSubmitting }, setValue, watch } = useForm<Partial<AgencyCreate>>({
    defaultValues: {
      name: agency?.name,
      description: agency?.description,
      phone: agency?.phone,
      logo: agency?.logo,
      email: agency?.email,
      verified: agency?.verified,
    }
  })

  const { mutate: updateAgency } = useMutation({
    mutationFn: (data: Partial<AgencyCreate>) => {
      if (!agency) return Promise.reject("No agency to update")
      return AgencyRepository.updateAgency(agency.id.toString(), data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencies"] })
      toast.success("Agency updated successfully")
      onClose()
    },
    onError: () => {
      toast.error("Failed to update agency")
    }
  })

  const onSubmit = (data: Partial<AgencyCreate>) => {
    updateAgency(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name">Name</label>
        <Input id="name" {...register("name")} />
      </div>

      <div className="space-y-2">
        <label htmlFor="description">Description</label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone">Phone</label>
        <Input id="phone" {...register("phone")} />
      </div>

      {!agency && (
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <Input id="email" type="email" {...register("email")} />
        </div>
      )}

      <div className="space-y-2">
        <label>Logo</label>
        <MediaUpload
          type="image"
          value={watch("logo")}
          onChange={(url) => setValue("logo", url)}
          disabled={isSubmitting}
        />
      </div>

      {agency && (
        <div className="flex items-center gap-2">
          <Switch
            checked={watch("verified")}
            onCheckedChange={(checked) => setValue("verified", checked)}
          />
          <label>Verified Status</label>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  )
}