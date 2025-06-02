"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MessageCircle, Video, UserPlus } from "lucide-react"

interface Collaborator {
  id: string
  name: string
  avatar: string
  status: "active" | "viewing" | "editing" | "away"
  cursor?: { x: number; y: number } | null
}

interface CollaborationPanelProps {
  collaborators: Collaborator[]
}

export function CollaborationPanel({ collaborators }: CollaborationPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "editing":
        return "bg-blue-500"
      case "viewing":
        return "bg-yellow-500"
      case "away":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "editing":
        return "Editing"
      case "viewing":
        return "Viewing"
      case "away":
        return "Away"
      default:
        return "Unknown"
    }
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-900">Live Collaboration</span>
              <Badge variant="secondary">{collaborators.length}/4 users</Badge>
            </div>

            <div className="flex items-center space-x-2">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="relative">
                  <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                    <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(collaborator.status)}`}
                  />

                  {/* Cursor indicator */}
                  {collaborator.cursor && (
                    <div
                      className="absolute w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                      style={{
                        left: `${collaborator.cursor.x}%`,
                        top: `${collaborator.cursor.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat
            </Button>
            <Button variant="outline" size="sm">
              <Video className="mr-2 h-4 w-4" />
              Video Call
            </Button>
            <Button variant="outline" size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite
            </Button>
          </div>
        </div>

        {/* Collaborator Details */}
        <div className="mt-3 flex flex-wrap gap-2">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center space-x-1 bg-white rounded-full px-2 py-1 text-xs">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(collaborator.status)}`} />
              <span className="font-medium">{collaborator.name}</span>
              <span className="text-gray-500">• {getStatusText(collaborator.status)}</span>
            </div>
          ))}
        </div>

        {/* Live Activity Feed */}
        <div className="mt-3 text-xs text-purple-700 bg-white rounded-lg p-2">
          <div className="space-y-1">
            <div>• Alice Chen is editing parameters</div>
            <div>• Bob Smith joined the session</div>
            <div>• Carol Davis is viewing results</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
