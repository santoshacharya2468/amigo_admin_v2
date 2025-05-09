import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/lib/api"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"

export interface User {
  id: number
  name: string
  email: string
  phone: string
  gender: string
  country: string
  isActive: boolean
  createdAt: string
  isOnline: boolean
  role: string
  avatar: string | null
}
interface UserTableProps {
  users: User[]
}

export function UserTable({ users }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [customDuration, setCustomDuration] = useState<string>("")
  const [isCustomDuration, setIsCustomDuration] = useState(false)

  const predefinedDurations = [
    { value: "3600", label: "1 Hour" },
    { value: "86400", label: "24 Hours" },
    { value: "604800", label: "1 Week" },
    { value: "2592000", label: "30 Days" },
    { value: "31536000", label: "1 Year" },
    { value: "630720000", label: "20 Years" },
  ]

  const handleBanUser = async () => {
    if (!selectedUser) return
    const duration = isCustomDuration ? parseInt(customDuration) * 60 : parseInt(selectedDuration)
    if (!duration) return

    try {
      setIsLoading(true)
      await api.post('/user/status', {
        duration,
        user_id: selectedUser.id,
        status: false
      })
      toast.success('User banned successfully')
      setIsDialogOpen(false)
      setCustomDuration("")
      setSelectedDuration("")
      setIsCustomDuration(false)
    } catch (error) {
      toast.error('Failed to ban user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.gender}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{user.email}</div>
                    <div className="text-muted-foreground">{user.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{user.country}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {user.isOnline && (
                      <Badge variant="outline" className="bg-green-50">Online</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Link href={`/dashboard/users/${user.id}`}>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsDialogOpen(true)
                        }}
                      >
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Ban User</DialogTitle>
            <DialogDescription className="">
              Select the duration for which you want to ban <span className="font-semibold text-red-500">{selectedUser?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className=" p-4 rounded-lg border">
              <label className="text-sm font-medium  mb-2 block">
                Ban Duration (in minutes)
              </label>
              <Input
                type="number"
                value={isCustomDuration ? customDuration : (parseInt(selectedDuration) / 60).toString()}
                onChange={(e) => {
                  setCustomDuration(e.target.value)
                  setIsCustomDuration(true)
                  setSelectedDuration("")
                }}
                placeholder="Enter duration in minutes"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium  block">
                Quick Select Duration
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {predefinedDurations.map((duration) => (
                  <Button
                    key={duration.value}
                    variant={selectedDuration === duration.value ? "default" : "outline"}
                    onClick={() => {
                      setSelectedDuration(duration.value)
                      setIsCustomDuration(false)
                      setCustomDuration((parseInt(duration.value) / 60).toString())
                    }}
                    size="sm"
                    className={`
                      transition-all duration-200 text-white
                      ${selectedDuration === duration.value 
                        ? 'bg-gray-500 hover:bg-gray-600 ' 
                        : 'hover:bg-gray-500 '}
                    `}
                  >
                    {duration.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                setCustomDuration("")
                setSelectedDuration("")
                setIsCustomDuration(false)
              }}
              className="hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBanUser}
              disabled={(!selectedDuration && !customDuration) || isLoading}
              className="bg-red-500 hover:bg-red-600 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Banning...</span>
                </div>
              ) : (
                "Ban User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}