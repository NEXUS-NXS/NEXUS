"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  UserPlus,
  Pause,
  Play,
  MoreVertical,
  MessageSquare,
} from "lucide-react"
import "./AudioCall.css"

const AudioCall = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Call state
  const [isConnected, setIsConnected] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState("Calling...")

  // Control states
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const [isOnHold, setIsOnHold] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showKeypad, setShowKeypad] = useState(false)
  const [showMore, setShowMore] = useState(false)

  // Participant info
  const participantName = searchParams.get("participant") || "Unknown User"
  const participantId = searchParams.get("id") || "1"

  useEffect(() => {
    // Simulate connection after 3 seconds
    const connectTimer = setTimeout(() => {
      setIsConnected(true)
      setConnectionStatus("Connected")
    }, 3000)

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
    }
  }, [isConnected])

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)
  }

  const toggleHold = () => {
    setIsOnHold(!isOnHold)
    if (!isOnHold) {
      setConnectionStatus("On Hold")
    } else {
      setConnectionStatus("Connected")
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const endCall = () => {
    navigate("/chats")
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const keypadNumbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ]

  const handleKeypadPress = (key) => {
    // Handle DTMF tone
    console.log(`Pressed: ${key}`)
  }

  return (
    <div className="aud-audio-call-container">
      {/* Call Header */}
      <div className="aud-audio-call-header">
        <div className="aud-call-status-info">
          <span className="aud-status-text">{connectionStatus}</span>
          {isConnected && <span className="aud-call-timer">{formatDuration(callDuration)}</span>}
        </div>
      </div>

      {/* Participant Info */}
      <div className="aud-participant-section">
        <div className="aud-participant-avatar">
          <div className={`aud-avatar-ring ${isConnected ? "connected" : "connecting"}`}>
            <div className="aud-avatar-inner">
              <img src="/placeholder.svg?height=120&width=120" alt={participantName} className="participant-image" />
            </div>
          </div>
          {isRecording && (
            <div className="aud-recording-indicator">
              <div className="aud-recording-dot"></div>
              <span>Recording</span>
            </div>
          )}
        </div>

        <div className="aud-participant-details">
          <h2 className="aud-participant-name">{participantName}</h2>
          <p className="aud-participant-status">
            {isOnHold ? "Call on hold" : isConnected ? "Connected" : "Connecting..."}
          </p>
        </div>
      </div>

      {/* Call Controls */}
      <div className="aud-audio-call-controls">
        <div className="aud-primary-controls">
          <button
            className={`aud-control-btn ${isMuted ? "active" : ""}`}
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <button className="aud-end-call-btn" onClick={endCall} title="End call">
            <PhoneOff size={28} />
          </button>

          <button
            className={`aud-control-btn ${isSpeakerOn ? "active" : ""}`}
            onClick={toggleSpeaker}
            title={isSpeakerOn ? "Turn off speaker" : "Turn on speaker"}
          >
            {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>

        <div className="aud-secondary-controls">
          <button
            className={`aud-secondary-btn ${isOnHold ? "active" : ""}`}
            onClick={toggleHold}
            title={isOnHold ? "Resume call" : "Hold call"}
          >
            {isOnHold ? <Play size={20} /> : <Pause size={20} />}
            <span>{isOnHold ? "Resume" : "Hold"}</span>
          </button>

          <button className="aud-secondary-btn" onClick={() => setShowKeypad(!showKeypad)} title="Show keypad">
            <div className="aud-keypad-icon">123</div>
            <span>Keypad</span>
          </button>

          <button className="aud-secondary-btn" title="Add participant">
            <UserPlus size={20} />
            <span>Add</span>
          </button>

          <button
            className={`aud-secondary-btn ${isRecording ? "active recording" : ""}`}
            onClick={toggleRecording}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            <div className="aud-record-icon"></div>
            <span>{isRecording ? "Stop" : "Record"}</span>
          </button>

          <button className="aud-secondary-btn" onClick={() => setShowMore(!showMore)} title="More options">
            <MoreVertical size={20} />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Keypad */}
      {showKeypad && (
        <div className="aud-keypad-overlay">
          <div className="aud-keypad-container">
            <div className="aud-keypad-header">
              <h3>Keypad</h3>
              <button onClick={() => setShowKeypad(false)}>×</button>
            </div>
            <div className="aud-keypad-grid">
              {keypadNumbers.map((row, rowIndex) => (
                <div key={rowIndex} className="aud-keypad-row">
                  {row.map((number) => (
                    <button key={number} className="aud-keypad-btn" onClick={() => handleKeypadPress(number)}>
                      {number}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* More Options */}
      {showMore && (
        <div className="aud-more-options-overlay">
          <div className="aud-more-options-container">
            <div className="aud-more-options-header">
              <h3>More Options</h3>
              <button onClick={() => setShowMore(false)}>×</button>
            </div>
            <div className="aud-more-options-list">
              <button className="aud-option-btn">
                <MessageSquare size={20} />
                <span>Send Message</span>
              </button>
              <button className="aud-option-btn">
                <Phone size={20} />
                <span>Transfer Call</span>
              </button>
              <button className="aud-option-btn">
                <Volume2 size={20} />
                <span>Audio Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AudioCall
