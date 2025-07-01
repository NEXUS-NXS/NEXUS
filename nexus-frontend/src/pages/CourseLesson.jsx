"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play, Pause, SkipForward, SkipBack, CheckCircle, ChevronDown, ChevronRight,
  ChevronLeft, Menu, X, BookOpen, PlayCircle, FileText, Clock, Users, Star,
  Volume2, Maximize, Settings,
} from "lucide-react";
import "./CourseLesson.css";
import { useUser } from "../context/UserContext";
import axios from "axios";

const CourseLesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, fetchCsrfToken, refreshToken } = useUser();
  const [courseData, setCourseData] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState([]);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [isInstructorPreview, setIsInstructorPreview] = useState(false);
  const playerRef = useRef(null);

  const getAccessToken = () => localStorage.getItem("access_token");

  const getYouTubeEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v") || url.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    } catch (e) {
      console.error("Invalid YouTube URL:", url, e);
      return null;
    }
  };

  // Load YouTube Iframe API script
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    return () => {
      delete window.onYouTubeIframeAPIReady;
    };
  }, []);

  // Initialize YouTube Player when activeLesson changes
  useEffect(() => {
    if (activeLesson?.type !== "video" || !activeLesson?.video_url || !window.YT) {
      return;
    }

    let videoId;
    try {
      videoId = new URL(activeLesson.video_url).searchParams.get("v") || activeLesson.video_url.split("/").pop();
    } catch (e) {
      console.error("Invalid YouTube URL:", activeLesson.video_url, e);
      setError("Invalid YouTube video URL.");
      return;
    }

    playerRef.current = new window.YT.Player("youtube-player", {
      height: "100%",
      width: "100%",
      videoId,
      playerVars: {
        enablejsapi: 1,
        controls: 1,
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (event) => {
          console.log("YouTube Player Ready:", videoId);
          setVideoDuration(event.target.getDuration());
        },
        onStateChange: (event) => {
          console.log("YouTube Player State:", event.data);
          if (event.data === window.YT.PlayerState.PLAYING) {
            setVideoPlaying(true);
            const interval = setInterval(() => {
              const currentTime = event.target.getCurrentTime();
              setVideoCurrentTime(currentTime);
              setVideoProgress((currentTime / event.target.getDuration()) * 100);
            }, 1000);
            playerRef.current.interval = interval;
          } else {
            setVideoPlaying(false);
            clearInterval(playerRef.current.interval);
          }
        },
        onError: (event) => {
          console.error("YouTube Player Error:", event.data);
          setError(`Failed to load YouTube video. Error code: ${event.data}`);
        },
      },
    });

    return () => {
      if (playerRef.current) {
        if (playerRef.current.interval) {
          clearInterval(playerRef.current.interval);
        }
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [activeLesson]);

  const calculateOverallProgress = () => {
    if (!courseData || !courseData.modules) return 0;
    const allLessons = courseData.modules.flatMap((module) => module.lessons);
    if (allLessons.length === 0) return 0;
    const completedLessons = allLessons.filter((lesson) => lesson.is_completed).length;
    return ((completedLessons / allLessons.length) * 100).toFixed(1);
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const accessToken = getAccessToken();
        const csrfToken = await fetchCsrfToken();
        if (!accessToken || !isAuthenticated) {
          setError("Please log in to view course content.");
          navigate("/login");
          return;
        }

        const courseResponse = await axios.get(`https://127.0.0.1:8000/courses/api/courses/${courseId}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        });

        const modulesResponse = await axios.get(`https://127.0.0.1:8000/courses/api/modules/?course_id=${courseId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        });

        const modulesData = Array.isArray(modulesResponse.data.results) ? modulesResponse.data.results : modulesResponse.data;

        const modulesWithLessons = await Promise.all(
          modulesData.map(async (module) => {
            const lessonsResponse = await axios.get(`https://127.0.0.1:8000/courses/api/lessons/?module_id=${module.id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-CSRFToken": csrfToken,
              },
              withCredentials: true,
            });

            const progressResponse = await axios.get(`https://127.0.0.1:8000/courses/api/progress/?lesson__module=${module.id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-CSRFToken": csrfToken,
              },
              withCredentials: true,
            });

            const lessonsData = Array.isArray(lessonsResponse.data.results) ? lessonsResponse.data.results : lessonsResponse.data;
            const progressData = Array.isArray(progressResponse.data.results) ? progressResponse.data.results : progressResponse.data;

            const lessons = lessonsData.map((lesson) => {
              const progress = progressData.find((p) => p.lesson === lesson.id);
              return {
                ...lesson,
                is_completed: progress ? progress.is_completed : false,
                learningObjectives: lesson.learning_objectives || [],
                keypoints: (lesson.keypoints || []).map((kp) => ({
                  ...kp,
                  bullets: kp.bullets || [],
                })),
                code_examples: lesson.code_examples || [],
                questions: lesson.questions || [],
              };
            });

            return { ...module, lessons };
          })
        );

        const course = {
          ...courseResponse.data,
          modules: modulesWithLessons,
        };
        setCourseData(course);

        const isPreview = !lessonId;
        setIsInstructorPreview(isPreview);

        let lessonData;
        if (isPreview) {
          const allLessons = modulesWithLessons.flatMap((module) => module.lessons);
          if (allLessons.length === 0) {
            setError("No lessons available for this course.");
            navigate(`/course/${courseId}`);
            return;
          }
          lessonData = allLessons[0];
          navigate(`/course/${courseId}/lesson/${lessonData.id}`, { replace: true });
        } else {
          const lessonResponse = await axios.get(`https://127.0.0.1:8000/courses/api/lessons/${lessonId}/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-CSRFToken": csrfToken,
            },
            withCredentials: true,
          });
          const progressResponse = await axios.get(`https://127.0.0.1:8000/courses/api/progress/?lesson=${lessonId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-CSRFToken": csrfToken,
            },
            withCredentials: true,
          });
          const progressData = Array.isArray(progressResponse.data.results) ? progressResponse.data.results[0] : progressResponse.data;
          lessonData = {
            ...lessonResponse.data,
            is_completed: progressData ? progressData.is_completed : false,
          };
        }

        if (lessonData) {
          console.log("Active Lesson Video URL:", lessonData.video_url);
          const normalizedLesson = {
            ...lessonData,
            learningObjectives: lessonData.learning_objectives || [],
            keypoints: (lessonData.keypoints || []).map((kp) => ({
              ...kp,
              bullets: kp.bullets || [],
            })),
            code_examples: lessonData.code_examples || [],
            questions: lessonData.questions || [],
          };
          setActiveLesson(normalizedLesson);
        } else {
          setError("Lesson not found.");
          navigate(`/course/${courseId}`);
        }

        setExpandedModules(modulesWithLessons.map((m) => m.id));
      } catch (err) {
        console.error("Fetch error:", err.response?.status, err.response?.data);
        if (err.response?.status === 401) {
          const refreshed = await refreshToken();
          if (refreshed) fetchCourseData();
          else {
            setError("Authentication failed. Please log in again.");
            navigate("/login");
          }
        } else if (err.response?.status === 404) {
          setError("Lesson or course not found.");
          navigate(`/course/${courseId}`);
        } else {
          setError(err.response?.data?.detail || "Failed to fetch course data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, lessonId, isAuthenticated, refreshToken, navigate]);

  const toggleModuleExpansion = (moduleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const selectLesson = async (lesson) => {
    setActiveLesson(lesson);
    setVideoCurrentTime(0);
    setVideoProgress(0);
    setVideoPlaying(false);
    setQuizAnswers({});
    navigate(`/course/${courseId}/lesson/${lesson.id}`);
  };

  const navigateToNextLesson = () => {
    const allLessons = courseData?.modules.flatMap((module) => module.lessons) || [];
    const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex < allLessons.length - 1) {
      selectLesson(allLessons[currentIndex + 1]);
    }
  };

  const navigateToPreviousLesson = () => {
    const allLessons = courseData?.modules.flatMap((module) => module.lessons) || [];
    const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex > 0) {
      selectLesson(allLessons[currentIndex - 1]);
    }
  };

  const markLessonComplete = async () => {
    if (isInstructorPreview) {
      alert("Lesson previewed successfully!");
      return;
    }
    try {
      const accessToken = getAccessToken();
      const csrfToken = await fetchCsrfToken();
      await axios.post(
        "https://127.0.0.1:8000/courses/api/progress/",
        {
          lesson: activeLesson.id,
          is_completed: true,
          video_progress: videoProgress,
          video_current_time: videoCurrentTime,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setActiveLesson({ ...activeLesson, is_completed: true });
      setCourseData((prev) => ({
        ...prev,
        modules: prev.modules.map((module) => ({
          ...module,
          lessons: module.lessons.map((l) =>
            l.id === activeLesson.id ? { ...l, is_completed: true } : l
          ),
        })),
      }));
      alert("Lesson marked as complete!");
    } catch (err) {
      console.error("Mark complete error:", err.response?.status, err.response?.data);
      if (err.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) markLessonComplete();
        else setError("Authentication failed. Please log in again.");
      } else {
        setError(err.response?.data?.detail || "Failed to mark lesson complete.");
      }
    }
  };

  const submitQuiz = async () => {
    if (isInstructorPreview) {
      alert("Quiz previewed successfully!");
      return;
    }
    if (Object.keys(quizAnswers).length !== activeLesson.questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    try {
      const accessToken = getAccessToken();
      const csrfToken = await fetchCsrfToken();
      const response = await axios.post(
        "https://127.0.0.1:8000/courses/api/quiz-submissions/",
        {
          lesson: activeLesson.id,
          answers: quizAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      alert(`Quiz submitted successfully! Score: ${response.data.score}%`);
      markLessonComplete();
    } catch (err) {
      console.error("Quiz submission error:", err.response?.status, err.response?.data);
      if (err.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) submitQuiz();
        else setError("Authentication failed. Please log in again.");
      } else {
        setError(err.response?.data?.detail || "Failed to submit quiz.");
      }
    }
  };

  const handleQuizAnswer = (questionId, optionIndex) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleVideoPlayPause = () => {
    if (playerRef.current) {
      if (videoPlaying) {
        console.log("Pausing video");
        playerRef.current.pauseVideo();
      } else {
        console.log("Playing video");
        playerRef.current.playVideo();
      }
      setVideoPlaying(!videoPlaying);
    } else {
      console.error("Player not initialized");
      setError("YouTube player not initialized. Please try again.");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="lesson-loading-container">
        <div className="lesson-loading-spinner"></div>
        <p>Loading course content...</p>
      </div>
    );
  }

  if (error || !courseData || !activeLesson) {
    return (
      <div className="lesson-loading-container">
        <p>{error || "Failed to load course content."}</p>
      </div>
    );
  }

  return (
    <div className="lesson-page-container">
      <div className={`lesson-navigation-sidebar ${navigationOpen ? "expanded" : "collapsed"}`}>
        <div className="navigation-header">
          <button className="back-to-hub-btn" onClick={() => navigate("/learninghub")}>
            <ChevronLeft size={18} />
            <span>Learning Hub</span>
          </button>
          <button className="navigation-toggle-btn" onClick={() => setNavigationOpen(!navigationOpen)}>
            {navigationOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {navigationOpen && (
          <>
            <div className="course-overview-section">
              <h2 className="course-main-title">{courseData.title}</h2>
              <div className="course-instructor-info">
                <span className="instructor-name">by {courseData.instructor.user}</span>
              </div>

              <div className="course-statistics">
                <div className="stat-item">
                  <Star size={14} fill="currentColor" />
                  <span>{courseData.rating.toFixed(1)}</span>
                </div>
                <div className="stat-item">
                  <Users size={14} />
                  <span>{courseData.enrolled_students.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <Clock size={14} />
                  <span>{courseData.estimated_duration}</span>
                </div>
              </div>

              <div className="overall-progress-section">
                <div className="progress-info">
                  <span className="progress-label">Course Progress</span>
                  <span className="progress-percentage">{calculateOverallProgress()}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${calculateOverallProgress()}%` }}></div>
                </div>
              </div>
            </div>

            <div className="modules-navigation-section">
              {courseData.modules.map((module) => (
                <div key={module.id} className="module-navigation-item">
                  <button className="module-header-btn" onClick={() => toggleModuleExpansion(module.id)}>
                    <div className="module-title-section">
                      {expandedModules.includes(module.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <span className="module-title-text">{module.title}</span>
                    </div>
                    <div className="module-progress-indicator">
                      <span className="module-progress-text">{module.progress}%</span>
                      {module.is_completed && <CheckCircle size={16} className="completed-icon" />}
                    </div>
                  </button>

                  {expandedModules.includes(module.id) && (
                    <div className="lessons-navigation-list">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          className={`lesson-navigation-item ${
                            activeLesson.id === lesson.id ? "active" : ""
                          } ${lesson.is_completed ? "completed" : ""}`}
                          onClick={() => selectLesson(lesson)}
                        >
                          <div className="lesson-status-icon">
                            {lesson.is_completed ? (
                              <CheckCircle size={16} />
                            ) : lesson.type === "quiz" ? (
                              <FileText size={16} />
                            ) : (
                              <PlayCircle size={16} />
                            )}
                          </div>
                          <div className="lesson-details">
                            <span className="lesson-title-text">{lesson.title}</span>
                            <span className="lesson-duration-text">{lesson.duration}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="main-learning-content">
        <div className="lesson-header-section">
          <div className="lesson-breadcrumb">
            <span className="breadcrumb-item">
              {courseData.modules.find((m) => m.lessons.some((l) => l.id === activeLesson.id))?.title}
            </span>
            <ChevronRight size={14} />
            <span className="breadcrumb-current">{activeLesson.title}</span>
          </div>

          <h1 className="lesson-main-title">{activeLesson.title}</h1>

          <div className="lesson-navigation-controls">
            <button className="lesson-nav-btn previous" onClick={navigateToPreviousLesson}>
              <SkipBack size={18} />
              <span>Previous</span>
            </button>
            <button className="lesson-nav-btn next" onClick={navigateToNextLesson}>
              <span>Next</span>
              <SkipForward size={18} />
            </button>
          </div>
        </div>

        {activeLesson.type === "video" ? (
          <div className="video-learning-section">
            <div className="video-player-container">
              <div className="video-player-wrapper">
                {activeLesson.video_url ? (
                  <div id="youtube-player" className="youtube-iframe"></div>
                ) : (
                  <p className="error">Invalid YouTube video URL</p>
                )}
                <div className="video-controls-bar">
                  <button className="video-control-btn" onClick={handleVideoPlayPause}>
                    {videoPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>

                  <div className="video-progress-container">
                    <div className="video-progress-bar">
                      <div className="video-progress-fill" style={{ width: `${videoProgress}%` }}></div>
                    </div>
                    <span className="video-time-display">
                      {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                    </span>
                  </div>

                  <div className="video-additional-controls">
                    <button className="video-control-btn">
                      <Volume2 size={16} />
                    </button>
                    <button className="video-control-btn">
                      <Settings size={16} />
                    </button>
                    <button className="video-control-btn">
                      <Maximize size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lesson-notes-container">
              <div className="notes-header">
                <BookOpen size={20} />
                <h2>Lesson Notes</h2>
              </div>

              <div className="notes-content">
                {activeLesson.overview && (
                  <div className="notes-section">
                    <h3 className="notes-section-title">Overview</h3>
                    <p className="notes-paragraph">{activeLesson.overview}</p>
                  </div>
                )}

                {activeLesson.learning_objectives?.length > 0 && (
                  <div className="notes-section">
                    <h3 className="notes-section-title">Learning Objectives</h3>
                    <ul className="notes-objectives-list">
                      {activeLesson.learning_objectives.map((objective, index) => (
                        <li key={index} className="notes-objective-item">
                          {objective.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeLesson.keypoints?.length > 0 && (
                  <div className="notes-section">
                    <h3 className="notes-section-title">Key Points</h3>
                    {activeLesson.keypoints.map((point, index) => (
                      <div key={index} className="notes-key-point">
                        <h4 className="notes-point-title">{point.title}</h4>
                        <p className="notes-point-content">{point.content}</p>
                        {point.bullets?.length > 0 && (
                          <ul className="notes-bullet-list">
                            {point.bullets.map((bullet, bulletIndex) => (
                              <li key={bulletIndex} className="notes-bullet-item">
                                {bullet.text}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeLesson.code_examples?.length > 0 && (
                  <div className="notes-section">
                    <h3 className="notes-section-title">Code Example</h3>
                    {activeLesson.code_examples.map((example, index) => (
                      <div key={index} className="notes-code-block">
                        <h4 className="code-block-title">{example.title}</h4>
                        <pre className="code-block-content">
                          <code>{example.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {activeLesson.summary && (
                  <div className="notes-section">
                    <h3 className="notes-section-title">Summary</h3>
                    <div className="notes-summary-box">
                      <p className="notes-summary-text">{activeLesson.summary}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="quiz-learning-section">
            <div className="quiz-container">
              <div className="quiz-header">
                <h2 className="quiz-title">Assessment: {activeLesson.title}</h2>
                <p className="quiz-description">Test your understanding of the concepts covered in this module.</p>
              </div>

              <div className="quiz-questions-container">
                {activeLesson.questions?.map((question, index) => (
                  <div key={question.id} className="quiz-question-item">
                    <h3 className="question-text">
                      Question {index + 1}: {question.question}
                    </h3>
                    <div className="question-options">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="option-label">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={optionIndex}
                            className="option-input"
                            checked={quizAnswers[question.id] === optionIndex}
                            onChange={() => handleQuizAnswer(question.id, optionIndex)}
                          />
                          <span className="option-text">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="quiz-actions">
                <button
                  className="submit-quiz-button"
                  onClick={submitQuiz}
                  disabled={Object.keys(quizAnswers).length !== activeLesson.questions.length}
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="lesson-completion-section">
          <button
            className="complete-lesson-button"
            onClick={markLessonComplete}
            disabled={activeLesson.is_completed}
          >
            <CheckCircle size={18} />
            <span>{activeLesson.is_completed ? "Lesson Completed" : "Mark as Complete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseLesson;