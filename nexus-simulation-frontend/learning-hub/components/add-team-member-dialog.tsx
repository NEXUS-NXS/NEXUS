"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Mail } from "lucide-react"

interface AddTeamMemberDialogProps {
  children: React.ReactNode
}

export function AddTeamMemberDialog({ children }: AddTeamMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")

  const availableMembers = [
    {
      id: "1",
      name: "Alex Thompson",
      email: "alex.thompson@example.com",
      role: "Senior Actuary",
      department: "Risk Management",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      role: "Data Scientist",
      department: "Analytics",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "Compliance Officer",
      department: "Legal",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      role: "Actuary",
      department: "Product Development",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const filteredMembers = availableMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddMember = (memberId: string) => {
    // Add member logic here
    console.log("Adding member:", memberId, "with role:", selectedRole)
    setOpen(false)
  }

  const handleInviteByEmail = () => {
    // Invite by email logic here
    console.log("Inviting:", inviteEmail, "with role:", selectedRole)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add existing team members to this project or invite new collaborators by email.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label>Project Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role for new member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead">Project Lead</SelectItem>
                <SelectItem value="member">Team Member</SelectItem>
                <SelectItem value="contributor">Contributor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Search Team Members</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or department"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-md">
              {filteredMembers.length > 0 ? (
                <div className="p-2">
                  {filteredMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {member.role}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {member.department}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddMember(member.id)}
                        disabled={!selectedRole}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <UserPlus className="mx-auto h-8 w-8 mb-2" />
                  <p>No team members found</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex flex-col gap-2">
              <Label>Invite by Email</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="pl-9"
                    type="email"
                  />
                </div>
                <Button variant="outline" onClick={handleInviteByEmail} disabled={!inviteEmail || !selectedRole}>
                  Send Invite
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
