import axios from "axios"
const api = axios.create({ baseURL: "https://127.0.0.1:8000" })
import ReactMarkdown from 'react-markdown' 

"use client"

import { useState, useRef, useEffect } from "react"
import {
  MessageSquare,
  Send,
  Smile,
  BarChart2,
  Calendar,
  Clock,
  Award,
  BookOpen,
  Brain,
  Activity,
  Moon,
  Heart,
  Zap,
  Play,
  Volume2,
  ChevronRight,
  ChevronDown,
  User,
  Bot,
  X,
  Plus,
  Download,
  Share2,
  ExternalLink,
} from "lucide-react"
import "./WellBeingCenter.css"

const WellBeingCenter = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("chat")

  // State for chat
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      content: "Hello! I'm Nexus AI, your personal well-being assistant. How are you feeling today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  // State for mood tracking
  const [todayMood, setTodayMood] = useState(null)
  const [moodHistory, setMoodHistory] = useState([
    { date: "2023-06-01", mood: "happy", score: 85, notes: "Productive study day" },
    { date: "2023-06-02", mood: "neutral", score: 70, notes: "Average day" },
    { date: "2023-06-03", mood: "stressed", score: 45, notes: "Exam preparation" },
    { date: "2023-06-04", mood: "tired", score: 60, notes: "Late night studying" },
    { date: "2023-06-05", mood: "motivated", score: 90, notes: "Completed assignment" },
    { date: "2023-06-06", mood: "anxious", score: 40, notes: "Upcoming deadline" },
    { date: "2023-06-07", mood: "happy", score: 80, notes: "Good study progress" },
  ])

  // State for wellness score
  const [wellnessScore, setWellnessScore] = useState(72)

  // State for meditation
  const [isMeditating, setIsMeditating] = useState(false)
  const [meditationTime, setMeditationTime] = useState(300) // 5 minutes in seconds
  const [remainingTime, setRemainingTime] = useState(meditationTime)
  const [meditationInterval, setMeditationInterval] = useState(null)

  // State for recommendations
  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      type: "meditation",
      title: "Stress Relief Meditation",
      duration: "5 min",
      description: "AI-generated meditation focused on exam stress relief",
      tags: ["stress", "exams", "beginner"],
    },
    {
      id: 2,
      type: "exercise",
      title: "Desk Stretching Routine",
      duration: "3 min",
      description: "Quick stretches to do between study sessions",
      tags: ["physical", "quick", "energy"],
    },
    {
      id: 3,
      type: "reading",
      title: "Mindfulness for Actuaries",
      duration: "10 min",
      description: "How mindfulness can improve actuarial thinking",
      tags: ["mindfulness", "career", "focus"],
    },
    {
      id: 4,
      type: "breathing",
      title: "4-7-8 Breathing Technique",
      duration: "2 min",
      description: "Calming breathing exercise for anxiety reduction",
      tags: ["anxiety", "quick", "beginner"],
    },
  ])

  // State for goals
  const [goals, setGoals] = useState([
    { id: 1, title: "Meditate for 5 minutes daily", progress: 60, target: 100 },
    { id: 2, title: "Track mood every day this week", progress: 70, target: 100 },
    { id: 3, title: "Complete 3 breathing exercises", progress: 33, target: 100 },
    { id: 4, title: "Maintain study-break balance", progress: 45, target: 100 },
  ])

  // Mood options
  const moodOptions = [
    { id: "happy", emoji: "😊", label: "Happy", color: "#4ade80" },
    { id: "motivated", emoji: "🔥", label: "Motivated", color: "#f97316" },
    { id: "neutral", emoji: "😐", label: "Neutral", color: "#a3a3a3" },
    { id: "tired", emoji: "😴", label: "Tired", color: "#8b5cf6" },
    { id: "stressed", emoji: "😰", label: "Stressed", color: "#fb923c" },
    { id: "anxious", emoji: "😟", label: "Anxious", color: "#fb7185" },
    { id: "sad", emoji: "😔", label: "Sad", color: "#60a5fa" },
    { id: "overwhelmed", emoji: "🤯", label: "Overwhelmed", color: "#f43f5e" },
  ]

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return
  
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }
  
    setMessages([...messages, userMessage])
    setInputMessage("")
    setIsTyping(true)
  
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(inputMessage) // Await here
      const aiMessage = {
        id: messages.length + 2,
        sender: "ai",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      }
  
      setMessages((prevMessages) => [...prevMessages, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  // Generate AI response based on user input
  const generateAIResponse = async (userInput) => {
    try {
      const response = await api.post("/api/mental_health/chat/gemini/", { message: userInput });
  
      if (response.status === 200 && response.data?.response) {
        return response.data.response;
      } else {
        console.warn("Gemini responded with non-200 status:", response.status);
        throw new Error("Non-200 response from Gemini");
      }
  
    } catch (error) {
      console.error("Gemini failed, using OpenAI fallback:", error);
  
      try {
        const fallbackResponse = await api.post("/api/mental_health/chat_openai/", { message: userInput });
        if (fallbackResponse.status === 200 && fallbackResponse.data?.response) {
          console.info("OpenAI fallback succeeded.");
          return fallbackResponse.data.response;
        } else {
          console.warn("OpenAI responded with non-200 status:", fallbackResponse.status);
          throw new Error("Non-200 response from OpenAI");
        }
      } catch (fallbackError) {
        console.error("OpenAI fallback also failed:", fallbackError);
  
        // Final manual fallback response based on keywords
        const input = userInput.toLowerCase();
        if (input.includes("stress") || input.includes("stressed") || input.includes("anxiety") || input.includes("anxious")) {
          return "I understand you're feeling stressed. Stress is common among actuarial students. I recommend trying the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds. Would you like me to guide you through a quick breathing exercise?";
        }
        if (input.includes("tired") || input.includes("exhausted") || input.includes("sleep")) {
          return "Feeling tired is normal during intense study periods. Consider taking a 20-minute power nap, which can boost alertness without causing sleep inertia. Also, make sure you're getting 7-8 hours of sleep each night. Would you like me to suggest a relaxation technique to help you sleep better?";
        }
        if (input.includes("exam") || input.includes("test") || input.includes("study")) {
          return "Actuarial exams can be challenging. I recommend the Pomodoro technique: study for 25 minutes, then take a 5-minute break. This helps maintain focus and prevent burnout. Would you like me to create a personalized study schedule for you?";
        }
        if (input.includes("meditation") || input.includes("meditate") || input.includes("relax")) {
          return "Meditation is excellent for mental clarity and stress reduction. I can guide you through a quick 5-minute meditation focused on clearing your mind and reducing exam anxiety. Would you like to try it now?";
        }
        if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
          return "Hello! I'm your AI well-being assistant. I'm here to help you manage stress, improve your study habits, and maintain mental wellness throughout your actuarial journey. How can I assist you today?";
        }
  
        return "Thank you for sharing. As your AI well-being assistant, I'm here to support your mental health journey. Would you like some personalized recommendations based on your current state? I can suggest meditation exercises, study techniques, or stress management strategies specifically designed for actuarial students.";
      }
    }
  };
  

  // Handle mood selection
  const handleMoodSelection = (mood) => {
    setTodayMood(mood)

    // Add to chat
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      content: `I'm feeling ${mood.label} today ${mood.emoji}`,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, userMessage])

    // Simulate AI typing
    setIsTyping(true)

    // Generate AI response based on mood
    setTimeout(() => {
      let aiResponse = ""

      switch (mood.id) {
        case "happy":
        case "motivated":
          aiResponse = `That's great to hear you're feeling ${mood.label}! It's important to maintain this positive energy. Would you like me to suggest some focused study techniques to make the most of your current motivation?`
          break
        case "neutral":
          aiResponse = `Feeling neutral is perfectly fine. This can actually be a good state for balanced decision-making and study. Would you like some techniques to boost your engagement with today's material?`
          break
        case "tired":
          aiResponse = `I understand you're feeling tired. This is common among actuarial students. Would you like me to suggest a quick energizing exercise or perhaps a strategic power nap technique?`
          break
        case "stressed":
        case "anxious":
        case "overwhelmed":
          aiResponse = `I'm sorry to hear you're feeling ${mood.label}. Actuarial studies can certainly be demanding. Let's work on reducing these feelings - would you prefer a quick breathing exercise or a guided meditation?`
          break
        case "sad":
          aiResponse = `I'm here for you during these moments. Feeling sad is a natural part of life, even during your studies. Would you like to talk about what's causing these feelings, or would you prefer some gentle mood-lifting activities?`
          break
        default:
          aiResponse = `Thank you for sharing how you're feeling. I'm here to support you. Would you like some personalized recommendations for your current mood?`
      }

      const aiMessage = {
        id: messages.length + 2,
        sender: "ai",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      }

      setMessages((prevMessages) => [...prevMessages, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  // Start meditation
  const startMeditation = () => {
    setIsMeditating(true)
    setRemainingTime(meditationTime)

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsMeditating(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    setMeditationInterval(interval)
  }

  // Stop meditation
  const stopMeditation = () => {
    clearInterval(meditationInterval)
    setIsMeditating(false)
  }

  // Format time for meditation
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="nexus-wellbeing-container">
      <div className="nexus-wellbeing-header">
        <div className="nexus-wellbeing-title">
          <h1>Nexus AI Well-Being Center</h1>
          <p>Your AI-powered mental wellness companion for actuarial success</p>
        </div>
        <div className="nexus-wellbeing-score">
          <div
            className="nexus-wellbeing-score-circle"
            style={{
              background: `conic-gradient(#4ade80 ${wellnessScore}%, #1f2937 0)`,
            }}
          >
            <div className="nexus-wellbeing-score-inner">
              <span className="nexus-wellbeing-score-value">{wellnessScore}</span>
              <span className="nexus-wellbeing-score-label">Wellness Score</span>
            </div>
          </div>
        </div>
      </div>

      <div className="nexus-wellbeing-tabs">
        <button
          className={`nexus-wellbeing-tab ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          <MessageSquare size={18} />
          <span>AI Assistant</span>
        </button>
        <button
          className={`nexus-wellbeing-tab ${activeTab === "mood" ? "active" : ""}`}
          onClick={() => setActiveTab("mood")}
        >
          <Smile size={18} />
          <span>Mood Tracking</span>
        </button>
        <button
          className={`nexus-wellbeing-tab ${activeTab === "meditation" ? "active" : ""}`}
          onClick={() => setActiveTab("meditation")}
        >
          <Moon size={18} />
          <span>Meditation</span>
        </button>
        <button
          className={`nexus-wellbeing-tab ${activeTab === "progress" ? "active" : ""}`}
          onClick={() => setActiveTab("progress")}
        >
          <BarChart2 size={18} />
          <span>Progress</span>
        </button>
        <button
          className={`nexus-wellbeing-tab ${activeTab === "resources" ? "active" : ""}`}
          onClick={() => setActiveTab("resources")}
        >
          <BookOpen size={18} />
          <span>Resources</span>
        </button>
      </div>

      <div className="nexus-wellbeing-content">
        {/* AI Chat Assistant */}
        {activeTab === "chat" && (
          <div className="nexus-wellbeing-chat">
            <div className="nexus-wellbeing-chat-container">
              <div className="nexus-wellbeing-chat-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`nexus-wellbeing-message ${message.sender === "ai" ? "ai" : "user"}`}
                  >
                    <div className="nexus-wellbeing-message-avatar">
                      {message.sender === "ai" ? <Bot size={20} /> : <User size={20} />}
                    </div>
                    <div className="nexus-wellbeing-message-content">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                      <span className="nexus-wellbeing-message-time">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="nexus-wellbeing-message ai">
                    <div className="nexus-wellbeing-message-avatar">
                      <Bot size={20} />
                    </div>
                    <div className="nexus-wellbeing-message-content">
                      <div className="nexus-wellbeing-typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="nexus-wellbeing-chat-input">
                <div className="nexus-wellbeing-mood-selector">
                  {moodOptions.slice(0, 4).map((mood) => (
                    <button
                      key={mood.id}
                      className="nexus-wellbeing-mood-btn"
                      onClick={() => handleMoodSelection(mood)}
                      title={mood.label}
                    >
                      {mood.emoji}
                    </button>
                  ))}
                  <button className="nexus-wellbeing-mood-more">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="nexus-wellbeing-input-container">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message here..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    className="nexus-wellbeing-send-btn"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="nexus-wellbeing-chat-sidebar">
              <div className="nexus-wellbeing-sidebar-section">
                <h3>Suggested Topics</h3>
                <div className="nexus-wellbeing-suggested-topics">
                  <button onClick={() => setInputMessage("I'm feeling stressed about my upcoming exam")}>
                    Exam stress
                  </button>
                  <button onClick={() => setInputMessage("How can I improve my study focus?")}>Improve focus</button>
                  <button onClick={() => setInputMessage("I need help with work-life balance")}>
                    Work-life balance
                  </button>
                  <button onClick={() => setInputMessage("Recommend a quick relaxation technique")}>
                    Quick relaxation
                  </button>
                </div>
              </div>

              <div className="nexus-wellbeing-sidebar-section">
                <h3>AI Capabilities</h3>
                <ul className="nexus-wellbeing-capabilities">
                  <li>
                    <Brain size={16} />
                    <span>Personalized wellness advice</span>
                  </li>
                  <li>
                    <Calendar size={16} />
                    <span>Study schedule optimization</span>
                  </li>
                  <li>
                    <Activity size={16} />
                    <span>Stress management techniques</span>
                  </li>
                  <li>
                    <Moon size={16} />
                    <span>Guided meditation sessions</span>
                  </li>
                  <li>
                    <Zap size={16} />
                    <span>Energy and focus boosting</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Mood Tracking */}
        {activeTab === "mood" && (
          <div className="nexus-wellbeing-mood">
            <div className="nexus-wellbeing-mood-today">
              <h2>How are you feeling today?</h2>
              <div className="nexus-wellbeing-mood-grid">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.id}
                    className={`nexus-wellbeing-mood-option ${todayMood?.id === mood.id ? "selected" : ""}`}
                    onClick={() => setTodayMood(mood)}
                    style={{
                      "--mood-color": mood.color,
                      borderColor: todayMood?.id === mood.id ? mood.color : "transparent",
                    }}
                  >
                    <span className="nexus-wellbeing-mood-emoji">{mood.emoji}</span>
                    <span className="nexus-wellbeing-mood-label">{mood.label}</span>
                  </button>
                ))}
              </div>

              {todayMood && (
                <div className="nexus-wellbeing-mood-notes">
                  <h3>Add notes (optional)</h3>
                  <textarea
                    placeholder="What's contributing to your mood today? (e.g., exam preparation, completed assignment)"
                    rows={3}
                  ></textarea>
                  <button className="nexus-wellbeing-save-btn">Save Today's Mood</button>
                </div>
              )}
            </div>

            <div className="nexus-wellbeing-mood-history">
              <div className="nexus-wellbeing-section-header">
                <h2>Your Mood History</h2>
                <div className="nexus-wellbeing-section-actions">
                  <button className="nexus-wellbeing-action-btn">
                    <Calendar size={16} />
                    <span>This Week</span>
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              <div className="nexus-wellbeing-mood-chart">
                <div className="nexus-wellbeing-chart-labels">
                  <span>Great</span>
                  <span>Good</span>
                  <span>Okay</span>
                  <span>Low</span>
                </div>
                <div className="nexus-wellbeing-chart-bars">
                  {moodHistory.map((day, index) => (
                    <div key={index} className="nexus-wellbeing-chart-bar-container">
                      <div
                        className="nexus-wellbeing-chart-bar"
                        style={{
                          height: `${day.score}%`,
                          backgroundColor: moodOptions.find((m) => m.id === day.mood)?.color || "#a3a3a3",
                        }}
                      >
                        <span className="nexus-wellbeing-chart-emoji">
                          {moodOptions.find((m) => m.id === day.mood)?.emoji}
                        </span>
                      </div>
                      <span className="nexus-wellbeing-chart-date">
                        {new Date(day.date).toLocaleDateString([], { weekday: "short" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="nexus-wellbeing-mood-insights">
                <h3>AI Insights</h3>
                <div className="nexus-wellbeing-insight-card">
                  <div className="nexus-wellbeing-insight-header">
                    <Brain size={18} />
                    <h4>Weekly Analysis</h4>
                  </div>
                  <p>
                    Your mood tends to dip on days with exam preparation. Consider scheduling short breaks and using
                    stress-reduction techniques on these days. Your mood is highest after completing assignments - try
                    to break large tasks into smaller milestones to experience this satisfaction more often.
                  </p>
                </div>

                <div className="nexus-wellbeing-insight-card">
                  <div className="nexus-wellbeing-insight-header">
                    <Zap size={18} />
                    <h4>Suggested Actions</h4>
                  </div>
                  <ul className="nexus-wellbeing-action-list">
                    <li>Schedule 5-minute breathing breaks during exam preparation</li>
                    <li>Try the "Stress Relief Meditation" before studying</li>
                    <li>Break your next assignment into daily milestones</li>
                    <li>Consider a 20-minute walk when feeling overwhelmed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meditation */}
        {activeTab === "meditation" && (
          <div className="nexus-wellbeing-meditation">
            <div className="nexus-wellbeing-meditation-main">
              {isMeditating ? (
                <div className="nexus-wellbeing-meditation-active">
                  <div className="nexus-wellbeing-meditation-timer">
                    <div className="nexus-wellbeing-timer-circle">
                      <div
                        className="nexus-wellbeing-timer-progress"
                        style={{
                          background: `conic-gradient(#4ade80 ${(1 - remainingTime / meditationTime) * 100}%, transparent 0)`,
                        }}
                      ></div>
                      <div className="nexus-wellbeing-timer-display">
                        <span>{formatTime(remainingTime)}</span>
                      </div>
                    </div>
                    <h2>Breathe deeply and clear your mind</h2>
                    <p>Focus on your breath and let go of exam stress</p>
                  </div>

                  <div className="nexus-wellbeing-meditation-controls">
                    <button className="nexus-wellbeing-control-btn" onClick={stopMeditation}>
                      <X size={20} />
                      <span>End Session</span>
                    </button>
                    <div className="nexus-wellbeing-volume-control">
                      <Volume2 size={18} />
                      <input type="range" min="0" max="100" defaultValue="70" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="nexus-wellbeing-meditation-selector">
                  <h2>AI-Generated Meditation Sessions</h2>
                  <p>Personalized for actuarial students to reduce stress and improve focus</p>

                  <div className="nexus-wellbeing-meditation-options">
                    <div className="nexus-wellbeing-meditation-card active">
                      <div className="nexus-wellbeing-meditation-card-content">
                        <h3>Exam Anxiety Relief</h3>
                        <div className="nexus-wellbeing-meditation-meta">
                          <span>
                            <Clock size={14} /> 5 minutes
                          </span>
                          <span>
                            <Moon size={14} /> Beginner
                          </span>
                        </div>
                        <p>
                          This AI-generated meditation helps calm your mind before exams, reducing anxiety and improving
                          recall.
                        </p>
                        <button className="nexus-wellbeing-start-btn" onClick={startMeditation}>
                          <Play size={16} />
                          <span>Begin Session</span>
                        </button>
                      </div>
                    </div>

                    <div className="nexus-wellbeing-meditation-card">
                      <div className="nexus-wellbeing-meditation-card-content">
                        <h3>Deep Focus Cultivation</h3>
                        <div className="nexus-wellbeing-meditation-meta">
                          <span>
                            <Clock size={14} /> 10 minutes
                          </span>
                          <span>
                            <Moon size={14} /> Intermediate
                          </span>
                        </div>
                        <p>
                          Enhance your concentration for complex actuarial problems with this focus-building meditation.
                        </p>
                        <button className="nexus-wellbeing-start-btn">
                          <Play size={16} />
                          <span>Begin Session</span>
                        </button>
                      </div>
                    </div>

                    <div className="nexus-wellbeing-meditation-card">
                      <div className="nexus-wellbeing-meditation-card-content">
                        <h3>Quick Stress Reset</h3>
                        <div className="nexus-wellbeing-meditation-meta">
                          <span>
                            <Clock size={14} /> 3 minutes
                          </span>
                          <span>
                            <Moon size={14} /> Beginner
                          </span>
                        </div>
                        <p>A rapid reset for moments of high stress during study sessions or before presentations.</p>
                        <button className="nexus-wellbeing-start-btn">
                          <Play size={16} />
                          <span>Begin Session</span>
                        </button>
                      </div>
                    </div>

                    <div className="nexus-wellbeing-meditation-card">
                      <div className="nexus-wellbeing-meditation-card-content">
                        <h3>Evening Wind Down</h3>
                        <div className="nexus-wellbeing-meditation-meta">
                          <span>
                            <Clock size={14} /> 15 minutes
                          </span>
                          <span>
                            <Moon size={14} /> All levels
                          </span>
                        </div>
                        <p>
                          Prepare your mind for restful sleep after intense study sessions with this calming practice.
                        </p>
                        <button className="nexus-wellbeing-start-btn">
                          <Play size={16} />
                          <span>Begin Session</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="nexus-wellbeing-meditation-customize">
                    <h3>Create Custom Meditation</h3>
                    <div className="nexus-wellbeing-customize-form">
                      <div className="nexus-wellbeing-form-group">
                        <label>Focus Area</label>
                        <select defaultValue="exam-anxiety">
                          <option value="exam-anxiety">Exam Anxiety</option>
                          <option value="focus">Focus & Concentration</option>
                          <option value="stress">General Stress</option>
                          <option value="sleep">Better Sleep</option>
                          <option value="confidence">Confidence Building</option>
                        </select>
                      </div>

                      <div className="nexus-wellbeing-form-group">
                        <label>Duration</label>
                        <select defaultValue="5">
                          <option value="3">3 minutes</option>
                          <option value="5">5 minutes</option>
                          <option value="10">10 minutes</option>
                          <option value="15">15 minutes</option>
                          <option value="20">20 minutes</option>
                        </select>
                      </div>

                      <div className="nexus-wellbeing-form-group">
                        <label>Background Sound</label>
                        <select defaultValue="rain">
                          <option value="none">None</option>
                          <option value="rain">Gentle Rain</option>
                          <option value="waves">Ocean Waves</option>
                          <option value="forest">Forest Ambience</option>
                          <option value="white-noise">White Noise</option>
                        </select>
                      </div>

                      <button className="nexus-wellbeing-generate-btn">
                        <Zap size={16} />
                        <span>Generate Custom Meditation</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="nexus-wellbeing-meditation-sidebar">
              <div className="nexus-wellbeing-sidebar-section">
                <h3>Meditation Stats</h3>
                <div className="nexus-wellbeing-stats">
                  <div className="nexus-wellbeing-stat">
                    <span className="nexus-wellbeing-stat-value">12</span>
                    <span className="nexus-wellbeing-stat-label">Sessions</span>
                  </div>
                  <div className="nexus-wellbeing-stat">
                    <span className="nexus-wellbeing-stat-value">86</span>
                    <span className="nexus-wellbeing-stat-label">Minutes</span>
                  </div>
                  <div className="nexus-wellbeing-stat">
                    <span className="nexus-wellbeing-stat-value">7</span>
                    <span className="nexus-wellbeing-stat-label">Day Streak</span>
                  </div>
                </div>
              </div>

              <div className="nexus-wellbeing-sidebar-section">
                <h3>Benefits for Actuaries</h3>
                <ul className="nexus-wellbeing-benefits">
                  <li>
                    <Brain size={16} />
                    <span>Improved mathematical reasoning</span>
                  </li>
                  <li>
                    <Zap size={16} />
                    <span>Enhanced focus during calculations</span>
                  </li>
                  <li>
                    <Heart size={16} />
                    <span>Reduced exam anxiety</span>
                  </li>
                  <li>
                    <Clock size={16} />
                    <span>Better time management</span>
                  </li>
                  <li>
                    <Award size={16} />
                    <span>Increased exam performance</span>
                  </li>
                </ul>
              </div>

              <div className="nexus-wellbeing-sidebar-section">
                <h3>Research Insight</h3>
                <div className="nexus-wellbeing-research">
                  <p>
                    A study of actuarial students found that those who meditated for just 5 minutes before study
                    sessions reported 31% better retention of complex formulas.
                  </p>
                  <a href="#" className="nexus-wellbeing-link">
                    <span>Read the research</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Tracking */}
        {activeTab === "progress" && (
          <div className="nexus-wellbeing-progress">
            <div className="nexus-wellbeing-progress-overview">
              <div className="nexus-wellbeing-section-header">
                <h2>Your Wellness Journey</h2>
                <div className="nexus-wellbeing-section-actions">
                  <button className="nexus-wellbeing-action-btn">
                    <Calendar size={16} />
                    <span>This Month</span>
                    <ChevronDown size={14} />
                  </button>
                  <button className="nexus-wellbeing-action-btn">
                    <Download size={16} />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="nexus-wellbeing-progress-chart">
                <div className="nexus-wellbeing-chart-placeholder">
                  <div className="nexus-wellbeing-line-chart">
                    <div
                      className="nexus-wellbeing-chart-line"
                      style={{
                        backgroundImage: "linear-gradient(to right, #4ade80, #3b82f6)",
                      }}
                    ></div>
                    <div className="nexus-wellbeing-chart-points">
                      <span style={{ bottom: "60%", left: "10%" }}></span>
                      <span style={{ bottom: "40%", left: "25%" }}></span>
                      <span style={{ bottom: "65%", left: "40%" }}></span>
                      <span style={{ bottom: "30%", left: "55%" }}></span>
                      <span style={{ bottom: "50%", left: "70%" }}></span>
                      <span style={{ bottom: "75%", left: "85%" }}></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="nexus-wellbeing-stats-grid">
                <div className="nexus-wellbeing-stat-card">
                  <div className="nexus-wellbeing-stat-icon">
                    <Moon size={20} />
                  </div>
                  <div className="nexus-wellbeing-stat-info">
                    <h3>Meditation</h3>
                    <span className="nexus-wellbeing-stat-value">86 min</span>
                    <span className="nexus-wellbeing-stat-change positive">+24% from last week</span>
                  </div>
                </div>

                <div className="nexus-wellbeing-stat-card">
                  <div className="nexus-wellbeing-stat-icon">
                    <Smile size={20} />
                  </div>
                  <div className="nexus-wellbeing-stat-info">
                    <h3>Mood Score</h3>
                    <span className="nexus-wellbeing-stat-value">7.4/10</span>
                    <span className="nexus-wellbeing-stat-change positive">+0.8 from last week</span>
                  </div>
                </div>

                <div className="nexus-wellbeing-stat-card">
                  <div className="nexus-wellbeing-stat-icon">
                    <MessageSquare size={20} />
                  </div>
                  <div className="nexus-wellbeing-stat-info">
                    <h3>AI Interactions</h3>
                    <span className="nexus-wellbeing-stat-value">24</span>
                    <span className="nexus-wellbeing-stat-change neutral">Same as last week</span>
                  </div>
                </div>

                <div className="nexus-wellbeing-stat-card">
                  <div className="nexus-wellbeing-stat-icon">
                    <Brain size={20} />
                  </div>
                  <div className="nexus-wellbeing-stat-info">
                    <h3>Focus Sessions</h3>
                    <span className="nexus-wellbeing-stat-value">8</span>
                    <span className="nexus-wellbeing-stat-change negative">-2 from last week</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="nexus-wellbeing-goals">
              <div className="nexus-wellbeing-section-header">
                <h2>Weekly Goals</h2>
                <button className="nexus-wellbeing-add-btn">
                  <Plus size={16} />
                  <span>Add Goal</span>
                </button>
              </div>

              <div className="nexus-wellbeing-goals-list">
                {goals.map((goal) => (
                  <div key={goal.id} className="nexus-wellbeing-goal-item">
                    <div className="nexus-wellbeing-goal-info">
                      <h3>{goal.title}</h3>
                      <div className="nexus-wellbeing-goal-progress">
                        <div className="nexus-wellbeing-progress-bar">
                          <div className="nexus-wellbeing-progress-fill" style={{ width: `${goal.progress}%` }}></div>
                        </div>
                        <span>{goal.progress}%</span>
                      </div>
                    </div>
                    <div className="nexus-wellbeing-goal-actions">
                      <button className="nexus-wellbeing-icon-btn">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="nexus-wellbeing-ai-suggestion">
                <div className="nexus-wellbeing-suggestion-header">
                  <Brain size={18} />
                  <h3>AI Suggested Goal</h3>
                </div>
                <p>
                  Based on your patterns, adding a 2-minute breathing exercise before each study session could improve
                  your focus and retention.
                </p>
                <button className="nexus-wellbeing-add-suggestion-btn">
                  <Plus size={14} />
                  <span>Add This Goal</span>
                </button>
              </div>
            </div>

            <div className="nexus-wellbeing-achievements">
              <div className="nexus-wellbeing-section-header">
                <h2>Achievements</h2>
                <button className="nexus-wellbeing-view-all-btn">
                  <span>View All</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="nexus-wellbeing-achievements-grid">
                <div className="nexus-wellbeing-achievement-card active">
                  <div className="nexus-wellbeing-achievement-icon">
                    <Award size={24} />
                  </div>
                  <h3>Consistency Master</h3>
                  <p>Completed 7 consecutive days of wellness check-ins</p>
                </div>

                <div className="nexus-wellbeing-achievement-card active">
                  <div className="nexus-wellbeing-achievement-icon">
                    <Moon size={24} />
                  </div>
                  <h3>Meditation Novice</h3>
                  <p>Completed 10 meditation sessions</p>
                </div>

                <div className="nexus-wellbeing-achievement-card">
                  <div className="nexus-wellbeing-achievement-icon locked">
                    <Brain size={24} />
                  </div>
                  <h3>Focus Expert</h3>
                  <p>Complete 20 focus sessions</p>
                </div>

                <div className="nexus-wellbeing-achievement-card">
                  <div className="nexus-wellbeing-achievement-icon locked">
                    <Heart size={24} />
                  </div>
                  <h3>Wellness Guru</h3>
                  <p>Maintain a wellness score above 80 for 14 days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resources */}
        {activeTab === "resources" && (
          <div className="nexus-wellbeing-resources">
            <div className="nexus-wellbeing-resources-grid">
              <div className="nexus-wellbeing-resource-card">
                <div className="nexus-wellbeing-resource-header">
                  <h3>AI-Generated Study Wellness Guide</h3>
                  <span className="nexus-wellbeing-resource-tag">Personalized</span>
                </div>
                <p>A comprehensive guide created by our AI specifically for your study patterns and wellness needs.</p>
                <div className="nexus-wellbeing-resource-meta">
                  <span>
                    <Clock size={14} /> 15 min read
                  </span>
                  <span>
                    <Calendar size={14} /> Updated today
                  </span>
                </div>
                <div className="nexus-wellbeing-resource-actions">
                  <button className="nexus-wellbeing-resource-btn">
                    <BookOpen size={16} />
                    <span>Read Guide</span>
                  </button>
                  <button className="nexus-wellbeing-icon-btn">
                    <Download size={16} />
                  </button>
                  <button className="nexus-wellbeing-icon-btn">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              <div className="nexus-wellbeing-resource-card">
                <div className="nexus-wellbeing-resource-header">
                  <h3>Actuarial Exam Anxiety Management</h3>
                  <span className="nexus-wellbeing-resource-tag">Popular</span>
                </div>
                <p>
                  Techniques specifically designed to manage the unique pressures of actuarial exams and certification.
                </p>
                <div className="nexus-wellbeing-resource-meta">
                  <span>
                    <Clock size={14} /> 12 min read
                  </span>
                  <span>
                    <Calendar size={14} /> Updated 3 days ago
                  </span>
                </div>
                <div className="nexus-wellbeing-resource-actions">
                  <button className="nexus-wellbeing-resource-btn">
                    <BookOpen size={16} />
                    <span>Read Guide</span>
                  </button>
                  <button className="nexus-wellbeing-icon-btn">
                    <Download size={16} />
                  </button>
                  <button className="nexus-wellbeing-icon-btn">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              <div className="nexus-wellbeing-resource-card">
                <div className="nexus-wellbeing-resource-header">
                  <h3>Mathematical Mindfulness</h3>
                  <span className="nexus-wellbeing-resource-tag">New</span>
                </div>
                <p>
                  How to apply mindfulness techniques specifically to enhance mathematical thinking and problem-solving.
                </p>
                <div className="nexus-wellbeing-resource-meta">
                  <span>
                    <Clock size={14} /> 8 min read
                  </span>
                  <span>
                    <Calendar size={14} /> Added yesterday
                  </span>
                </div>
                <div className="nexus-wellbeing-resource-actions">
                  <button className="nexus-wellbeing-resource-btn">
                    <BookOpen size={16} />
                    <span>Read Guide</span>
                  </button>
                  <button className="nexus-wellbeing-icon-btn">
                    <Download size={16} />
                  </button>
                  <button className="nexus-wellbeing-icon-btn">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              <div className="nexus-wellbeing-resource-card">
                <div className="nexus-wellbeing-resource-header">
                  <h3>Work-Life Balance for Actuaries</h3>
                </div>
                <p>Strategies for maintaining balance between rigorous actuarial studies and personal wellbeing.</p>
                <div className="nexus-wellbeing-resource-meta">
                  <span>
                    <Clock size={14} /> 10 min read
                  </span>
                  <span>
                    <Calendar size={14} /> Updated 1 week ago
                  </span>
                </div>
                <div className="nexus-wellbeing-resource-actions">
                  <button className="nexus-wellbeing-resource-btn">
                    <BookOpen size={16} />
                    <span>Read Guide</span>
                  </button>
                  <button className="nexus-wellbeing-icon-btn">
                    <Download size={16} />
                  </button>
                  <button className="nexus-wellbeing-icon-btn">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="nexus-wellbeing-quick-tools">
              <h2>Quick Wellness Tools</h2>
              <div className="nexus-wellbeing-tools-grid">
                <div className="nexus-wellbeing-tool-card">
                  <div className="nexus-wellbeing-tool-icon">
                    <Clock size={24} />
                  </div>
                  <h3>Pomodoro Timer</h3>
                  <p>Study with timed breaks to maintain focus and prevent burnout</p>
                  <button className="nexus-wellbeing-tool-btn">Launch Tool</button>
                </div>

                <div className="nexus-wellbeing-tool-card">
                  <div className="nexus-wellbeing-tool-icon">
                    <Activity size={24} />
                  </div>
                  <h3>Stress Checker</h3>
                  <p>Quick assessment of your current stress levels with personalized tips</p>
                  <button className="nexus-wellbeing-tool-btn">Launch Tool</button>
                </div>

                <div className="nexus-wellbeing-tool-card">
                  <div className="nexus-wellbeing-tool-icon">
                    <Moon size={24} />
                  </div>
                  <h3>Sleep Calculator</h3>
                  <p>Optimize your sleep schedule around study sessions and exams</p>
                  <button className="nexus-wellbeing-tool-btn">Launch Tool</button>
                </div>

                <div className="nexus-wellbeing-tool-card">
                  <div className="nexus-wellbeing-tool-icon">
                    <Brain size={24} />
                  </div>
                  <h3>Focus Booster</h3>
                  <p>Quick exercises to enhance concentration before difficult study sessions</p>
                  <button className="nexus-wellbeing-tool-btn">Launch Tool</button>
                </div>
              </div>
            </div>

            <div className="nexus-wellbeing-ai-insights">
              <div className="nexus-wellbeing-insight-header">
                <Brain size={20} />
                <h2>AI Wellness Insight</h2>
              </div>
              <div className="nexus-wellbeing-insight-content">
                <p>
                  Based on your study patterns and wellness data, our AI has identified that your focus tends to
                  decrease after 2 hours of continuous study. Consider implementing the Pomodoro technique with
                  25-minute focus sessions and 5-minute breaks to optimize your learning efficiency.
                </p>
                <div className="nexus-wellbeing-insight-actions">
                  <button className="nexus-wellbeing-insight-btn">
                    <Clock size={16} />
                    <span>Try Pomodoro Timer</span>
                  </button>
                  <button
                    className="nexus-wellbeing-insight-btn secondary"
                    onClick={() => setActiveTab("chat")} // Add this
                  >
                    <MessageSquare size={16} />
                    <span>Ask AI for Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WellBeingCenter
