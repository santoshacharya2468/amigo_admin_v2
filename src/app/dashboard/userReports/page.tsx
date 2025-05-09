"use client"

import ApplicationPage from "@/components/application-page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserReportRepository } from "@/repository/user-report.repository"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react"
import toast from "react-hot-toast"

export default function Page() {
  const queryClient = useQueryClient()
  const { data: reports, isLoading } = useQuery({
    queryKey: ["user-reports"],
    queryFn: () => UserReportRepository.getUserReports()
  })

  const updateStatusMutation = useMutation({
    mutationFn: (params: { id: number; status: number }) => 
      UserReportRepository.updateReportStatus(params.id, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-reports"] })
      toast.success("Report status updated successfully")
    },
    onError: () => {
      toast.error("Failed to update report status")
    }
  })

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> Pending
        </Badge>
      case 1:
        return <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Resolved
        </Badge>
      case 2:
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" /> Rejected
        </Badge>
    }
  }

  return (
    <ApplicationPage title="User Reports">
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          reports?.map((report) => (
            <Card key={report.userReport.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{report.userReport.title}</h3>
                      {getStatusBadge(report.userReport.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {report.userReport.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={report.user.avatar} />
                            <AvatarFallback>{report.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">Reporter</div>
                            <div className="text-sm text-muted-foreground">{report.user.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={report.user2.avatar} />
                            <AvatarFallback>{report.user2.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">Reported User</div>
                            <div className="text-sm text-muted-foreground">{report.user2.name}</div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatusMutation.mutate({ 
                            id: report.userReport.id, 
                            status: 2 
                          })}
                          disabled={report.userReport.status !== 0 || updateStatusMutation.isPending}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => updateStatusMutation.mutate({ 
                            id: report.userReport.id, 
                            status: 1 
                          })}
                          disabled={report.userReport.status !== 0 || updateStatusMutation.isPending}
                        >
                          Resolve
                        </Button>
                      </div> */}
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