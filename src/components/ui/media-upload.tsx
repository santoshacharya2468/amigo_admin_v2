"use client"

import { Loader2, UploadCloud } from "lucide-react"
import Image from "next/image"
import { useCallback, useRef, useState } from "react"
import { Button } from "./button"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface MediaUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
  type?: "image" | "audio" | "svga"
  accept?: string
  previewComponent?: React.ReactNode
}

export function MediaUpload({
  value,
  onChange,
  disabled,
  type = "image",
  accept,
  previewComponent
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAcceptTypes = () => {
    switch (type) {
      case "image":
        return "image/*"
      case "audio":
        return "audio/*"
      case "svga":
        return ".svga"
      default:
        return accept || "*/*"
    }
  }

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
  }, [])

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      onChange(response.data.url)
      setSelectedFile(null)
    } catch (error) {
      console.error('Error uploading media:', error)
    } finally {
      setIsUploading(false)
    }
  }, [selectedFile, onChange])

  const renderPreview = () => {
    if (previewComponent) return previewComponent
    if (!value && !selectedFile) return <UploadCloud className="h-8 w-8 text-muted-foreground" />

    const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : value

    switch (type) {
      case "image":
        return (
          <Image
            fill
            src={previewUrl || ''}
            alt="Preview"
            className="object-cover rounded-lg"
          />
        )
      case "audio":
        return (
          <audio src={previewUrl} className="w-full h-full" controls />
        )
      case "svga":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-sm text-muted-foreground">{selectedFile?.name || 'SVGA file'}</span>
          </div>
        )
      default:
        return <UploadCloud className="h-8 w-8 text-muted-foreground" />
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div 
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        className={cn(
          "relative h-24 w-24 rounded-lg border-2 border-dashed border-border/70",
          "hover:border-primary/50 transition-colors duration-200",
          "flex items-center justify-center cursor-pointer",
          (disabled || isUploading) && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptTypes()}
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
        />
        
        {renderPreview()}

        {isUploading && (
          <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      {selectedFile && !isUploading && (
        <Button
          type="button"
          size="sm"
          onClick={handleUpload}
          className="h-8"
        >
          Upload
        </Button>
      )}
    </div>
  )
}