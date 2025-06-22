"use client"

import { useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  Crown,
  Lock,
  Globe,
  Send,
  Paperclip,
  Video,
  MoreVertical,
  Smile,
  X,
  Download,
  FileText,
  ImageIcon,
  Film,
  Phone,
} from "lucide-react"
import "./GroupDetail.css"
import GroupSettingsModal from "./GroupSettingsModal"

const GroupDetail = ({ group, onBack, onLeave, currentUser }) => {
  const [activeTab, setActiveTab] = useState("chat")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState([])
  const [emojiSearchQuery, setEmojiSearchQuery] = useState("")
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState("smileys")
  const [recentEmojis, setRecentEmojis] = useState(["😊", "👍", "❤️", "😂", "🎉"])
  const [selectedImage, setSelectedImage] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showVideoModal, setShowVideoModal] = useState(false)

  const fileInputRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const chatInputRef = useRef(null)
  const chatMessagesRef = useRef(null)

  const [members] = useState([
    {
      id: "user123",
      name: "Sarah Johnson",
      role: "owner",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      joinDate: "2024-01-01",
    },
    {
      id: "user456",
      name: "Mike Chen",
      role: "admin",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      joinDate: "2024-01-02",
    },
    {
      id: "user789",
      name: "Emily Rodriguez",
      role: "member",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
      joinDate: "2024-01-03",
    },
    {
      id: "user101",
      name: "David Kim",
      role: "member",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      joinDate: "2024-01-04",
    },
  ])

  const [upcomingSessions] = useState([
    {
      id: 1,
      title: "Probability Distributions Review",
      date: "2024-01-15T18:00:00Z",
      duration: "2 hours",
      type: "study",
      organizer: "Sarah Johnson",
    },
    {
      id: 2,
      title: "Mock Exam Practice",
      date: "2024-01-17T19:00:00Z",
      duration: "3 hours",
      type: "exam",
      organizer: "Mike Chen",
    },
  ])

  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // Emoji data organized by categories (same as Chats.jsx)
  const emojiCategories = {
    smileys: {
      name: "Smileys & People",
      emojis: [
        "😀",
        "😃",
        "😄",
        "😁",
        "😆",
        "😅",
        "🤣",
        "😂",
        "🙂",
        "🙃",
        "😉",
        "😊",
        "😇",
        "🥰",
        "😍",
        "🤩",
        "😘",
        "😗",
        "😚",
        "😙",
        "😋",
        "😛",
        "😜",
        "🤪",
        "😝",
        "🤑",
        "🤗",
        "🤭",
        "🤫",
        "🤔",
        "🤐",
        "🤨",
        "😐",
        "😑",
        "😶",
        "😏",
        "😒",
        "🙄",
        "😬",
        "🤥",
        "😔",
        "😪",
        "🤤",
        "😴",
        "😷",
        "🤒",
        "🤕",
        "🤢",
        "🤮",
        "🤧",
        "🥵",
        "🥶",
        "🥴",
        "😵",
        "🤯",
        "🤠",
        "🥳",
        "😎",
        "🤓",
        "🧐",
      ],
    },
    animals: {
      name: "Animals & Nature",
      emojis: [
        "🐶",
        "🐱",
        "🐭",
        "🐹",
        "🐰",
        "🦊",
        "🐻",
        "🐼",
        "🐨",
        "🐯",
        "🦁",
        "🐮",
        "🐷",
        "🐽",
        "🐸",
        "🐵",
        "🙈",
        "🙉",
        "🙊",
        "🐒",
        "🐔",
        "🐧",
        "🐦",
        "🐤",
        "🐣",
        "🐥",
        "🦆",
        "🦅",
        "🦉",
        "🦇",
        "🐺",
        "🐗",
        "🐴",
        "🦄",
        "🐝",
        "🐛",
        "🦋",
        "🐌",
        "🐞",
        "🐜",
        "🦟",
        "🦗",
        "🕷",
        "🕸",
        "🦂",
        "🐢",
        "🐍",
        "🦎",
      ],
    },
    food: {
      name: "Food & Drink",
      emojis: [
        "🍎",
        "🍐",
        "🍊",
        "🍋",
        "🍌",
        "🍉",
        "🍇",
        "🍓",
        "🫐",
        "🍈",
        "🍒",
        "🍑",
        "🥭",
        "🍍",
        "🥥",
        "🥝",
        "🍅",
        "🍆",
        "🥑",
        "🥦",
        "🥬",
        "🥒",
        "🌶",
        "🫑",
        "🌽",
        "🥕",
        "🫒",
        "🧄",
        "🧅",
        "🥔",
        "🍠",
        "🥐",
        "🥯",
        "🍞",
        "🥖",
        "🥨",
        "🧀",
        "🥚",
        "🍳",
        "🧈",
        "🥞",
        "🧇",
        "🥓",
        "🥩",
        "🍗",
        "🍖",
        "🦴",
        "🌭",
      ],
    },
    activities: {
      name: "Activities",
      emojis: [
        "⚽",
        "🏀",
        "🏈",
        "⚾",
        "🥎",
        "🎾",
        "🏐",
        "🏉",
        "🥏",
        "🎱",
        "🪀",
        "🏓",
        "🏸",
        "🏒",
        "🏑",
        "🥍",
        "🏏",
        "🪃",
        "🥅",
        "⛳",
        "🪁",
        "🏹",
        "🎣",
        "🤿",
        "🥊",
        "🥋",
        "🎽",
        "🛹",
        "🛷",
        "⛸",
        "🥌",
        "🎿",
        "⛷",
        "🏂",
        "🪂",
        "🏋️‍♀️",
        "🏋️",
        "🏋️‍♂️",
        "🤼‍♀️",
        "🤼",
        "🤼‍♂️",
        "🤸‍♀️",
        "🤸",
        "🤸‍♂️",
      ],
    },
    objects: {
      name: "Objects",
      emojis: [
        "⌚",
        "📱",
        "📲",
        "💻",
        "⌨️",
        "🖥",
        "🖨",
        "🖱",
        "🖲",
        "🕹",
        "🗜",
        "💽",
        "💾",
        "💿",
        "📀",
        "📼",
        "📷",
        "📸",
        "📹",
        "🎥",
        "📽",
        "🎞",
        "📞",
        "☎️",
        "📟",
        "📠",
        "📺",
        "📻",
        "🎙",
        "🎚",
        "🎛",
        "🧭",
        "⏱",
        "⏲",
        "⏰",
        "🕰",
        "⌛",
        "⏳",
        "📡",
        "🔋",
        "🔌",
        "💡",
        "🔦",
        "🕯",
        "🪔",
        "🧯",
        "🛢",
        "💸",
      ],
    },
    symbols: {
      name: "Symbols",
      emojis: [
        "❤️",
        "🧡",
        "💛",
        "💚",
        "💙",
        "💜",
        "🖤",
        "🤍",
        "🤎",
        "💔",
        "❣️",
        "💕",
        "💞",
        "💓",
        "💗",
        "💖",
        "💘",
        "💝",
        "💟",
        "☮️",
        "✝️",
        "☪️",
        "🕉",
        "☸️",
        "✡️",
        "🔯",
        "🕎",
        "☯️",
        "☦️",
        "🛐",
        "⛎",
        "♈",
        "♉",
        "♊",
        "♋",
        "♌",
        "♍",
        "♎",
        "♏",
        "♐",
        "♑",
        "♒",
        "♓",
        "🆔",
        "⚛️",
        "🉑",
        "☢️",
        "☣️",
        "📴",
      ],
    },
  }

  const isOwner = group.ownerId === currentUser?.id

  useEffect(() => {
    // Initialize with some sample messages
    setMessages([
      {
        id: 1,
        user: "Sarah Johnson",
        userId: "user123",
        message: "Hey everyone! Ready for today's study session?",
        timestamp: "2024-01-11T10:30:00Z",
        avatar: "/placeholder.svg?height=32&width=32",
        type: "text",
      },
      {
        id: 2,
        user: "Mike Chen",
        userId: "user456",
        message: "Yes! I've prepared some practice problems for probability distributions.",
        timestamp: "2024-01-11T10:32:00Z",
        avatar: "/placeholder.svg?height=32&width=32",
        type: "text",
      },
      {
        id: 3,
        user: "Emily Rodriguez",
        userId: "user789",
        message: "Great! I'll share my notes on conditional probability.",
        timestamp: "2024-01-11T10:35:00Z",
        avatar: "/placeholder.svg?height=32&width=32",
        type: "text",
      },
      {
        id: 4,
        user: "Sarah Johnson",
        userId: "user123",
        message: "",
        timestamp: "2024-01-11T10:40:00Z",
        avatar: "/placeholder.svg?height=32&width=32",
        type: "file",
        fileData: {
          name: "Probability_Notes.pdf",
          size: "2.3 MB",
          url: "#",
          type: "pdf",
        },
      },
    ])
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      user: currentUser.name,
      userId: currentUser.id,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      avatar: "/placeholder.svg?height=32&width=32",
      type: "text",
    }

    setMessages([...messages, newMessage])
    setMessage("")
    setShowEmojiPicker(false)
  }

  const handleEmojiSelect = (emoji) => {
    const input = chatInputRef.current
    if (input) {
      const start = input.selectionStart
      const end = input.selectionEnd
      const newMessage = message.slice(0, start) + emoji + message.slice(end)
      setMessage(newMessage)

      setTimeout(() => {
        input.focus()
        input.setSelectionRange(start + emoji.length, start + emoji.length)
      }, 0)
    } else {
      setMessage((prev) => prev + emoji)
    }

    setRecentEmojis((prev) => {
      const newRecent = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 5)
      return newRecent
    })
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)

    files.forEach((file) => {
      const validTypes = {
        image: ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"],
        video: ["video/mp4", "video/mov", "video/avi", "video/webm", "video/quicktime"],
        document: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/msword",
          "text/plain",
          "text/csv",
        ],
      }

      const maxSizes = {
        image: 10 * 1024 * 1024, // 10MB
        video: 100 * 1024 * 1024, // 100MB
        document: 25 * 1024 * 1024, // 25MB
      }

      let fileType = "file" // Default to file type
      if (validTypes.image.includes(file.type)) fileType = "image"
      else if (validTypes.video.includes(file.type)) fileType = "video"
      else if (validTypes.document.includes(file.type)) fileType = "file"

      if (file.size > maxSizes[fileType === "file" ? "document" : fileType]) {
        const maxSizeMB = maxSizes[fileType === "file" ? "document" : fileType] / (1024 * 1024)
        alert(`File too large. Maximum size for ${fileType === "file" ? "document" : fileType}s is ${maxSizeMB}MB`)
        return
      }

      const fileId = Date.now() + Math.random()
      setUploadingFiles((prev) => [...prev, { id: fileId, name: file.name, progress: 0 }])

      // Create object URL for the file
      const fileUrl = URL.createObjectURL(file)

      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadingFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))

        if (progress >= 100) {
          clearInterval(interval)
          setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))

          const newMessage = {
            id: messages.length + Date.now(),
            user: currentUser.name,
            userId: currentUser.id,
            message: "",
            timestamp: new Date().toISOString(),
            avatar: "/placeholder.svg?height=32&width=32",
            type: fileType,
            fileData: {
              name: file.name,
              size: formatFileSize(file.size),
              url: fileUrl,
              type: file.type,
            },
          }

          setMessages((prev) => [...prev, newMessage])
        }
      }, 200)
    })

    event.target.value = ""
    setShowFileUpload(false)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatSessionDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getFilteredEmojis = () => {
    const categoryEmojis = emojiCategories[selectedEmojiCategory]?.emojis || []
    if (!emojiSearchQuery) return categoryEmojis

    return categoryEmojis.filter((emoji) => emoji.includes(emojiSearchQuery))
  }

  const renderMessage = (msg) => {
    switch (msg.type) {
      case "image":
        return (
          <div className="message-file image-message">
            <img
              src={msg.fileData.url || "/placeholder.svg"}
              alt={msg.fileData.name}
              className="message-image"
              onClick={() => {
                setSelectedImage(msg.fileData)
                setShowImageModal(true)
              }}
            />
            <div className="file-info">
              <span className="file-name">{msg.fileData.name}</span>
              <span className="file-size">{msg.fileData.size}</span>
            </div>
          </div>
        )

      case "video":
        return (
          <div className="message-file video-message">
            <div className="video-container">
              <video
                src={msg.fileData.url}
                className="message-video"
                controls
                preload="metadata"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="file-info">
              <span className="file-name">{msg.fileData.name}</span>
              <span className="file-size">{msg.fileData.size}</span>
            </div>
          </div>
        )

      case "file":
        const getFileIcon = (type, name) => {
          if (type?.includes("pdf") || name?.toLowerCase().endsWith(".pdf"))
            return <FileText size={24} color="#e53e3e" />
          if (type?.includes("word") || name?.toLowerCase().endsWith(".docx"))
            return <FileText size={24} color="#2b6cb0" />
          if (type?.includes("text") || name?.toLowerCase().endsWith(".txt"))
            return <FileText size={24} color="#4a5568" />
          return <FileText size={24} color="#4a5568" />
        }

        const handleDocumentClick = () => {
          if (msg.fileData.url && msg.fileData.url !== "#") {
            // For real files, open in new tab
            window.open(msg.fileData.url, "_blank")
          } else {
            // For demo purposes, show alert
            alert(`Opening ${msg.fileData.name}...`)
          }
        }

        return (
          <div className="message-file document-message" onClick={handleDocumentClick}>
            <div className="file-icon">{getFileIcon(msg.fileData.type, msg.fileData.name)}</div>
            <div className="file-info">
              <span className="file-name">{msg.fileData.name}</span>
              <span className="file-size">{msg.fileData.size}</span>
              <span className="file-type">
                {msg.fileData.type?.split("/")[1]?.toUpperCase() ||
                  msg.fileData.name?.split(".").pop()?.toUpperCase() ||
                  "DOCUMENT"}
              </span>
            </div>
            <button
              className="download-btn"
              onClick={(e) => {
                e.stopPropagation()
                if (msg.fileData.url && msg.fileData.url !== "#") {
                  const link = document.createElement("a")
                  link.href = msg.fileData.url
                  link.download = msg.fileData.name
                  link.click()
                }
              }}
            >
              <Download size={16} />
            </button>
          </div>
        )

      default:
        return <p>{msg.message}</p>
    }
  }

  const handleVideoCall = () => {
    // Navigate to video call with group participants
    window.location.href = `/video-call?group=${encodeURIComponent(group.name)}&id=${group.id}`
  }

  const handleAudioCall = () => {
    // Navigate to audio call with group participants
    window.location.href = `/audio-call?group=${encodeURIComponent(group.name)}&id=${group.id}`
  }

  return (
    <div className="group-detail-page">
      <div className="group-detail-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Groups
        </button>

        <div className="group-header-info">
          <div className="group-avatar-large">
            <img src={group.avatar || "/placeholder.svg"} alt={group.name} />
            {group.isPrivate && (
              <div className="privacy-badge">
                <Lock size={16} />
              </div>
            )}
          </div>

          <div className="group-details">
            <h1>{group.name}</h1>
            <p className="group-description">{group.description}</p>
            <div className="group-meta">
              <span className="member-count">
                <Users size={16} />
                {group.members} members
              </span>
              <span className="privacy-status">
                {group.isPrivate ? <Lock size={16} /> : <Globe size={16} />}
                {group.isPrivate ? "Private" : "Public"}
              </span>
            </div>
          </div>

          <div className="group-actions">
            <button className="video-call-btn" onClick={handleVideoCall}>
              <Video size={16} />
              Start Call
            </button>
            <button className="audio-call-btn" onClick={handleAudioCall}>
              <Phone size={16} />
              Audio Call
            </button>
            {isOwner ? (
              <button className="settings-btn" onClick={() => setShowSettingsModal(true)}>
                <Settings size={16} />
                Settings
              </button>
            ) : (
              <button className="leave-group-btn" onClick={onLeave}>
                Leave Group
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="group-detail-tabs">
        <button className={`tab-btn ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
          <MessageSquare size={16} />
          Chat
        </button>
        <button
          className={`tab-btn ${activeTab === "members" ? "active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          <Users size={16} />
          Members
        </button>
        <button
          className={`tab-btn ${activeTab === "sessions" ? "active" : ""}`}
          onClick={() => setActiveTab("sessions")}
        >
          <Calendar size={16} />
          Sessions
        </button>
      </div>

      <div className="group-detail-content">
        {activeTab === "chat" && (
          <div className="chat-tab">
            <div className="chat-messages" ref={chatMessagesRef}>
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.userId === currentUser.id ? "own-message" : ""}`}>
                  {msg.userId !== currentUser.id && (
                    <div className="message-avatar">
                      <img src={msg.avatar || "/placeholder.svg"} alt={msg.user} />
                    </div>
                  )}
                  <div className="message-content">
                    {msg.userId !== currentUser.id && (
                      <div className="message-header">
                        <span className="message-user">{msg.user}</span>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                    )}
                    <div className="message-bubble">
                      {renderMessage(msg)}
                      {msg.userId === currentUser.id && (
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Show uploading files */}
              {uploadingFiles.map((file) => (
                <div key={file.id} className="message own-message">
                  <div className="message-content">
                    <div className="message-bubble">
                      <div className="uploading-file">
                        <div className="file-info">
                          <span className="file-name">{file.name}</span>
                          <div className="upload-progress">
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${file.progress}%` }}></div>
                            </div>
                            <span className="progress-text">{file.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <div className="chat-input-container">
                <div className="input-actions">
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowFileUpload(!showFileUpload)}
                    title="Attach File"
                  >
                    <Paperclip size={20} />
                  </button>

                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    title="Add Emoji"
                  >
                    <Smile size={20} />
                  </button>
                </div>

                <input
                  ref={chatInputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="chat-input"
                />

                <button type="submit" className="send-btn" disabled={!message.trim()}>
                  <Send size={20} />
                </button>
              </div>

              {/* File Upload Options */}
              {showFileUpload && (
                <div className="file-upload-options">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="file-option"
                    onClick={() => {
                      fileInputRef.current.accept = "image/*"
                      fileInputRef.current.click()
                    }}
                  >
                    <ImageIcon size={20} />
                    <span>Photos</span>
                  </button>
                  <button
                    type="button"
                    className="file-option"
                    onClick={() => {
                      fileInputRef.current.accept = "video/*"
                      fileInputRef.current.click()
                    }}
                  >
                    <Film size={20} />
                    <span>Videos</span>
                  </button>
                  <button
                    type="button"
                    className="file-option"
                    onClick={() => {
                      fileInputRef.current.accept = ".pdf,.docx,.txt"
                      fileInputRef.current.click()
                    }}
                  >
                    <FileText size={20} />
                    <span>Documents</span>
                  </button>
                </div>
              )}

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="emoji-picker" ref={emojiPickerRef}>
                  <div className="emoji-picker-header">
                    <input
                      type="text"
                      placeholder="Search emojis..."
                      value={emojiSearchQuery}
                      onChange={(e) => setEmojiSearchQuery(e.target.value)}
                      className="emoji-search"
                    />
                    <button className="emoji-close" onClick={() => setShowEmojiPicker(false)}>
                      <X size={16} />
                    </button>
                  </div>

                  {/* Recent Emojis */}
                  {recentEmojis.length > 0 && (
                    <div className="emoji-section">
                      <div className="emoji-section-title">Recently Used</div>
                      <div className="emoji-grid">
                        {recentEmojis.map((emoji, index) => (
                          <button
                            key={`recent-${index}`}
                            type="button"
                            className="emoji-btn"
                            onClick={() => handleEmojiSelect(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Tabs */}
                  <div className="emoji-categories">
                    {Object.entries(emojiCategories).map(([key, category]) => (
                      <button
                        key={key}
                        type="button"
                        className={`emoji-category-btn ${selectedEmojiCategory === key ? "active" : ""}`}
                        onClick={() => setSelectedEmojiCategory(key)}
                        title={category.name}
                      >
                        {category.emojis[0]}
                      </button>
                    ))}
                  </div>

                  {/* Emoji Grid */}
                  <div className="emoji-section">
                    <div className="emoji-section-title">{emojiCategories[selectedEmojiCategory]?.name}</div>
                    <div className="emoji-grid">
                      {getFilteredEmojis().map((emoji, index) => (
                        <button
                          key={`${selectedEmojiCategory}-${index}`}
                          type="button"
                          className="emoji-btn"
                          onClick={() => handleEmojiSelect(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {activeTab === "members" && (
          <div className="members-tab">
            <div className="members-header">
              <h3>Members ({members.length})</h3>
              {isOwner && (
                <button className="invite-btn">
                  <Users size={16} />
                  Invite Members
                </button>
              )}
            </div>

            <div className="members-list">
              {members.map((member) => (
                <div key={member.id} className="member-item">
                  <div className="member-avatar">
                    <img src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <div className={`status-indicator ${member.status}`}></div>
                  </div>
                  <div className="member-info">
                    <div className="member-name">
                      {member.name}
                      {member.role === "owner" && <Crown size={14} className="role-icon owner" />}
                      {member.role === "admin" && <Settings size={14} className="role-icon admin" />}
                    </div>
                    <div className="member-details">
                      <span className="member-role">{member.role}</span>
                      <span className="join-date">Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {isOwner && member.id !== currentUser.id && (
                    <button className="member-options">
                      <MoreVertical size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="sessions-tab">
            <div className="sessions-header">
              <h3>Upcoming Sessions</h3>
              {isOwner && (
                <button className="schedule-btn">
                  <Calendar size={16} />
                  Schedule Session
                </button>
              )}
            </div>

            <div className="sessions-list">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="session-item">
                  <div className="session-info">
                    <h4>{session.title}</h4>
                    <div className="session-details">
                      <span className="session-date">
                        <Calendar size={14} />
                        {formatSessionDate(session.date)}
                      </span>
                      <span className="session-duration">Duration: {session.duration}</span>
                      <span className="session-organizer">Organized by {session.organizer}</span>
                    </div>
                  </div>
                  <div className="session-actions">
                    <button className="join-session-btn">Join Session</button>
                  </div>
                </div>
              ))}
            </div>

            {upcomingSessions.length === 0 && (
              <div className="no-sessions">
                <p>No upcoming sessions scheduled.</p>
                {isOwner && (
                  <button className="schedule-first-btn">
                    <Calendar size={16} />
                    Schedule First Session
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {showSettingsModal && (
        <GroupSettingsModal
          group={group}
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onUpdateGroup={(updatedGroup) => {
            console.log("Updated group:", updatedGroup)
          }}
          currentUser={currentUser}
        />
      )}
      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="media-modal" onClick={() => setShowImageModal(false)}>
          <div className="media-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowImageModal(false)}>
              <X size={24} />
            </button>
            <img src={selectedImage.url || "/placeholder.svg"} alt={selectedImage.name} className="modal-image" />
            <div className="modal-info">
              <h3>{selectedImage.name}</h3>
              <p>{selectedImage.size}</p>
              <button
                className="modal-download"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = selectedImage.url
                  link.download = selectedImage.name
                  link.click()
                }}
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupDetail
