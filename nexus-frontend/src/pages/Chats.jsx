"use client"

import { useState, useEffect } from "react"
import { Search, Plus, MessageSquare, Users, Video, Phone, MoreVertical } from "lucide-react"
import { useUser } from "../context/UserContext"
import "./Chats.css"

const Chats = () => {
  const { user } = useUser()
  const [activeChat, setActiveChat] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [message, setMessage] = useState("")
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({})

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    // Simulate API call
    const mockConversations = [
      {
        id: 1,
        type: "direct",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "Thanks for the study notes!",
        lastMessageTime: "2024-01-11T15:30:00Z",
        unreadCount: 2,
        isOnline: true,
      },
      {
        id: 2,
        type: "group",
        name: "SOA Exam P Study Group",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "Mike: Let's schedule our next session",
        lastMessageTime: "2024-01-11T14:45:00Z",
        unreadCount: 5,
        memberCount: 24,
      },
      {
        id: 3,
        type: "direct",
        name: "Mike Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "Did you finish the probability homework?",
        lastMessageTime: "2024-01-11T12:20:00Z",
        unreadCount: 0,
        isOnline: false,
      },
      {
        id: 4,
        type: "group",
        name: "Actuarial Python Coding",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "Emily: Check out this new library",
        lastMessageTime: "2024-01-11T10:15:00Z",
        unreadCount: 1,
        memberCount: 18,
      },
      {
        id: 5,
        type: "direct",
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "Great explanation in today's session!",
        lastMessageTime: "2024-01-10T18:30:00Z",
        unreadCount: 0,
        isOnline: true,
      },
    ]

    setConversations(mockConversations)

    // Mock messages for each conversation
    const mockMessages = {
      1: [
        {
          id: 1,
          senderId: "user123",
          senderName: "Sarah Johnson",
          message: "Hey! How's the exam prep going?",
          timestamp: "2024-01-11T15:00:00Z",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: 2,
          senderId: user.id,
          senderName: user.name,
          message: "Pretty good! Just finished the probability chapter.",
          timestamp: "2024-01-11T15:15:00Z",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: 3,
          senderId: "user123",
          senderName: "Sarah Johnson",
          message: "Thanks for the study notes!",
          timestamp: "2024-01-11T15:30:00Z",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
      2: [
        {
          id: 1,
          senderId: "user456",
          senderName: "Mike Chen",
          message: "Let's schedule our next session",
          timestamp: "2024-01-11T14:45:00Z",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
    }

    setMessages(mockMessages)
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim() || !activeChat) return

    const newMessage = {
      id: Date.now(),
      senderId: user.id,
      senderName: user.name,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      avatar: "/placeholder.svg?height=32&width=32",
    }

    setMessages((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage],
    }))

    setMessage("")

    // Update last message in conversation
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeChat.id
          ? {
              ...conv,
              lastMessage: message.trim(),
              lastMessageTime: new Date().toISOString(),
            }
          : conv,
      ),
    )
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="chats-page">
      <div className="chats-sidebar">
        <div className="chats-header">
          <h2>Messages</h2>
          <button className="new-chat-btn">
            <Plus size={20} />
          </button>
        </div>

        <div className="chat-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="conversations-list">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${activeChat?.id === conversation.id ? "active" : ""}`}
              onClick={() => setActiveChat(conversation)}
            >
              <div className="conversation-avatar">
                <img src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                {conversation.type === "direct" && conversation.isOnline && <div className="online-indicator"></div>}
                {conversation.type === "group" && (
                  <div className="group-indicator">
                    <Users size={12} />
                  </div>
                )}
              </div>

              <div className="conversation-info">
                <div className="conversation-header">
                  <h3>{conversation.name}</h3>
                  <span className="last-message-time">{formatTime(conversation.lastMessageTime)}</span>
                </div>
                <div className="conversation-preview">
                  <p>{conversation.lastMessage}</p>
                  {conversation.unreadCount > 0 && <span className="unread-badge">{conversation.unreadCount}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        {activeChat ? (
          <>
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar">
                  <img src={activeChat.avatar || "/placeholder.svg"} alt={activeChat.name} />
                  {activeChat.type === "direct" && activeChat.isOnline && <div className="online-indicator"></div>}
                </div>
                <div className="chat-details">
                  <h3>{activeChat.name}</h3>
                  <p>
                    {activeChat.type === "group"
                      ? `${activeChat.memberCount} members`
                      : activeChat.isOnline
                        ? "Online"
                        : "Last seen recently"}
                  </p>
                </div>
              </div>

              <div className="chat-actions">
                <button className="chat-action-btn">
                  <Phone size={20} />
                </button>
                <button className="chat-action-btn">
                  <Video size={20} />
                </button>
                <button className="chat-action-btn">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {(messages[activeChat.id] || []).map((msg) => (
                <div key={msg.id} className={`message ${msg.senderId === user.id ? "own-message" : ""}`}>
                  {msg.senderId !== user.id && (
                    <div className="message-avatar">
                      <img src={msg.avatar || "/placeholder.svg"} alt={msg.senderName} />
                    </div>
                  )}
                  <div className="message-content">
                    {msg.senderId !== user.id && activeChat.type === "group" && (
                      <div className="message-sender">{msg.senderName}</div>
                    )}
                    <div className="message-bubble">
                      <p>{msg.message}</p>
                      <span className="message-time">{formatMessageTime(msg.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <div className="chat-input-container">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="chat-input"
                />
                <button type="submit" className="send-btn" disabled={!message.trim()}>
                  <MessageSquare size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <MessageSquare size={64} />
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the sidebar to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chats
