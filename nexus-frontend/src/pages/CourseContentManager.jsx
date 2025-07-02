import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  ChevronDown,
  ChevronRight,
  X,
  Video,
  HelpCircle,
  BookOpen,
  Settings,
  Eye,
  Upload, // Added for Publish button
} from "lucide-react";
import "./CourseContentManager.css";
import { useUser } from "../context/UserContext";
import axios from "axios";

const CourseContentManager = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, fetchCsrfToken, refreshToken } = useUser();
  const [courseContent, setCourseContent] = useState(null);
  const [activeTab, setActiveTab] = useState("modules");
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showAddModule, setShowAddModule] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState([]);
  const [error, setError] = useState(null);

  // Form states
  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
  });

  const [lessonForm, setLessonForm] = useState({
    title: "",
    type: "video",
    duration: "",
    description: "",
    video_url: "",
    overview: "",
    summary: "",
    learning_objectives: [""],
    keypoints: [{ title: "", content: "", bullets: [""] }],
    code_examples: [{ title: "", code: "" }],
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correct_option: 0,
        explanation: "",
      },
    ],
  });

  const getAccessToken = () => localStorage.getItem("access_token");

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Please log in to manage course content.");
      navigate("/login");
      return;
    }

    const fetchCourseContent = async () => {
      try {
        const accessToken = getAccessToken();
        const response = await axios.get(`https://127.0.0.1:8000/courses/api/courses/${courseId}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const courseData = response.data;
        // Fetch modules for the course
        const modulesResponse = await axios.get(`https://127.0.0.1:8000/courses/api/modules/?course_id=${courseId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });

        console.log("Modules response data:", modulesResponse.data);
        // Extract results from paginated response, default to empty array if not present
        const modulesData = Array.isArray(modulesResponse.data.results) ? modulesResponse.data.results : [];

        const modules = await Promise.all(
          modulesData.map(async (module) => {
            // Fetch lessons for each module
            const lessonsResponse = await axios.get(`https://127.0.0.1:8000/courses/api/lessons/?module_id=${module.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
              withCredentials: true,
            });

            const lessons = await Promise.all(
              (Array.isArray(lessonsResponse.data.results) ? lessonsResponse.data.results : lessonsResponse.data).map(
                async (lesson) => {
                  const learningObjectives = lesson.learning_objectives || []; // Correct variable name
                  const keypoints = (lesson.keypoints || []).map((kp) => ({
                    ...kp,
                    bullets: kp.bullets || [],
                  }));
                  const code_examples = lesson.code_examples || [];
                  const questions = lesson.questions || [];
                  return {
                    ...lesson,
                    learningObjectives, // Use correct variable name
                    keypoints,
                    code_examples,
                    questions,
                  };
                }
              )
            );

            return { ...module, lessons };
          })
        );

        setCourseContent({ ...courseData, modules });
        if (modules.length > 0) {
          setExpandedModules([modules[0].id]);
        }
      } catch (err) {
        console.error("Failed to fetch course content:", err);
        if (err.response?.status === 401) {
          const refreshed = await refreshToken();
          if (refreshed) {
            fetchCourseContent();
          } else {
            setError("Authentication failed. Please log in again.");
            navigate("/login");
          }
        } else {
          setError("Failed to fetch course content: " + (err.response?.data?.detail || err.message));
        }
      }
    };

    fetchCourseContent();
  }, [courseId, isAuthenticated, navigate, refreshToken]);

  
  



  // publish the course
  const handlePublishCourse = async () => {
    if (!window.confirm("Are you sure you want to publish this course?")) return;

    try {
      const accessToken = getAccessToken();
      const csrfToken = await fetchCsrfToken();
      await axios.post(
        `https://127.0.0.1:8000/courses/api/courses/${courseId}/publish/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      alert("Course published successfully!");
      setCourseContent((prev) => ({ ...prev, status: "published" }));
      setError(null);
    } catch (err) {
      console.error("Failed to publish course:", err);
      if (err.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          handlePublishCourse();
        } else {
          setError("Authentication failed. Please log in again.");
          navigate("/login");
        }
      } else {
        setError(err.response?.data?.detail || "Failed to publish course: " + err.message);
      }
    }
  };

  
  
  // Module Management Functions
  const handleAddModule = async () => {
    if (!moduleForm.title.trim()) {
      setError("Module title is required.");
      return;
    }

    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        setError("No access token found. Please log in again.");
        navigate("/login");
        return;
      }

      const csrfToken = await fetchCsrfToken();
      if (!csrfToken) {
        setError("Failed to fetch CSRF token.");
        return;
      }

      const response = await axios.post(
        "https://127.0.0.1:8000/courses/api/modules/",
        {
          course: courseId,
          title: moduleForm.title,
          description: moduleForm.description,
          order: courseContent.modules.length,
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

      const newModule = response.data;
      setCourseContent((prev) => ({
        ...prev,
        modules: [...prev.modules, { ...newModule, lessons: [] }],
      }));

      setModuleForm({ title: "", description: "" });
      setShowAddModule(false);
      setExpandedModules((prev) => [...prev, newModule.id]);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Failed to add module:", err);
      if (err.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          handleAddModule();
        } else {
          setError("Authentication failed. Please log in again.");
          navigate("/login");
        }
      } else {
        setError(err.response?.data?.detail || "Failed to add module: " + err.message);
      }
    }
  };

  const handleEditModule = async (moduleId, updatedData) => {
    if (!updatedData.title.trim()) {
      setError("Module title is required.");
      return;
    }

    try {
      const accessToken = getAccessToken();
      const csrfToken = await fetchCsrfToken();
      await axios.patch(
        `https://127.0.0.1:8000/courses/api/modules/${moduleId}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setCourseContent((prev) => ({
        ...prev,
        modules: prev.modules.map((module) =>
          module.id === moduleId ? { ...module, ...updatedData } : module
        ),
      }));
      setEditingModule(null);
      setModuleForm({ title: "", description: "" });
      setError(null);
    } catch (err) {
      console.error("Failed to edit module:", err);
      if (err.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          handleEditModule(moduleId, updatedData);
        } else {
          setError("Authentication failed. Please log in again.");
          navigate("/login");
        }
      } else {
        setError(err.response?.data?.detail || "Failed to edit module: " + err.message);
      }
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;

    try {
      const accessToken = getAccessToken();
      const csrfToken = await fetchCsrfToken();
      await axios.delete(`https://127.0.0.1:8000/courses/api/modules/${moduleId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      });

      setCourseContent((prev) => ({
        ...prev,
        modules: prev.modules.filter((module) => module.id !== moduleId),
      }));
      setExpandedModules((prev) => prev.filter((id) => id !== moduleId));
      setError(null);
    } catch (err) {
      console.error("Failed to delete module:", err);
      if (err.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          handleDeleteModule(moduleId);
        } else {
          setError("Authentication failed. Please log in again.");
          navigate("/login");
        }
      } else {
        setError(err.response?.data?.detail || "Failed to delete module: " + err.message);
      }
    }
  };

  // Lesson Management Functions
  const handleAddLesson = async (moduleId) => {
    if (!lessonForm.title.trim()) {
      setError("Lesson title is required.");
      return;
    }

    // Validate duration format (MM:SS)
    const durationRegex = /^\d{2}:\d{2}$/;
    if (lessonForm.duration && !durationRegex.test(lessonForm.duration)) {
      setError("Duration must be in MM:SS format (e.g., 05:30)");
      return;
    }

    try {
      const accessToken = getAccessToken();
      const csrfToken = await fetchCsrfToken();
      const lessonData = {
        module: moduleId,
        title: lessonForm.title,
        type: lessonForm.type,
        duration: lessonForm.duration || "", // Use empty string if not provided
        description: lessonForm.description || "",
        video_url: lessonForm.type === "video" ? lessonForm.video_url || "" : "",
        overview: lessonForm.overview || "",
        summary: lessonForm.summary || "",
        learning_objectives: lessonForm.learning_objectives
          .filter((obj) => obj.trim())
          .map((obj) => ({ text: obj })),
        keypoints: lessonForm.keypoints
          .filter((kp) => kp.title.trim())
          .map((kp) => ({
            title: kp.title,
            content: kp.content || "",
            bullets: kp.bullets
              .filter((bullet) => bullet.trim())
              .map((bullet) => ({ text: bullet })),
          })),
        code_examples: lessonForm.code_examples
          .filter((ce) => ce.title.trim() && ce.code.trim())
          .map((ce) => ({ title: ce.title, code: ce.code })),
        questions: lessonForm.type === "quiz"
          ? lessonForm.questions
              .filter((q) => q.question.trim() && q.options.filter((opt) => opt.trim()).length >= 2)
              .map((q) => ({
                question: q.question,
                options: q.options.filter((opt) => opt.trim()),
                correct_option: Math.min(parseInt(q.correct_option, 10), q.options.filter((opt) => opt.trim()).length - 1),
                explanation: q.explanation || "",
              }))
          : [],
        order: courseContent.modules.find((m) => m.id === moduleId)?.lessons.length || 0,
      };

      console.log("Lesson payload:", JSON.stringify(lessonData, null, 2));

      const response = await axios.post(
        "https://127.0.0.1:8000/courses/api/lessons/",
        lessonData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const newLesson = response.data;
      setCourseContent((prev) => ({
        ...prev,
        modules: prev.modules.map((module) =>
          module.id === moduleId
            ? { ...module, lessons: [...module.lessons, newLesson] }
            : module
        ),
      }));

      // Reset form
      setLessonForm({
        title: "",
        type: "video",
        duration: "",
        description: "",
        video_url: "",
        overview: "",
        summary: "",
        learning_objectives: [""],
        keypoints: [{ title: "", content: "", bullets: [""] }],
        code_examples: [{ title: "", code: "" }],
        questions: [
          {
            question: "",
            options: ["", "", "", ""],
            correct_option: 0,
            explanation: "",
          },
        ],
      });
      setShowAddLesson(null);
      setError(null);
    } catch (err) {
      console.error("Failed to add lesson:", err);
      console.log("Error response data:", err.response?.data);
      if (err.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          handleAddLesson(moduleId);
        } else {
          setError("Authentication failed. Please log in again.");
          navigate("/login");
        }
      } else {
        setError(
          JSON.stringify(err.response?.data, null, 2) || "Failed to add lesson: " + err.message
        );
      }
    }
  };

  const handleEditLesson = async (moduleId, lessonId, updatedData) => {
    try {
      const accessToken = getAccessToken();
      const csrfToken = await fetchCsrfToken();
      const lessonData = {
        title: updatedData.title,
        type: updatedData.type,
        duration: updatedData.duration,
        description: updatedData.description,
        video_url: updatedData.video_url,
        overview: updatedData.overview,
        summary: updatedData.summary,
        learning_objectives: updatedData.learning_objectives
          .filter((obj) => obj.trim())
          .map((obj) => ({ text: obj })),
        keypoints: updatedData.keypoints
          .filter((kp) => kp.title.trim())
          .map((kp) => ({
            title: kp.title,
            content: kp.content,
            bullets: kp.bullets
              .filter((bullet) => bullet.trim())
              .map((bullet) => ({ text: bullet })),
          })),
        code_examples: updatedData.code_examples
          .filter((ce) => ce.title.trim() && ce.code.trim())
          .map((ce) => ({ title: ce.title, code: ce.code })),
        questions: updatedData.questions
          .filter((q) => q.question.trim())
          .map((q) => ({
            question: q.question,
            options: q.options,
            correct_option: q.correct_option,
            explanation: q.explanation,
          })),
      };

      await axios.patch(
        `https://127.0.0.1:8000/courses/api/lessons/${lessonId}/`,
        lessonData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setCourseContent((prev) => ({
        ...prev,
        modules: prev.modules.map((module) =>
          module.id === moduleId
            ? {
                ...module,
                lessons: module.lessons.map((lesson) =>
                  lesson.id === lessonId ? { ...lesson, ...lessonData } : lesson
                ),
              }
            : module
        ),
      }));
      setEditingLesson(null);
      setLessonForm({
        title: "",
        type: "video",
        duration: "",
        description: "",
        video_url: "",
        overview: "",
        summary: "",
        learning_objectives: [""],
        keypoints: [{ title: "", content: "", bullets: [""] }],
        code_examples: [{ title: "", code: "" }],
        questions: [
          {
            question: "",
            options: ["", "", "", ""],
            correct_option: 0,
            explanation: "",
          },
        ],
      });
      setError(null);
    } catch (err) {
      console.error("Failed to edit lesson:", err);
      if (err.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          handleEditLesson(moduleId, lessonId, updatedData);
        } else {
          setError("Authentication failed. Please log in again.");
          navigate("/login");
        }
      } else {
        setError(err.response?.data?.detail || "Failed to edit lesson: " + err.message);
      }
    }
  };

  const handleDeleteLesson = async (moduleId, lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      const accessToken = getAccessToken();
      const csrfToken = await fetchCsrfToken();
      await axios.delete(`https://127.0.0.1:8000/courses/api/lessons/${lessonId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      });

      setCourseContent((prev) => ({
        ...prev,
        modules: prev.modules.map((module) =>
          module.id === moduleId
            ? {
                ...module,
                lessons: module.lessons.filter((lesson) => lesson.id !== lessonId),
              }
            : module
        ),
      }));
      setError(null);
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      if (err.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          handleDeleteLesson(moduleId, lessonId);
        } else {
          setError("Authentication failed. Please log in again.");
          navigate("/login");
        }
      } else {
        setError(err.response?.data?.detail || "Failed to delete lesson: " + err.message);
      }
    }
  };

  // Content Form Helpers
  const addLearningObjective = () => {
    setLessonForm((prev) => ({
      ...prev,
      learning_objectives: [...prev.learning_objectives, ""],
    }));
  };

  const removeLearningObjective = (index) => {
    setLessonForm((prev) => ({
      ...prev,
      learning_objectives: prev.learning_objectives.filter((_, i) => i !== index),
    }));
  };

  const addKeyPoint = () => {
    setLessonForm((prev) => ({
      ...prev,
      keypoints: [
        ...prev.keypoints,
        { title: "", content: "", bullets: [""] },
      ],
    }));
  };

  const removeKeyPoint = (index) => {
    setLessonForm((prev) => ({
      ...prev,
      keypoints: prev.keypoints.filter((_, i) => i !== index),
    }));
  };

  const addBulletPoint = (keyPointIndex) => {
    setLessonForm((prev) => ({
      ...prev,
      keypoints: prev.keypoints.map((point, i) =>
        i === keyPointIndex ? { ...point, bullets: [...point.bullets, ""] } : point
      ),
    }));
  };

  const removeBulletPoint = (keyPointIndex, bulletIndex) => {
    setLessonForm((prev) => ({
      ...prev,
      keypoints: prev.keypoints.map((point, i) =>
        i === keyPointIndex
          ? { ...point, bullets: point.bullets.filter((_, j) => j !== bulletIndex) }
          : point
      ),
    }));
  };

  const addQuestion = () => {
    setLessonForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correct_option: 0,
          explanation: "",
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    setLessonForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const toggleModuleExpansion = (moduleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleSaveCourse = async () => {
    try {
      const accessToken = getAccessToken();
      const csrfToken = await fetchCsrfToken();
      await axios.patch(
        `https://127.0.0.1:8000/courses/api/courses/${courseId}/`,
        {
          title: courseContent.title,
          description: courseContent.description,
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
      alert("Course content saved successfully!");
      setError(null);
    } catch (err) {
      console.error("Failed to save course:", err);
      if (err.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          handleSaveCourse();
        } else {
          setError("Authentication failed. Please log in again.");
          navigate("/login");
        }
      } else {
        setError(err.response?.data?.detail || "Failed to save course: " + err.message);
      }
    }
  };

  const handlePreviewCourse = async () => {
    try {
      const accessToken = getAccessToken();
      await axios.get(`https://127.0.0.1:8000/courses/api/courses/${courseId}/preview/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      navigate(`/course/${courseId}/preview`);
      setError(null);
    } catch (err) {
      console.error("Failed to preview course:", err);
      if (err.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          handlePreviewCourse();
        } else {
          setError("Authentication failed. Please log in again.");
          navigate("/login");
        }
      } else {
        setError(err.response?.data?.detail || "Failed to preview course: " + err.message);
      }
    }
  };

  if (!courseContent) {
    return (
      <div className="content-manager-loading">
        <div className="loading-spinner"></div>
        <p>Loading course content manager...</p>
      </div>
    );
  }

  return (
    <div className="course-content-manager">
      {error && <div className="error">{error}</div>}
      <div className="manager-header">
        <div className="header-info">
          <h1 className="manager-title">Course Content Manager</h1>
          <p className="manager-subtitle">{courseContent.title}</p>
        </div>
        <div className="header-actions">
          <button className="action-btn preview" onClick={handlePreviewCourse}>
            <Eye size={18} />
            Preview Course
          </button>
          <button className="action-btn save" onClick={handleSaveCourse}>
            <Save size={18} />
            Save Course
          </button>
          <button className="action-btn publish" onClick={handlePublishCourse}>
            <Upload size={18} />
            Publish Course
          </button>
        </div>
        
      </div>

      <div className="manager-tabs">
        <button
          className={`tab-button ${activeTab === "modules" ? "active" : ""}`}
          onClick={() => setActiveTab("modules")}
        >
          <BookOpen size={18} />
          Modules & Lessons
        </button>
        <button
          className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings size={18} />
          Course Settings
        </button>
      </div>

      <div className="manager-content">
        {activeTab === "modules" && (
          <div className="modules-section">
            <div className="section-header">
              <h2>Course Modules</h2>
              <button className="add-btn" onClick={() => setShowAddModule(true)}>
                <Plus size={18} />
                Add Module
              </button>
            </div>

            {/* Add Module Form */}
            {showAddModule && (
              <div className="add-form-container">
                <div className="form-card">
                  <h3>Add New Module</h3>
                  <div className="form-group">
                    <label>Module Title</label>
                    <input
                      type="text"
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                      placeholder="Enter module title"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={moduleForm.description}
                      onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                      placeholder="Enter module description"
                      rows={3}
                    />
                  </div>
                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => setShowAddModule(false)}>
                      Cancel
                    </button>
                    <button className="btn-primary" onClick={handleAddModule}>
                      Add Module
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Module Form */}
            {editingModule && (
              <div className="add-form-container">
                <div className="form-card">
                  <h3>Edit Module</h3>
                  <div className="form-group">
                    <label>Module Title</label>
                    <input
                      type="text"
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                      placeholder="Enter module title"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={moduleForm.description}
                      onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                      placeholder="Enter module description"
                      rows={3}
                    />
                  </div>
                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => setEditingModule(null)}>
                      Cancel
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() =>
                        handleEditModule(editingModule, {
                          title: moduleForm.title,
                          description: moduleForm.description,
                        })
                      }
                    >
                      Save Module
                    </button>
                  </div>
                </div>
              </div>
            )}

            {courseContent.modules.length === 0 ? (
              <p>No modules available. Add a module to get started.</p>
            ) : (
              <div className="modules-list">
                {courseContent.modules.map((module) => (
                  <div key={module.id} className="module-card">
                    <div className="module-header">
                      <button
                        className="expand-btn"
                        onClick={() => toggleModuleExpansion(module.id)}
                      >
                        {expandedModules.includes(module.id) ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </button>
                      <div className="module-info">
                        <h3>{module.title}</h3>
                        <p>{module.description}</p>
                        <span className="lesson-count">{module.lessons.length} lessons</span>
                      </div>
                      <div className="module-actions">
                        <button
                          className="action-icon"
                          onClick={() => {
                            setEditingModule(module.id);
                            setModuleForm({
                              title: module.title,
                              description: module.description,
                            });
                          }}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="action-icon delete"
                          onClick={() => handleDeleteModule(module.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {expandedModules.includes(module.id) && (
                      <div className="module-content">
                        <div className="lessons-header">
                          <h4>Lessons</h4>
                          <button
                            className="add-lesson-btn"
                            onClick={() => setShowAddLesson(module.id)}
                          >
                            <Plus size={16} />
                            Add Lesson
                          </button>
                        </div>

                        {/* Add Lesson Form */}
                        {showAddLesson === module.id && (
                          <div className="lesson-form-container">
                            <div className="lesson-form">
                              <h4>Add New Lesson</h4>
                              {/* Basic Lesson Info */}
                              <div className="form-section">
                                <h5>Basic Information</h5>
                                <div className="form-row">
                                  <div className="form-group">
                                    <label>Lesson Title</label>
                                    <input
                                      type="text"
                                      value={lessonForm.title}
                                      onChange={(e) =>
                                        setLessonForm({ ...lessonForm, title: e.target.value })
                                      }
                                      placeholder="Enter lesson title"
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label>Type</label>
                                    <select
                                      value={lessonForm.type}
                                      onChange={(e) =>
                                        setLessonForm({ ...lessonForm, type: e.target.value })
                                      }
                                    >
                                      <option value="video">Video Lesson</option>
                                      <option value="quiz">Assessment/Quiz</option>
                                    </select>
                                  </div>
                                  <div className="form-group">
                                    <label>Duration</label>
                                    <input
                                      type="text"
                                      value={lessonForm.duration}
                                      onChange={(e) =>
                                        setLessonForm({ ...lessonForm, duration: e.target.value })
                                      }
                                      placeholder="e.g., 15:30"
                                    />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label>Description</label>
                                  <textarea
                                    value={lessonForm.description}
                                    onChange={(e) =>
                                      setLessonForm({
                                        ...lessonForm,
                                        description: e.target.value,
                                      })
                                    }
                                    placeholder="Enter lesson description"
                                    rows={2}
                                  />
                                </div>
                                {lessonForm.type === "video" && (
                                  <div className="form-group">
                                    <label>Video URL</label>
                                    <input
                                      type="text"
                                      value={lessonForm.video_url}
                                      onChange={(e) =>
                                        setLessonForm({ ...lessonForm, video_url: e.target.value })
                                      }
                                      placeholder="Enter video URL or upload path"
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Lesson Content */}
                              {lessonForm.type === "video" && (
                                <div className="form-section">
                                  <h5>Lesson Content</h5>
                                  <div className="form-group">
                                    <label>Overview</label>
                                    <textarea
                                      value={lessonForm.overview}
                                      onChange={(e) =>
                                        setLessonForm({
                                          ...lessonForm,
                                          overview: e.target.value,
                                        })
                                      }
                                      placeholder="Enter lesson overview"
                                      rows={3}
                                    />
                                  </div>

                                  {/* Learning Objectives */}
                                  <div className="form-group">
                                    <label>Learning Objectives</label>
                                    {lessonForm.learning_objectives.map((objective, index) => (
                                      <div key={index} className="objective-input">
                                        <input
                                          type="text"
                                          value={objective}
                                          onChange={(e) => {
                                            const newObjectives = [
                                              ...lessonForm.learning_objectives,
                                            ];
                                            newObjectives[index] = e.target.value;
                                            setLessonForm({
                                              ...lessonForm,
                                              learning_objectives: newObjectives,
                                            });
                                          }}
                                          placeholder="Enter learning objective"
                                        />
                                        <button
                                          type="button"
                                          className="remove-btn"
                                          onClick={() => removeLearningObjective(index)}
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      className="add-item-btn"
                                      onClick={addLearningObjective}
                                    >
                                      <Plus size={16} />
                                      Add Objective
                                    </button>
                                  </div>

                                  {/* Key Points */}
                                  <div className="form-group">
                                    <label>Key Points</label>
                                    {lessonForm.keypoints.map((point, pointIndex) => (
                                      <div key={pointIndex} className="key-point-section">
                                        <div className="key-point-header">
                                          <input
                                            type="text"
                                            value={point.title}
                                            onChange={(e) => {
                                              const newPoints = [...lessonForm.keypoints];
                                              newPoints[pointIndex].title = e.target.value;
                                              setLessonForm({
                                                ...lessonForm,
                                                keypoints: newPoints,
                                              });
                                            }}
                                            placeholder="Key point title"
                                          />
                                          <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeKeyPoint(pointIndex)}
                                          >
                                            <X size={16} />
                                          </button>
                                        </div>
                                        <textarea
                                          value={point.content}
                                          onChange={(e) => {
                                            const newPoints = [...lessonForm.keypoints];
                                            newPoints[pointIndex].content = e.target.value;
                                            setLessonForm({
                                              ...lessonForm,
                                              keypoints: newPoints,
                                            });
                                          }}
                                          placeholder="Key point content"
                                          rows={2}
                                        />
                                        <div className="bullets-section">
                                          <label>Bullet Points</label>
                                          {point.bullets.map((bullet, bulletIndex) => (
                                            <div key={bulletIndex} className="bullet-input">
                                              <input
                                                type="text"
                                                value={bullet}
                                                onChange={(e) => {
                                                  const newPoints = [...lessonForm.keypoints];
                                                  newPoints[pointIndex].bullets[bulletIndex] =
                                                    e.target.value;
                                                  setLessonForm({
                                                    ...lessonForm,
                                                    keypoints: newPoints,
                                                  });
                                                }}
                                                placeholder="Enter bullet point"
                                              />
                                              <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeBulletPoint(pointIndex, bulletIndex)}
                                              >
                                                <X size={16} />
                                              </button>
                                            </div>
                                          ))}
                                          <button
                                            type="button"
                                            className="add-item-btn small"
                                            onClick={() => addBulletPoint(pointIndex)}
                                          >
                                            <Plus size={14} />
                                            Add Bullet
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      className="add-item-btn"
                                      onClick={addKeyPoint}
                                    >
                                      <Plus size={16} />
                                      Add Key Point
                                    </button>
                                  </div>

                                  {/* Code Example */}
                                  <div className="form-group">
                                    <label>Code Example (Optional)</label>
                                    {lessonForm.code_examples.map((ce, index) => (
                                      <div key={index} className="code-example-section">
                                        <input
                                          type="text"
                                          value={ce.title}
                                          onChange={(e) => {
                                            const newCodeExamples = [...lessonForm.code_examples];
                                            newCodeExamples[index].title = e.target.value;
                                            setLessonForm({
                                              ...lessonForm,
                                              code_examples: newCodeExamples,
                                            });
                                          }}
                                          placeholder="Code example title"
                                        />
                                        <textarea
                                          value={ce.code}
                                          onChange={(e) => {
                                            const newCodeExamples = [...lessonForm.code_examples];
                                            newCodeExamples[index].code = e.target.value;
                                            setLessonForm({
                                              ...lessonForm,
                                              code_examples: newCodeExamples,
                                            });
                                          }}
                                          placeholder="Enter code example"
                                          rows={6}
                                          className="code-textarea"
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  {/* Summary */}
                                  <div className="form-group">
                                    <label>Summary</label>
                                    <textarea
                                      value={lessonForm.summary}
                                      onChange={(e) =>
                                        setLessonForm({
                                          ...lessonForm,
                                          summary: e.target.value,
                                        })
                                      }
                                      placeholder="Enter lesson summary"
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Quiz Questions */}
                              {lessonForm.type === "quiz" && (
                                <div className="form-section">
                                  <h5>Assessment Questions</h5>
                                  {lessonForm.questions.map((question, questionIndex) => (
                                    <div key={questionIndex} className="question-section">
                                      <div className="question-header">
                                        <h6>Question {questionIndex + 1}</h6>
                                        <button
                                          type="button"
                                          className="remove-btn"
                                          onClick={() => removeQuestion(questionIndex)}
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                      <div className="form-group">
                                        <label>Question Text</label>
                                        <textarea
                                          value={question.question}
                                          onChange={(e) => {
                                            const newQuestions = [...lessonForm.questions];
                                            newQuestions[questionIndex].question = e.target.value;
                                            setLessonForm({ ...lessonForm, questions: newQuestions });
                                          }}
                                          placeholder="Enter question text"
                                          rows={2}
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label>Answer Options</label>
                                        {question.options.map((option, optionIndex) => (
                                          <div key={optionIndex} className="option-input">
                                            <input
                                              type="radio"
                                              name={`correct-${questionIndex}`}
                                              checked={question.correct_option === optionIndex}
                                              onChange={() => {
                                                const newQuestions = [...lessonForm.questions];
                                                newQuestions[questionIndex].correct_option = optionIndex;
                                                setLessonForm({ ...lessonForm, questions: newQuestions });
                                              }}
                                            />
                                            <input
                                              type="text"
                                              value={option}
                                              onChange={(e) => {
                                                const newQuestions = [...lessonForm.questions];
                                                newQuestions[questionIndex].options[optionIndex] =
                                                  e.target.value;
                                                setLessonForm({ ...lessonForm, questions: newQuestions });
                                              }}
                                              placeholder={`Option ${optionIndex + 1}`}
                                            />
                                            <span className="correct-indicator">
                                              {question.correct_option === optionIndex ? "✓ Correct" : ""}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="form-group">
                                        <label>Explanation (Optional)</label>
                                        <textarea
                                          value={question.explanation}
                                          onChange={(e) => {
                                            const newQuestions = [...lessonForm.questions];
                                            newQuestions[questionIndex].explanation = e.target.value;
                                            setLessonForm({ ...lessonForm, questions: newQuestions });
                                          }}
                                          placeholder="Explain why this is the correct answer"
                                          rows={2}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    className="add-item-btn"
                                    onClick={addQuestion}
                                  >
                                    <Plus size={16} />
                                    Add Question
                                  </button>
                                </div>
                              )}

                              <div className="form-actions">
                                <button
                                  className="btn-secondary"
                                  onClick={() => setShowAddLesson(null)}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="btn-primary"
                                  onClick={() => handleAddLesson(module.id)}
                                >
                                  Add Lesson
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Edit Lesson Form */}
                        {editingLesson && module.lessons.find((l) => l.id === editingLesson) && (
                          <div className="lesson-form-container">
                            <div className="lesson-form">
                              <h4>Edit Lesson</h4>
                              <div className="form-section">
                                <h5>Basic Information</h5>
                                <div className="form-row">
                                  <div className="form-group">
                                    <label>Lesson Title</label>
                                    <input
                                      type="text"
                                      value={lessonForm.title}
                                      onChange={(e) =>
                                        setLessonForm({ ...lessonForm, title: e.target.value })
                                      }
                                      placeholder="Enter lesson title"
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label>Type</label>
                                    <select
                                      value={lessonForm.type}
                                      onChange={(e) =>
                                        setLessonForm({ ...lessonForm, type: e.target.value })
                                      }
                                    >
                                      <option value="video">Video Lesson</option>
                                      <option value="quiz">Assessment/Quiz</option>
                                    </select>
                                  </div>
                                  <div className="form-group">
                                    <label>Duration</label>
                                    <input
                                      type="text"
                                      value={lessonForm.duration}
                                      onChange={(e) =>
                                        setLessonForm({ ...lessonForm, duration: e.target.value })
                                      }
                                      placeholder="e.g., 15:30"
                                    />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label>Description</label>
                                  <textarea
                                    value={lessonForm.description}
                                    onChange={(e) =>
                                      setLessonForm({
                                        ...lessonForm,
                                        description: e.target.value,
                                      })
                                    }
                                    placeholder="Enter lesson description"
                                    rows={2}
                                  />
                                </div>
                                {lessonForm.type === "video" && (
                                  <div className="form-group">
                                    <label>Video URL</label>
                                    <input
                                      type="text"
                                      value={lessonForm.video_url}
                                      onChange={(e) =>
                                        setLessonForm({ ...lessonForm, video_url: e.target.value })
                                      }
                                      placeholder="Enter video URL or upload path"
                                    />
                                  </div>
                                )}
                              </div>

                              {lessonForm.type === "video" && (
                                <div className="form-section">
                                  <h5>Lesson Content</h5>
                                  <div className="form-group">
                                    <label>Overview</label>
                                    <textarea
                                      value={lessonForm.overview}
                                      onChange={(e) =>
                                        setLessonForm({
                                          ...lessonForm,
                                          overview: e.target.value,
                                        })
                                      }
                                      placeholder="Enter lesson overview"
                                      rows={3}
                                    />
                                  </div>

                                  <div className="form-group">
                                    <label>Learning Objectives</label>
                                    {lessonForm.learning_objectives.map((objective, index) => (
                                      <div key={index} className="objective-input">
                                        <input
                                          type="text"
                                          value={objective}
                                          onChange={(e) => {
                                            const newObjectives = [
                                              ...lessonForm.learning_objectives,
                                            ];
                                            newObjectives[index] = e.target.value;
                                            setLessonForm({
                                              ...lessonForm,
                                              learning_objectives: newObjectives,
                                            });
                                          }}
                                          placeholder="Enter learning objective"
                                        />
                                        <button
                                          type="button"
                                          className="remove-btn"
                                          onClick={() => removeLearningObjective(index)}
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      className="add-item-btn"
                                      onClick={addLearningObjective}
                                    >
                                      <Plus size={16} />
                                      Add Objective
                                    </button>
                                  </div>

                                  <div className="form-group">
                                    <label>Key Points</label>
                                    {lessonForm.keypoints.map((point, pointIndex) => (
                                      <div key={pointIndex} className="key-point-section">
                                        <div className="key-point-header">
                                          <input
                                            type="text"
                                            value={point.title}
                                            onChange={(e) => {
                                              const newPoints = [...lessonForm.keypoints];
                                              newPoints[pointIndex].title = e.target.value;
                                              setLessonForm({
                                                ...lessonForm,
                                                keypoints: newPoints,
                                              });
                                            }}
                                            placeholder="Key point title"
                                          />
                                          <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeKeyPoint(pointIndex)}
                                          >
                                            <X size={16} />
                                          </button>
                                        </div>
                                        <textarea
                                          value={point.content}
                                          onChange={(e) => {
                                            const newPoints = [...lessonForm.keypoints];
                                            newPoints[pointIndex].content = e.target.value;
                                            setLessonForm({
                                              ...lessonForm,
                                              keypoints: newPoints,
                                            });
                                          }}
                                          placeholder="Key point content"
                                          rows={2}
                                        />
                                        <div className="bullets-section">
                                          <label>Bullet Points</label>
                                          {point.bullets.map((bullet, bulletIndex) => (
                                            <div key={bulletIndex} className="bullet-input">
                                              <input
                                                type="text"
                                                value={bullet}
                                                onChange={(e) => {
                                                  const newPoints = [...lessonForm.keypoints];
                                                  newPoints[pointIndex].bullets[bulletIndex] =
                                                    e.target.value;
                                                  setLessonForm({
                                                    ...lessonForm,
                                                    keypoints: newPoints,
                                                  });
                                                }}
                                                placeholder="Enter bullet point"
                                              />
                                              <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeBulletPoint(pointIndex, bulletIndex)}
                                              >
                                                <X size={16} />
                                              </button>
                                            </div>
                                          ))}
                                          <button
                                            type="button"
                                            className="add-item-btn small"
                                            onClick={() => addBulletPoint(pointIndex)}
                                          >
                                            <Plus size={14} />
                                            Add Bullet
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      className="add-item-btn"
                                      onClick={addKeyPoint}
                                    >
                                      <Plus size={16} />
                                      Add Key Point
                                    </button>
                                  </div>

                                  <div className="form-group">
                                    <label>Code Example (Optional)</label>
                                    {lessonForm.code_examples.map((ce, index) => (
                                      <div key={index} className="code-example-section">
                                        <input
                                          type="text"
                                          value={ce.title}
                                          onChange={(e) => {
                                            const newCodeExamples = [...lessonForm.code_examples];
                                            newCodeExamples[index].title = e.target.value;
                                            setLessonForm({
                                              ...lessonForm,
                                              code_examples: newCodeExamples,
                                            });
                                          }}
                                          placeholder="Code example title"
                                        />
                                        <textarea
                                          value={ce.code}
                                          onChange={(e) => {
                                            const newCodeExamples = [...lessonForm.code_examples];
                                            newCodeExamples[index].code = e.target.value;
                                            setLessonForm({
                                              ...lessonForm,
                                              code_examples: newCodeExamples,
                                            });
                                          }}
                                          placeholder="Enter code example"
                                          rows={6}
                                          className="code-textarea"
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  <div className="form-group">
                                    <label>Summary</label>
                                    <textarea
                                      value={lessonForm.summary}
                                      onChange={(e) =>
                                        setLessonForm({
                                          ...lessonForm,
                                          summary: e.target.value,
                                        })
                                      }
                                      placeholder="Enter lesson summary"
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              )}

                              {lessonForm.type === "quiz" && (
                                <div className="form-section">
                                  <h5>Assessment Questions</h5>
                                  {lessonForm.questions.map((question, questionIndex) => (
                                    <div key={questionIndex} className="question-section">
                                      <div className="question-header">
                                        <h6>Question {questionIndex + 1}</h6>
                                        <button
                                          type="button"
                                          className="remove-btn"
                                          onClick={() => removeQuestion(questionIndex)}
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                      <div className="form-group">
                                        <label>Question Text</label>
                                        <textarea
                                          value={question.question}
                                          onChange={(e) => {
                                            const newQuestions = [...lessonForm.questions];
                                            newQuestions[questionIndex].question = e.target.value;
                                            setLessonForm({ ...lessonForm, questions: newQuestions });
                                          }}
                                          placeholder="Enter question text"
                                          rows={2}
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label>Answer Options</label>
                                        {question.options.map((option, optionIndex) => (
                                          <div key={optionIndex} className="option-input">
                                            <input
                                              type="radio"
                                              name={`correct-${questionIndex}`}
                                              checked={question.correct_option === optionIndex}
                                              onChange={() => {
                                                const newQuestions = [...lessonForm.questions];
                                                newQuestions[questionIndex].correct_option = optionIndex;
                                                setLessonForm({ ...lessonForm, questions: newQuestions });
                                              }}
                                            />
                                            <input
                                              type="text"
                                              value={option}
                                              onChange={(e) => {
                                                const newQuestions = [...lessonForm.questions];
                                                newQuestions[questionIndex].options[optionIndex] =
                                                  e.target.value;
                                                setLessonForm({ ...lessonForm, questions: newQuestions });
                                              }}
                                              placeholder={`Option ${optionIndex + 1}`}
                                            />
                                            <span className="correct-indicator">
                                              {question.correct_option === optionIndex ? "✓ Correct" : ""}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="form-group">
                                        <label>Explanation (Optional)</label>
                                        <textarea
                                          value={question.explanation}
                                          onChange={(e) => {
                                            const newQuestions = [...lessonForm.questions];
                                            newQuestions[questionIndex].explanation = e.target.value;
                                            setLessonForm({ ...lessonForm, questions: newQuestions });
                                          }}
                                          placeholder="Explain why this is the correct answer"
                                          rows={2}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    className="add-item-btn"
                                    onClick={addQuestion}
                                  >
                                    <Plus size={16} />
                                    Add Question
                                  </button>
                                </div>
                              )}

                              <div className="form-actions">
                                <button
                                  className="btn-secondary"
                                  onClick={() => setEditingLesson(null)}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="btn-primary"
                                  onClick={() =>
                                    handleEditLesson(module.id, editingLesson, {
                                      title: lessonForm.title,
                                      type: lessonForm.type,
                                      duration: lessonForm.duration,
                                      description: lessonForm.description,
                                      video_url: lessonForm.video_url,
                                      overview: lessonForm.overview,
                                      summary: lessonForm.summary,
                                      learning_objectives: lessonForm.learning_objectives,
                                      keypoints: lessonForm.keypoints,
                                      code_examples: lessonForm.code_examples,
                                      questions: lessonForm.questions,
                                    })
                                  }
                                >
                                  Save Lesson
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Lessons List */}
                        <div className="lessons-list">
                          {module.lessons.map((lesson) => (
                            <div key={lesson.id} className="lesson-item">
                              <div className="lesson-icon">
                                {lesson.type === "video" ? (
                                  <Video size={16} />
                                ) : (
                                  <HelpCircle size={16} />
                                )}
                              </div>
                              <div className="lesson-info">
                                <h5>{lesson.title}</h5>
                                <p>{lesson.description}</p>
                                <div className="lesson-meta">
                                  <span className="lesson-type">{lesson.type}</span>
                                  <span className="lesson-duration">{lesson.duration}</span>
                                </div>
                              </div>
                              <div className="lesson-actions">
                                <button
                                  className="action-icon"
                                  onClick={() => {
                                    setEditingLesson(lesson.id);
                                    setLessonForm({
                                      title: lesson.title,
                                      type: lesson.type,
                                      duration: lesson.duration,
                                      description: lesson.description,
                                      video_url: lesson.video_url || "",
                                      overview: lesson.overview || "",
                                      summary: lesson.summary || "",
                                      learning_objectives: lesson.learning_objectives.map((obj) => obj.text) || [""],
                                      keypoints: lesson.keypoints.map((kp) => ({
                                        title: kp.title,
                                        content: kp.content,
                                        bullets: kp.bullets.map((b) => b.text) || [""],
                                      })) || [{ title: "", content: "", bullets: [""] }],
                                      code_examples: lesson.code_examples || [{ title: "", code: "" }],
                                      questions: lesson.questions || [
                                        {
                                          question: "",
                                          options: ["", "", "", ""],
                                          correct_option: 0,
                                          explanation: "",
                                        },
                                      ],
                                    });
                                  }}
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  className="action-icon"
                                  onClick={() =>
                                    navigate(`/course/${courseId}/lesson/${lesson.id}`)
                                  }
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  className="action-icon delete"
                                  onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-section">
            <div className="settings-card">
              <h3>Course Settings</h3>
              <div className="form-group">
                <label>Course Title</label>
                <input
                  type="text"
                  value={courseContent.title}
                  onChange={(e) =>
                    setCourseContent({ ...courseContent, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Course Description</label>
                <textarea
                  value={courseContent.description}
                  onChange={(e) =>
                    setCourseContent({ ...courseContent, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <button className="btn-primary" onClick={handleSaveCourse}>
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseContentManager;
