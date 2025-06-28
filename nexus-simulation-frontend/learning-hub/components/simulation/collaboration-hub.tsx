"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageCircle, Video, UserPlus, Clock, Eye, Edit } from "lucide-react"

export function CollaborationHub() {
  const activeSessions = [
    {
      id: "1",
      modelTitle: "Monte Carlo Portfolio Risk",
      participants: [
        { name: "Alice Chen", role: "Owner", status: "editing" },
        { name: "Bob Smith", role: "Editor", status: "viewing" },
        { name: "Carol Davis", role: "Viewer", status: "active" },
      ],
      lastActivity: "2 minutes ago",
      status: "running",
    },
    {
      id: "2",
      modelTitle: "Climate Risk Assessment",
      participants: [
        { name: "David Wilson", role: "Owner", status: "active" },
        { name: "Emma Johnson", role: "Editor", status: "editing" },
      ],
      lastActivity: "15 minutes ago",
      status: "idle",
    },
  ]

  const invitations = [
    {
      id: "1",
      from: "Dr. Sarah Chen",
      modelTitle: "Neural Network Pricing Model",
      role: "Editor",
      sentAt: "1 hour ago",
    },
    {
      id: "2",
      from: "Prof. Michael Torres",
      modelTitle: "Epidemic Spread Simulation",
      role: "Viewer",
      sentAt: "3 hours ago",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Collaboration Hub</CardTitle>
          <CardDescription>Manage your collaborative simulation sessions and team interactions</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">
            <Users className="mr-2 h-4 w-4" />
            Active Sessions
          </TabsTrigger>
          <TabsTrigger value="invitations">
            <UserPlus className="mr-2 h-4 w-4" />
            Invitations
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="mr-2 h-4 w-4" />
            Session History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{session.modelTitle}</CardTitle>
                    <Badge variant={session.status === "running" ? "default" : "secondary"}>{session.status}</Badge>
                  </div>
                  <CardDescription>Last activity: {session.lastActivity}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Participants */}
                    <div>
                      <h4 className="font-medium mb-2">Participants ({session.participants.length}/4)</h4>
                      <div className="space-y-2">
                        {session.participants.map((participant, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="font-medium">{participant.name}</span>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <Badge variant="outline" className="text-xs">
                                    {participant.role}
                                  </Badge>
                                  <div className="flex items-center space-x-1">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        participant.status === "editing"
                                          ? "bg-blue-500"
                                          : participant.status === "active"
                                            ? "bg-green-500"
                                            : "bg-yellow-500"
                                      }`}
                                    />
                                    <span>{participant.status}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              {participant.status === "editing" && <Edit className="h-4 w-4 text-blue-500" />}
                              {participant.status === "viewing" && <Eye className="h-4 w-4 text-yellow-500" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Join Session
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="mr-1 h-3 w-3" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="mr-1 h-3 w-3" />
                        Video Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <UserPlus className="mr-1 h-3 w-3" />
                        Invite
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invitations">
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <Card key={invitation.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{invitation.modelTitle}</h4>
                      <p className="text-sm text-gray-500">
                        Invited by {invitation.from} as {invitation.role} • {invitation.sentAt}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Accept
                      </Button>
                      <Button variant="outline" size="sm">
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Session History</h3>
              <p className="text-gray-500">Your past collaboration sessions will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
