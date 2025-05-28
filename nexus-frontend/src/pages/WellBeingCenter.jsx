"use client"

import { useState } from "react"
import { Play, Pause, SkipForward, SkipBack, Volume2, Calendar, Video, Music, MessageCircle } from "lucide-react"
import "./WellBeingCenter.css"

const WellBeingCenter = () => {
  const [mood, setMood] = useState("")
  const [showMoodInput, setShowMoodInput] = useState(true)
  const [recommendations, setRecommendations] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)

  const moodOptions = ["Stressed", "Anxious", "Tired", "Overwhelmed", "Motivated", "Focused", "Relaxed", "Distracted"]

  const relaxationTracks = [
    { id: 1, title: "Deep Focus", duration: "45:00", type: "music" },
    { id: 2, title: "Meditation for Anxiety", duration: "15:30", type: "guided" },
    { id: 3, title: "Nature Sounds", duration: "60:00", type: "ambient" },
    { id: 4, title: "Study with Me", duration: "120:00", type: "video" },
    { id: 5, title: "Power Nap", duration: "20:00", type: "guided" },
  ]

  const counselors = [
    { id: 1, name: "Dr. Sarah Johnson", specialty: "Academic Stress", availability: "Mon, Wed, Fri" },
    { id: 2, name: "Dr. Michael Chen", specialty: "Anxiety Management", availability: "Tue, Thu" },
    { id: 3, name: "Dr. Emily Rodriguez", specialty: "Work-Life Balance", availability: "Mon, Tue, Thu" },
  ]

  const handleMoodSubmit = () => {
    setShowMoodInput(false)

    // Simulate AI recommendation based on mood
    let recommendedContent = []
    let recommendedCounselors = []

    if (["Stressed", "Anxious", "Overwhelmed"].includes(mood)) {
      recommendedContent = relaxationTracks.filter((track) => ["guided", "ambient"].includes(track.type))
      recommendedCounselors = counselors.filter((counselor) =>
        ["Anxiety Management", "Academic Stress"].includes(counselor.specialty),
      )
    } else if (["Tired", "Distracted"].includes(mood)) {
      recommendedContent = relaxationTracks.filter((track) => ["music", "ambient"].includes(track.type))
      recommendedCounselors = counselors.filter((counselor) => counselor.specialty === "Work-Life Balance")
    } else {
      recommendedContent = relaxationTracks.filter((track) => ["music", "video"].includes(track.type))
    }

    setRecommendations({
      content: recommendedContent,
      counselors: recommendedCounselors,
    })
  }

  const playTrack = (track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const resetMood = () => {
    setMood("")
    setShowMoodInput(true)
    setRecommendations([])
    setCurrentTrack(null)
    setIsPlaying(false)
  }

  const scheduleCounseling = (counselor) => {
    // In a real app, this would open a scheduling interface
    alert(`Scheduling session with ${counselor.name}`)
  }

  return (
    <div className="wellbeing-center">
      <div className="wellbeing-header">
        <h1>Well-Being Center</h1>
        <p>Take care of your mental health while pursuing your academic goals</p>
      </div>

      {showMoodInput ? (
        <div className="mood-input-section">
          <div className="mood-prompt">
            <h2>How are you feeling today?</h2>
            <p>Select your current mood to get personalized recommendations</p>
          </div>

          <div className="mood-options">
            {moodOptions.map((option) => (
              <button
                key={option}
                className={`mood-option ${mood === option ? "selected" : ""}`}
                onClick={() => setMood(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <button className="submit-mood-btn" disabled={!mood} onClick={handleMoodSubmit}>
            Get Recommendations
          </button>
        </div>
      ) : (
        <div className="recommendations-section">
          <div className="current-mood">
            <h2>
              Based on your mood: <span>{mood}</span>
            </h2>
            <button className="change-mood-btn" onClick={resetMood}>
              Change
            </button>
          </div>

          {currentTrack ? (
            <div className="media-player">
              <div className="track-info">
                <h3>{currentTrack.title}</h3>
                <p>
                  {currentTrack.type === "music"
                    ? "Music"
                    : currentTrack.type === "guided"
                      ? "Guided Meditation"
                      : currentTrack.type === "video"
                        ? "Video"
                        : "Ambient Sounds"}
                </p>
              </div>

              <div className="player-controls">
                <button className="control-btn">
                  <SkipBack size={24} />
                </button>
                <button className="play-pause-btn" onClick={togglePlayPause}>
                  {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </button>
                <button className="control-btn">
                  <SkipForward size={24} />
                </button>
              </div>

              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "35%" }}></div>
                </div>
                <div className="time-display">
                  <span>15:45</span>
                  <span>{currentTrack.duration}</span>
                </div>
              </div>

              <div className="volume-control">
                <Volume2 size={20} />
                <input type="range" min="0" max="100" defaultValue="80" />
              </div>
            </div>
          ) : (
            <>
              <div className="content-recommendations">
                <h3>Recommended Content</h3>
                <div className="content-cards">
                  {recommendations.content &&
                    recommendations.content.map((content) => (
                      <div key={content.id} className="content-card">
                        <div className="content-icon">
                          {content.type === "music" ? (
                            <Music size={24} />
                          ) : content.type === "video" ? (
                            <Video size={24} />
                          ) : (
                            <MessageCircle size={24} />
                          )}
                        </div>
                        <div className="content-info">
                          <h4>{content.title}</h4>
                          <p>{content.duration}</p>
                        </div>
                        <button className="play-content-btn" onClick={() => playTrack(content)}>
                          <Play size={16} />
                          Play
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {recommendations.counselors && recommendations.counselors.length > 0 && (
                <div className="counselor-recommendations">
                  <h3>Recommended Counselors</h3>
                  <div className="counselor-cards">
                    {recommendations.counselors.map((counselor) => (
                      <div key={counselor.id} className="counselor-card">
                        <div className="counselor-info">
                          <h4>{counselor.name}</h4>
                          <p>Specialty: {counselor.specialty}</p>
                          <p>Available: {counselor.availability}</p>
                        </div>
                        <button className="schedule-btn" onClick={() => scheduleCounseling(counselor)}>
                          <Calendar size={16} />
                          Schedule Session
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default WellBeingCenter
