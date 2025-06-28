"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  Settings,
  MessageSquare,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
} from "lucide-react"
import "./VideoCall.css"

const VideoCall = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  // Call state
  const [isConnected, setIsConnected] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState("Connecting...")

  // Control states
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)

  // Chat state
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([])

  // Participant info
  const participantName = searchParams.get("participant") || "Unknown User"
  const participantId = searchParams.get("id") || "1"

  useEffect(() => {
    // Initialize video call
    initializeCall()

    // Simulate connection after 2 seconds
    const connectTimer = setTimeout(() => {
      setIsConnected(true)
      setConnectionStatus("Connected")
    }, 2000)

    // Start call timer when connected
    let durationTimer
    if (isConnected) {
      durationTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      clearTimeout(connectTimer)
      if (durationTimer) clearInterval(durationTimer)
      cleanupCall()
    }
  }, [isConnected])

  const initializeCall = async () => {
    try {
      // Get user media (camera and microphone)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Simulate remote video stream
      setTimeout(() => {
        if (remoteVideoRef.current) {
          // In a real app, this would be the remote stream
          remoteVideoRef.current.src = "/placeholder.svg?height=400&width=600"
        }
      }, 1000)
    } catch (error) {
      console.error("Error accessing media devices:", error)
      setConnectionStatus("Failed to access camera/microphone")
    }
  }

  const cleanupCall = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = localVideoRef.current.srcObject.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = isMuted
      })
    }
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTracks = localVideoRef.current.srcObject.getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = !isVideoOn
      })
    }
  }

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream
        }
        setIsScreenSharing(true)
      } else {
        // Switch back to camera
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = cameraStream
        }
        setIsScreenSharing(false)
      }
    } catch (error) {
      console.error("Error sharing screen:", error)
    }
  }

  const endCall = () => {
    cleanupCall()
    navigate("/chats")
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const sendChatMessage = (e) => {
    e.preventDefault()
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: "You",
        message: chatMessage.trim(),
        timestamp: new Date().toLocaleTimeString(),
      }
      setChatMessages([...chatMessages, newMessage])
      setChatMessage("")
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className={`vid-video-call-container ${isFullScreen ? "fullscreen" : ""}`}>
      {/* Call Header */}
      <div className="vid-video-call-header">
        <div className="vid-call-info">
          <div className="vid-participant-info">
            <h2>{participantName}</h2>
            <span className="vid-call-status">{connectionStatus}</span>
          </div>
          <div className="vid-call-duration">{isConnected && formatDuration(callDuration)}</div>
        </div>

        <div className="vid-call-header-actions">
          <button className="vid-header-action-btn" onClick={() => setShowChat(!showChat)} title="Toggle Chat">
            <MessageSquare size={20} />
          </button>
          <button className="vid-header-action-btn" onClick={toggleFullScreen} title="Toggle Fullscreen">
            {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
          <button className="vid-header-action-btn" onClick={() => setShowSettings(!showSettings)} title="Settings">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div className="vid-video-area">
        {/* Remote Video */}
        <div className="vid-remote-video-container">
          <video ref={remoteVideoRef} className="vid-remote-video" autoPlay playsInline />
          <div className="vid-remote-video-overlay">
            <div className="vid-participant-name">{participantName}</div>
            {!isConnected && (
              <div className="vid-connection-status">
                <div className="vid-loading-spinner"></div>
                <span>Connecting...</span>
              </div>
            )}
          </div>
        </div>

        {/* Local Video */}
        <div className="vid-local-video-container">
          <video ref={localVideoRef} className="vid-local-video" autoPlay playsInline muted />
          <div className="vid-local-video-overlay">
            <span>You</span>
            {!isVideoOn && (
              <div className="vid-video-off-indicator">
                <VideoOff size={24} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className="vid-video-call-controls">
        <div className="vid-control-group">
          <button
            className={`vid-control-btn ${isMuted ? "active" : ""}`}
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <button
            className={`vid-control-btn ${!isVideoOn ? "active" : ""}`}
            onClick={toggleVideo}
            title={isVideoOn ? "Turn off camera" : "Turn on camera"}
          >
            {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>

          <button
            className={`vid-control-btn ${isScreenSharing ? "active" : ""}`}
            onClick={toggleScreenShare}
            title={isScreenSharing ? "Stop sharing" : "Share screen"}
          >
            <Monitor size={24} />
          </button>

          <button
            className={`vid-control-btn ${!isSpeakerOn ? "active" : ""}`}
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            title={isSpeakerOn ? "Mute speaker" : "Unmute speaker"}
          >
            {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>

        <button className="vid-end-call-btn" onClick={endCall} title="End call">
          <PhoneOff size={24} />
        </button>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="vid-chat-sidebar">
          <div className="vid-chat-header">
            <h3>Chat</h3>
            <button onClick={() => setShowChat(false)}>×</button>
          </div>

          <div className="vid-chat-messages">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="vid-chat-message">
                <div className="vid-message-sender">{msg.sender}</div>
                <div className="vid-message-content">{msg.message}</div>
                <div className="vid-message-time">{msg.timestamp}</div>
              </div>
            ))}
          </div>

          <form className="vid-chat-input-form" onSubmit={sendChatMessage}>
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type a message..."
              className="vid-chat-input"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="vid-settings-panel">
          <div className="vid-settings-header">
            <h3>Call Settings</h3>
            <button onClick={() => setShowSettings(false)}>×</button>
          </div>

          <div className="vid-settings-content">
            <div className="vid-setting-group">
              <label>Video Quality</label>
              <select>
                <option>Auto</option>
                <option>High (720p)</option>
                <option>Medium (480p)</option>
                <option>Low (360p)</option>
              </select>
            </div>

            <div className="vid-setting-group">
              <label>Audio Quality</label>
              <select>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="vid-setting-group">
              <label>Camera</label>
              <select>
                <option>Default Camera</option>
                <option>Front Camera</option>
                <option>Back Camera</option>
              </select>
            </div>

            <div className="vid-setting-group">
              <label>Microphone</label>
              <select>
                <option>Default Microphone</option>
                <option>Built-in Microphone</option>
                <option>External Microphone</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoCall
