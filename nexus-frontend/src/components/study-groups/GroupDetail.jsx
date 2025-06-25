import { useState, useEffect, useRef } from "react"
import { 
  ArrowLeft, Users, Calendar, MessageSquare, Settings, Crown, Lock, Globe, 
  Send, Paperclip, Video, MoreVertical, Smile, X, Download, FileText, 
  ImageIcon, Film, Phone, Loader2
} from "lucide-react"
import { useUser } from "../../context/UserContext"
import axios from "axios"
import GroupSettingsModal from "./GroupSettingsModal"
import "./GroupDetail.css"

const GroupDetail = ({ group, onBack, onLeave, currentUser }) => {
  const [activeTab, setActiveTab] = useState("chat")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [members, setMembers] = useState([])
  const [upcomingSessions, setUpcomingSessions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [socket, setSocket] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState([])
  const [emojiSearchQuery, setEmojiSearchQuery] = useState("")
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState("smileys")
  const [recentEmojis, setRecentEmojis] = useState(["😊", "👍", "❤️", "😂", "🎉"])
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [accessToken, setAccessToken] = useState(null)
  const chatMessagesRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const fileInputRef = useRef(null)

 

  const emojiCategories = {
    smileys: {
      name: "Smileys & People",
      emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃"],
    },
    animals: {
      name: "Animals & Nature",
      emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯"],
    },
    food: {
      name: "Food & Drink",
      emojis: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈"],
    },
    activities: {
      name: "Activities",
      emojis: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱"],
    },
    objects: {
      name: "Objects",
      emojis: ["⌚", "📱", "📲", "💻", "⌨️", "🖥", "🖨", "🖱", "🖲", "🕹"],
    },
    symbols: {
      name: "Symbols",
      emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔"],
    },
  }

 







// ✅ On mount, read token from localStorage
useEffect(() => {
  const token = localStorage.getItem('access_token');
  if (token) {
    console.log('Access token is ready:', token);
    setAccessToken(token);
  } else {
    console.log('Access token not yet available, waiting...');
    setIsLoading(true);
  }
}, []);

// ✅ Fetch group data
useEffect(() => {
  if (!currentUser || !group?.id) return;

  const fetchGroupData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const messagesRes = await axios.get(
        `https://127.0.0.1:8000/chats/groups/${group.id}/messages/`,
        { withCredentials: true }
      );
      setMessages(messagesRes.data.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
        message_type: msg.message_type.toLowerCase(),
        file: msg.file ? {
          name: msg.file.split('/').pop(),
          size: 'Unknown',
          url: msg.file,
          type: msg.message_type.toLowerCase(),
        } : null,
      })));

      const membersRes = await axios.get(
        `https://127.0.0.1:8000/chats/groups/${group.id}/members/`,
        { withCredentials: true }
      );
      setMembers(membersRes.data.map(m => ({
        ...m.user,
        role: m.role,
        joinDate: m.joined_at
      })));

      setUpcomingSessions([]);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load group data");
      console.error("Error fetching group data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchGroupData();
}, [currentUser, group?.id]);

// ✅ Connect WebSocket using token from state
useEffect(() => {
  if (!accessToken || !group?.id || !currentUser) return;

  const wsUrl = `wss://127.0.0.1:8000/chats/ws/chat/?access_token=${accessToken}`;
  console.log("Connecting WebSocket with:", wsUrl);
  const newSocket = new WebSocket(wsUrl);

  newSocket.onopen = () => {
    console.log("WebSocket connected");
    newSocket.send(JSON.stringify({
      type: "join_room",
      group_id: group.id
    }));
  };

  newSocket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === "message") {
      const msg = data.message;
      setMessages(prev => [...prev, {
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
        message_type: msg.message_type.toLowerCase(),
        file: msg.file ? {
          name: msg.file.split("/").pop(),
          size: "Unknown",
          url: msg.file,
          type: msg.message_type.toLowerCase(),
        } : null,
      }]);
    }
  };

  newSocket.onclose = () => {
    console.warn("WebSocket closed. Attempting to reconnect...");
    setTimeout(() => {
      const token = localStorage.getItem("access_token");
      if (token) setAccessToken(token);
    }, 3000);
  };

  newSocket.onerror = (err) => {
    console.error("WebSocket error:", err);
    setError("WebSocket connection failed.");
  };

  setSocket(newSocket);

  return () => {
    if (newSocket) newSocket.close();
  };
}, [accessToken, group?.id, currentUser]);
















  

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || isSending || !socket || socket.readyState !== WebSocket.OPEN) return

    setIsSending(true)
    try {
      const messageData = {
        type: 'message',
        content: message.trim(),
        message_type: 'TEXT',
        group_id: group.id
      }
      socket.send(JSON.stringify(messageData))
      setMessage("")
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message")
    } finally {
      setIsSending(false)
    }
  }

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    const validTypes = {
      image: [".jpg", ".jpeg", ".png"],
      video: [".mp4"],
      file: [".pdf", ".csv", ".docx", ".txt"],
    }
    const maxSize = 100 * 1024 * 1024 // 100MB

    files.forEach(async (file) => {
      const ext = file.name.toLowerCase().split('.').pop()
      let fileType = "file"
      if (validTypes.image.includes(`.${ext}`)) fileType = "image"
      else if (validTypes.video.includes(`.${ext}`)) fileType = "video"
      else if (!validTypes.file.includes(`.${ext}`)) {
        alert(`Invalid file type: ${ext}`)
        return
      }

      if (file.size > maxSize) {
        alert(`File too large. Max size: ${maxSize / (1024 * 1024)}MB`)
        return
      }

      const fileId = Date.now() + Math.random()
      setUploadingFiles(prev => [...prev, { id: fileId, name: file.name, progress: 0 }])

      try {
        const csrfToken = getCookie('csrftoken')
        const formData = new FormData()
        formData.append('file', file)
        formData.append('message_type', fileType.toUpperCase())

        const response = await axios.post(
          `https://127.0.0.1:8000/chats/groups/${group.id}/messages/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-CSRFToken': csrfToken
            },
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              setUploadingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress } : f))
            }
          }
        )

        const messageData = {
          type: 'message',
          content: '',
          message_type: fileType.toUpperCase(),
          file_url: response.data.file,
          group_id: group.id
        }
        socket.send(JSON.stringify(messageData))
        setUploadingFiles(prev => prev.filter(f => f.id !== fileId))
      } catch (err) {
        console.error("File upload error:", err)
        setError(`Failed to upload ${file.name}`)
        setUploadingFiles(prev => prev.filter(f => f.id !== fileId))
      }
    })

    event.target.value = ""
    setShowFileUpload(false)
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      const csrfToken = getCookie('csrftoken')
      await axios.delete(
        `https://127.0.0.1:8000/chats/messages/${messageId}/delete/`,
        {
          headers: { 'X-CSRFToken': csrfToken },
          withCredentials: true
        }
      )
      setMessages(prev => prev.filter(msg => msg.id !== messageId))
    } catch (err) {
      console.error("Error deleting message:", err)
      setError("Failed to delete message")
    }
  }

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji)
    setRecentEmojis(prev => {
      const newRecent = [emoji, ...prev.filter(e => e !== emoji)].slice(0, 5)
      return newRecent
    })
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const formatSessionDate = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isOwner = group.owner?.id === currentUser?.chat_user_id
  const isAdmin = members.some(m => 
    m.id === currentUser?.chat_user_id && 
    (m.role === 'ADMIN' || m.role === 'OWNER')
  )

  if (isLoading) {
    return (
      <div className="group-detail-page">
        <div className="loading-spinner">
          <Loader2 className="animate-spin" size={32} />
          <p>Loading group data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="group-detail-page">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={onBack} className="back-btn">
            <ArrowLeft size={20} />
            Back to Groups
          </button>
        </div>
      </div>
    )
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
            <img 
              src={group.icon || "/placeholder.svg"} 
              alt={group.name}
              onError={(e) => { e.target.src = "/placeholder.svg" }}
            />
            {group.status === 'PRIVATE' && (
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
                {members.length} members
              </span>
              <span className="privacy-status">
                {group.status === 'PRIVATE' ? <Lock size={16} /> : <Globe size={16} />}
                {group.status === 'PRIVATE' ? "Private" : "Public"}
              </span>
            </div>
          </div>

          <div className="group-actions">
            <button className="video-call-btn">
              <Video size={16} />
              Start Call
            </button>
            <button className="audio-call-btn">
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
        <button 
          className={`tab-btn ${activeTab === "chat" ? "active" : ""}`} 
          onClick={() => setActiveTab("chat")}
        >
          <MessageSquare size={16} />
          Chat
        </button>
        <button
          className={`tab-btn ${activeTab === "members" ? "active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          <Users size={16} />
          Members ({members.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "sessions" ? "active" : ""}`}
          onClick={() => setActiveTab("sessions")}
        >
          <Calendar size={16} />
          Sessions ({upcomingSessions.length})
        </button>
      </div>

      <div className="group-detail-content">
        {activeTab === "chat" && (
          <div className="chat-tab">
            <div className="chat-messages" ref={chatMessagesRef}>
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`message ${msg.sender?.id === currentUser?.chat_user_id ? "own-message" : ""}`}
                >
                  {msg.sender?.id !== currentUser?.chat_user_id && (
                    <div className="message-avatar">
                      <img 
                        src="/placeholder.svg" 
                        alt={msg.sender?.chat_username}
                      />
                    </div>
                  )}
                  <div className="message-content">
                    {msg.sender?.id !== currentUser?.chat_user_id && (
                      <div className="message-header">
                        <span className="message-user">{msg.sender?.chat_username}</span>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                    )}
                    <div className="message-bubble">
                      {msg.message_type === 'text' && <p>{msg.content}</p>}
                      {msg.message_type === 'image' && (
                        <img src={msg.file.url} alt={msg.file.name} className="message-image" />
                      )}
                      {msg.message_type === 'video' && (
                        <video src={msg.file.url} className="message-video" controls />
                      )}
                      {msg.message_type === 'file' && (
                        <div className="message-file">
                          <FileText size={24} />
                          <a href={msg.file.url} download>{msg.file.name}</a>
                        </div>
                      )}
                      {msg.sender?.id === currentUser?.chat_user_id && (
                        <>
                          <span className="message-time">{formatTime(msg.timestamp)}</span>
                          <button onClick={() => handleDeleteMessage(msg.id)}>
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="chat-input"
                  disabled={isSending}
                />

                <button 
                  type="submit" 
                  className="send-btn" 
                  disabled={!message.trim() || isSending}
                >
                  {isSending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>

              {showFileUpload && (
                <div className="file-upload-options">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.mp4,.pdf,.csv,.docx,.txt"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="file-option"
                    onClick={() => {
                      fileInputRef.current.accept = ".jpg,.jpeg,.png"
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
                      fileInputRef.current.accept = ".mp4"
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
                      fileInputRef.current.accept = ".pdf,.csv,.docx,.txt"
                      fileInputRef.current.click()
                    }}
                  >
                    <FileText size={20} />
                    <span>Documents</span>
                  </button>
                </div>
              )}

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

                  <div className="emoji-section">
                    <div className="emoji-section-title">{emojiCategories[selectedEmojiCategory]?.name}</div>
                    <div className="emoji-grid">
                      {(emojiCategories[selectedEmojiCategory]?.emojis || []).filter(emoji => 
                        emojiSearchQuery ? emoji.includes(emojiSearchQuery) : true
                      ).map((emoji, index) => (
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
              {(isOwner || isAdmin) && (
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
                    <img 
                      src="/placeholder.svg" 
                      alt={member.chat_username}
                    />
                    <div className={`status-indicator ${member.is_online ? 'online' : 'offline'}`}></div>
                  </div>
                  <div className="member-info">
                    <div className="member-name">
                      {member.chat_username}
                      {member.role === "OWNER" && <Crown size={14} className="role-icon owner" />}
                      {member.role === "ADMIN" && <Settings size={14} className="role-icon admin" />}
                    </div>
                    <div className="member-details">
                      <span className="member-role">{member.role.toLowerCase()}</span>
                      <span className="join-date">
                        Joined {new Date(member.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {(isOwner || isAdmin) && member.id !== currentUser?.chat_user_id && (
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
              {(isOwner || isAdmin) && (
                <button className="schedule-btn">
                  <Calendar size={16} />
                  Schedule Session
                </button>
              )}
            </div>

            <div className="sessions-list">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
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
                ))
              ) : (
                <div className="no-sessions">
                  <p>No upcoming sessions scheduled.</p>
                  {(isOwner || isAdmin) && (
                    <button className="schedule-first-btn">
                      <Calendar size={16} />
                      Schedule First Session
                    </button>
                  )}
                </div>
              )}
            </div>
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
    </div>
  )
}

export default GroupDetail