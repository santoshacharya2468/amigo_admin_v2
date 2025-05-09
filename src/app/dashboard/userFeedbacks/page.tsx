"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import ApplicationPage from "@/components/application-page"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { 
  Loader2, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Copy,
  Timer
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { FeedbackRepository, FeedbackStatus, FeedbackStatusType } from "@/repository/feedback.repository"

const statusOptions = [
  { value: FeedbackStatus.ALL, label: "All Feedbacks" },
  { value: FeedbackStatus.PENDING, label: "Pending" },
  { value: FeedbackStatus.IN_PROGRESS, label: "In Progress" },
  { value: FeedbackStatus.CLOSED, label: "Closed" },
  { value: FeedbackStatus.REJECTED, label: "Rejected" },
  { value: FeedbackStatus.ABANDONED, label: "Abandoned" },
  { value: FeedbackStatus.DUPLICATE, label: "Duplicate" },
] as const

export default function Page() {
  const [replyText, setReplyText] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<FeedbackStatusType | undefined>(FeedbackStatus.ALL)
  
  const queryClient = useQueryClient()
  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ["feedbacks", statusFilter],
    queryFn: () => FeedbackRepository.getFeedbacks(statusFilter)
  })

  const updateFeedbackMutation = useMutation({
    mutationFn: (params: { id: number; status: number; reply: string }) => 
      FeedbackRepository.updateFeedback(params.id, { 
        status: params.status, 
        reply: params.reply 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] })
      setSelectedFeedback(null)
      setReplyText("")
      toast.success("Feedback updated successfully")
    },
    onError: () => {
      toast.error("Failed to update feedback")
    }
  })

  const getStatusBadge = (status: number) => {
    switch (status) {
      case FeedbackStatus.PENDING:
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> Pending
        </Badge>
      case FeedbackStatus.IN_PROGRESS:
        return <Badge variant="destructive" className="flex items-center gap-1 bg-yellow-500">
          <Timer className="w-3 h-3" /> In Progress
        </Badge>
      case FeedbackStatus.CLOSED:
        return <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Closed
        </Badge>
      case FeedbackStatus.REJECTED:
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" /> Rejected
        </Badge>
      case FeedbackStatus.ABANDONED:
        return <Badge variant="outline" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> Abandoned
        </Badge>
      case FeedbackStatus.DUPLICATE:
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Copy className="w-3 h-3" /> Duplicate
        </Badge>
    }
  }

function getFeedbackTypeColor(title: string) {
  const lowercaseTitle = title.toLowerCase();
  
  if (lowercaseTitle.includes('bug') || lowercaseTitle.includes('error')) {
    return 'text-red-500';
  }
  
  if (lowercaseTitle.includes('feature') || lowercaseTitle.includes('request')) {
    return 'text-blue-500';
  }
  
  if (lowercaseTitle.includes('improvement') || lowercaseTitle.includes('enhance')) {
    return 'text-green-500';
  }
  
  if (lowercaseTitle.includes('question') || lowercaseTitle.includes('help')) {
    return 'text-purple-500';
  }
  
  return 'text-gray-500'; // Default color for other feedback types
}

  return (
    <ApplicationPage title="User Feedbacks">
      <div className="mb-6 mx-2">
        <Select
        defaultValue={statusFilter?.toString()}
          value={statusFilter?.toString()}
          onValueChange={(value) => setStatusFilter(value ? Number(value) as FeedbackStatusType : undefined)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem 
                key={option.label} 
                value={option.value?.toString() ?? "undefined"}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          feedbacks?.map((feedback) => (
            <Card key={feedback.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <MessageSquare className={`h-5 w-5 mt-1 ${getFeedbackTypeColor(feedback.title)}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold capitalize">{feedback.title.replace(/([A-Z])/g, ' $1').trim()}</h3>
                        <p className="text-sm text-muted-foreground">{feedback.email}</p>
                      </div>
                      {getStatusBadge(feedback.status)}
                    </div>
                    <p className="text-sm mb-4">{feedback.feedback}</p>
                    {feedback.reply && (
                      <div className="bg-muted p-3 rounded-md mb-4">
                        <p className="text-sm font-medium">Reply:</p>
                        <p className="text-sm text-muted-foreground">{feedback.reply}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Submitted on {format(new Date(feedback.createdAt), "PPp")}
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={feedback.status.toString()}
                          onValueChange={(value) => {
                            updateFeedbackMutation.mutate({
                              id: feedback.id,
                              status: Number(value),
                              reply: feedback.reply || ""
                            })
                          }}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Set status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.slice(1).map((option) => (
                              <SelectItem 
                                key={option.label} 
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!feedback.reply && (
                          <Dialog open={selectedFeedback === feedback.id} onOpenChange={(open) => {
                            if (!open) setSelectedFeedback(null)
                            if (open) setSelectedFeedback(feedback.id)
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">Reply</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reply to Feedback</DialogTitle>
                                <DialogDescription>
                                  Write a response to the user's feedback.
                                </DialogDescription>
                              </DialogHeader>
                              <Textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your reply here..."
                                className="min-h-[100px]"
                              />
                              <DialogFooter className="mt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedFeedback(null)
                                    setReplyText("")
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => updateFeedbackMutation.mutate({
                                    id: feedback.id,
                                    status: feedback.status,
                                    reply: replyText
                                  })}
                                  disabled={!replyText.trim() || updateFeedbackMutation.isPending}
                                >
                                  {updateFeedbackMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Send Reply"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ApplicationPage>
  )
}