"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BookOpen, Users, Target } from "lucide-react";
import "./CreateCourse.css";
import { useUser } from "../context/UserContext";
import axios from "axios";
import CourseCoverUpload from "./CourseCoverUpload"; // Import the new component

const CreateCourse = () => {
  const navigate = useNavigate();
  const { isAuthenticated, fetchCsrfToken, refreshToken, getAccessToken } = useUser();
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "beginner",
    estimated_duration: "",
    learning_objectives: [""],
    prerequisites: [""],
    tags: "",
    instructor: {
      email: "",
      bio: "",
      experience: "",
      profile_image: "",
      expertise: [""],
      social_links: {
        linkedin: "",
        twitter: "",
        website: "",
      },
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailCheckStatus, setEmailCheckStatus] = useState(null);
  const [emailCheckTimeout, setEmailCheckTimeout] = useState(null);
  const [error, setError] = useState(null);

  const [showCoverUpload, setShowCoverUpload] = useState(false); // State for popup
  const [courseId, setCourseId] = useState(null); // Store course ID

  const categories = [
    "programming",
    "data-science",
    "machine-learning",
    "statistics",
    "finance",
    "risk-management",
    "certification",
    "other",
  ];

  const difficulties = [
    { value: "beginner", label: "Beginner", color: "#48bb78" },
    { value: "intermediate", label: "Intermediate", color: "#ed8936" },
    { value: "advanced", label: "Advanced", color: "#f56565" },
    { value: "expert", label: "Expert", color: "#9b2c2c" },
  ];


  const addLearningObjective = () => {
    setCourseForm((prev) => ({
      ...prev,
      learning_objectives: [...prev.learning_objectives, ""],
    }));
  };

  const removeLearningObjective = (index) => {
    setCourseForm((prev) => ({
      ...prev,
      learning_objectives: prev.learning_objectives.filter((_, i) => i !== index),
    }));
  };

  const updateLearningObjective = (index, value) => {
    const updatedObjectives = [...courseForm.learning_objectives];
    updatedObjectives[index] = value;
    setCourseForm((prev) => ({
      ...prev,
      learning_objectives: updatedObjectives,
    }));
  };

  const addPrerequisite = () => {
    setCourseForm((prev) => ({
      ...prev,
      prerequisites: [...prev.prerequisites, ""],
    }));
  };

  const removePrerequisite = (index) => {
    setCourseForm((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index),
    }));
  };

  const updatePrerequisite = (index, value) => {
    const updatedPrerequisites = [...courseForm.prerequisites];
    updatedPrerequisites[index] = value;
    setCourseForm((prev) => ({
      ...prev,
      prerequisites: updatedPrerequisites,
    }));
  };

  const addExpertise = () => {
    setCourseForm((prev) => ({
      ...prev,
      instructor: {
        ...prev.instructor,
        expertise: [...prev.instructor.expertise, ""],
      },
    }));
  };

  const removeExpertise = (index) => {
    setCourseForm((prev) => ({
      ...prev,
      instructor: {
        ...prev.instructor,
        expertise: prev.instructor.expertise.filter((_, i) => i !== index),
      },
    }));
  };

  const updateExpertise = (index, value) => {
    const updatedExpertise = [...courseForm.instructor.expertise];
    updatedExpertise[index] = value;
    setCourseForm((prev) => ({
      ...prev,
      instructor: {
        ...prev.instructor,
        expertise: updatedExpertise,
      },
    }));
  };

  const checkUserByEmail = useCallback(async (email) => {
    if (!email || !email.includes("@")) {
      setEmailCheckStatus(null);
      console.log("Email invalid or empty, skipping check:", email);
      return;
    }

    setEmailCheckStatus("checking");
    setError(null);
    console.log("Checking email:", email);

    try {
      const accessToken = getAccessToken();
      console.log("Access token for email check:", accessToken);
      if (!accessToken) throw new Error("No access token found");

      const response = await axios.get("https://127.0.0.1:8000/auth/api/profile-by-email/by-email/", {
        params: { email: email.toLowerCase() },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("Email check response:", response.data);
      setEmailCheckStatus("found");
      setCourseForm((prev) => ({
        ...prev,
        instructor: {
          ...prev.instructor,
          email,
          bio: response.data.bio || "",
          experience: response.data.experience || "",
          profile_image: response.data.profile_image || "",
          expertise: response.data.expertise?.map((exp) => exp.name) || [""],
          social_links: response.data.social_links || {
            linkedin: "",
            twitter: "",
            website: "",
          },
        },
      }));
    } catch (err) {
      console.error("Email check failed:", err);
      if (err.response) {
        console.error("Email check response data:", err.response.data);
        console.error("Email check response status:", err.response.status);
      }
      if (err.response?.status === 401) {
        console.log("Attempting token refresh for email check");
        const refreshed = await refreshToken();
        if (refreshed) {
          console.log("Token refreshed, retrying email check");
          checkUserByEmail(email);
        } else {
          setError("Authentication failed. Please log in again.");
          setEmailCheckStatus(null);
        }
      } else if (err.response?.status === 404) {
        console.log("Email not found, setting to not-found");
        setEmailCheckStatus("not-found");
        setCourseForm((prev) => ({
          ...prev,
          instructor: {
            ...prev.instructor,
            email,
            bio: "",
            experience: "",
            profile_image: "",
            expertise: [""],
            social_links: { linkedin: "", twitter: "", website: "" },
          },
        }));
      } else {
        setError("Failed to verify email. Please try again.");
        setEmailCheckStatus(null);
      }
    }
  }, [refreshToken]);


  const handleEmailChange = (e) => {
    const email = e.target.value;
    setCourseForm((prev) => ({
      ...prev,
      instructor: { ...prev.instructor, email },
    }));

    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout);
    }

    if (email) {
      const newTimeout = setTimeout(() => {
        checkUserByEmail(email);
      }, 800);
      setEmailCheckTimeout(newTimeout);
    } else {
      setEmailCheckStatus(null);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Submitting course form:", courseForm);
  if (!isAuthenticated) {
    setError("Please log in to create a course.");
    console.error("Not authenticated");
    return;
  }

  if (!courseForm.title.trim() || !courseForm.description.trim() || !courseForm.instructor.email.trim()) {
    setError("Please fill in the required fields (Title, Description, and Instructor Email)");
    console.error("Required fields missing:", {
      title: courseForm.title,
      description: courseForm.description,
      instructorEmail: courseForm.instructor.email,
    });
    return;
  }

  if (emailCheckStatus === "not-found") {
    setError("Instructor email not found. Please use an existing user email or register the instructor.");
    console.error("Instructor email not found:", courseForm.instructor.email);
    return;
  }

  // Validate tags
  const tagsArray = courseForm.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag);
  if (tagsArray.length === 0) {
    setError("Please provide at least one valid tag.");
    console.error("No valid tags provided:", courseForm.tags);
    return;
  }

  setIsSubmitting(true);
  setError(null);

  try {
    const accessToken = getAccessToken();
    console.log("Access token for course creation:", accessToken);
    if (!accessToken) throw new Error("No access token found");

    const csrfToken = await fetchCsrfToken();
    console.log("CSRF token:", csrfToken);
    if (!csrfToken) throw new Error("No CSRF token found");

    const courseData = {
      title: courseForm.title,
      description: courseForm.description,
      category: courseForm.category || "other",
      difficulty: courseForm.difficulty || "beginner",
      estimated_duration: courseForm.estimated_duration || "",
      status: "draft",
      instructor: {
        user: courseForm.instructor.email,
        bio: courseForm.instructor.bio || "",
        experience: courseForm.instructor.experience || "",
        profile_image: courseForm.instructor.profile_image || "",
        social_links: {
          linkedin: courseForm.instructor.social_links.linkedin || "",
          twitter: courseForm.instructor.social_links.twitter || "",
          website: courseForm.instructor.social_links.website || "",
        },
        expertise: courseForm.instructor.expertise
          .filter((exp) => exp.trim())
          .map((exp) => ({ name: exp })),
      },
      tags: tagsArray.map((tag) => ({ name: tag })),
      learning_objectives: courseForm.learning_objectives
        .filter((obj) => obj.trim())
        .map((obj) => ({ text: obj })),
      prerequisites: courseForm.prerequisites
        .filter((pre) => pre.trim())
        .map((pre) => ({ text: pre })),
    };

    console.log("Course data payload:", courseData);

    const response = await axios.post(
      "https://127.0.0.1:8000/courses/api/courses/",
      courseData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    console.log("Course creation response:", response.data);


    setCourseId(response.data.id); // Store course ID
    setShowCoverUpload(true); // Open the upload popup


  } catch (err) {
    console.error("Course creation failed:", err);
    if (err.response) {
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
      // Log specific tag errors
      if (err.response.data.tags) {
        const tagErrors = err.response.data.tags;
        if (Array.isArray(tagErrors)) {
          setError(`Tag error: ${tagErrors.join(', ')}`);
        } else if (typeof tagErrors === 'object') {
          const messages = Object.values(tagErrors).flat();
          setError(`Tag errors: ${messages.join(', ')}`);
        } else {
          setError("Invalid tag data. Please check your tags and try again.");
        }
      } else if (err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Failed to create course. Please check the form and try again.");
      }
    }
    if (err.response?.status === 401) {
      console.log("Attempting token refresh for course creation");
      const refreshed = await refreshToken();
      if (refreshed) {
        console.log("Token refreshed, retrying course creation");
        return handleSubmit(e);
      } else {
        setError("Authentication failed. Please log in again.");
        console.error("Token refresh failed");
      }
    } else {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.join(" ") ||
        err.response?.data?.tags?.[0]?.name?.join(" ") || // Handle tag-specific errors
        Object.values(err.response?.data || {})
          .flat()
          .join(" ") ||
        "Failed to create course. Please check the form and try again.";
      setError(errorMessage);
      console.error("Error details:", err.response?.data || err.message);
    }
  } finally {
    setIsSubmitting(false);
  }
};


const handleCloseCoverUpload = () => {
    setShowCoverUpload(false);
    navigate(`/course/${courseId}/content-manager`); // Navigate after upload or cancel

  };

  useEffect(() => {
    return () => {
      if (emailCheckTimeout) {
        clearTimeout(emailCheckTimeout);
      }
    };
  }, [emailCheckTimeout]);

  return (
    <div className="create-course-container">
      <h1>Create New Course</h1>
      <div className="create-course-form">
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <div className="section-header">
              <BookOpen size={20} />
              <h2>Basic Information</h2>
            </div>

            <div className="form-group">
              <label htmlFor="title">Course Title *</label>
              <input
                type="text"
                id="title"
                value={courseForm.title || ""}
                onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter course title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Course Description *</label>
              <textarea
                id="description"
                value={courseForm.description || ""}
                onChange={(e) => setCourseForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what students will learn in this course"
                rows={4}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={courseForm.category || ""}
                  onChange={(e) => setCourseForm((prev) => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="difficulty">Difficulty Level</label>
                <select
                  id="difficulty"
                  value={courseForm.difficulty || "beginner"}
                  onChange={(e) => setCourseForm((prev) => ({ ...prev, difficulty: e.target.value }))}
                >
                  {difficulties.map((diff) => (
                    <option key={diff.value} value={diff.value}>
                      {diff.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="duration">Estimated Duration</label>
                <input
                  type="text"
                  id="duration"
                  value={courseForm.estimated_duration || ""}
                  onChange={(e) => setCourseForm((prev) => ({ ...prev, estimated_duration: e.target.value }))}
                  placeholder="e.g., 4 weeks, 20 hours"
                />
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="form-section">
            <div className="section-header">
              <Target size={20} />
              <h2>Learning Objectives</h2>
            </div>

            <p className="section-description">What will students be able to do after completing this course?</p>

            {courseForm.learning_objectives.map((objective, index) => (
              <div key={index} className="array-input-group">
                <input
                  type="text"
                  value={objective || ""}
                  onChange={(e) => updateLearningObjective(index, e.target.value)}
                  placeholder={`Learning objective ${index + 1}`}
                />
                {courseForm.learning_objectives.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removeLearningObjective(index)}>
                    ×
                  </button>
                )}
              </div>
            ))}

            <button type="button" className="add-btn" onClick={addLearningObjective}>
              <Plus size={16} />
              Add Learning Objective
            </button>
          </div>

          {/* Prerequisites */}
          <div className="form-section">
            <div className="section-header">
              <Users size={20} />
              <h2>Prerequisites</h2>
            </div>

            <p className="section-description">What should students know before taking this course?</p>

            {courseForm.prerequisites.map((prerequisite, index) => (
              <div key={index} className="array-input-group">
                <input
                  type="text"
                  value={prerequisite || ""}
                  onChange={(e) => updatePrerequisite(index, e.target.value)}
                  placeholder={`Prerequisite ${index + 1}`}
                />
                {courseForm.prerequisites.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removePrerequisite(index)}>
                    ×
                  </button>
                )}
              </div>
            ))}

            <button type="button" className="add-btn" onClick={addPrerequisite}>
              <Plus size={16} />
              Add Prerequisite
            </button>
          </div>

          {/* Instructor Details */}
          <div className="form-section">
            <div className="section-header">
              <Users size={20} />
              <h2>Instructor Details</h2>
            </div>

            <p className="section-description">Provide information about the course instructor</p>

            <div className="form-group">
              <label htmlFor="instructorEmail">Instructor Email *</label>
              <input
                type="email"
                id="instructorEmail"
                value={courseForm.instructor.email || ""}
                onChange={handleEmailChange}
                placeholder="instructor@example.com"
                required
                disabled={emailCheckStatus === "checking"}
              />
              {emailCheckStatus === "checking" && <div className="checking-email">Checking if user exists...</div>}
              {emailCheckStatus === "found" && (
                <div className="email-found">✅ Instructor found! Details auto-populated below.</div>
              )}
              {emailCheckStatus === "not-found" && courseForm.instructor.email && (
                <div className="email-not-found">
                  ℹ️ Instructor not found. Please provide additional instructor details.
                </div>
              )}
            </div>

            {(emailCheckStatus === "found" || emailCheckStatus === "not-found") && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="instructorBio">Instructor Bio</label>
                    <textarea
                      id="instructorBio"
                      value={courseForm.instructor.bio || ""}
                      onChange={(e) =>
                        setCourseForm((prev) => ({
                          ...prev,
                          instructor: { ...prev.instructor, bio: e.target.value },
                        }))
                      }
                      placeholder="Brief description of the instructor's background"
                      rows={4}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="experience">Years of Experience</label>
                    <input
                      type="text"
                      id="experience"
                      value={courseForm.instructor.experience || ""}
                      onChange={(e) =>
                        setCourseForm((prev) => ({
                          ...prev,
                          instructor: { ...prev.instructor, experience: e.target.value },
                        }))
                      }
                      placeholder="e.g., 5+ years"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="profileImage">Profile Image URL</label>
                    <input
                      type="url"
                      id="profileImage"
                      value={courseForm.instructor.profile_image || ""}
                      onChange={(e) =>
                        setCourseForm((prev) => ({
                          ...prev,
                          instructor: { ...prev.instructor, profile_image: e.target.value },
                        }))
                      }
                      placeholder="https://example.com/profile-image.jpg"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Areas of Expertise</label>
                  <p className="section-description">What are the instructor's main areas of expertise?</p>

                  {courseForm.instructor.expertise.map((expertise, index) => (
                    <div key={index} className="array-input-group">
                      <input
                        type="text"
                        value={expertise || ""}
                        onChange={(e) => updateExpertise(index, e.target.value)}
                        placeholder={`Area of expertise ${index + 1}`}
                      />
                      {courseForm.instructor.expertise.length > 1 && (
                        <button type="button" className="remove-btn" onClick={() => removeExpertise(index)}>
                          ×
                        </button>
                      )}
                    </div>
                  ))}

                  <button type="button" className="add-btn" onClick={addExpertise}>
                    <Plus size={16} />
                    Add Expertise Area
                  </button>
                </div>

                <div className="form-group">
                  <label>Social Links (Optional)</label>
                  <div className="social-links-grid">
                    <div className="form-group">
                      <label htmlFor="linkedin">LinkedIn</label>
                      <input
                        type="url"
                        id="linkedin"
                        value={courseForm.instructor.social_links.linkedin || ""}
                        onChange={(e) =>
                          setCourseForm((prev) => ({
                            ...prev,
                            instructor: {
                              ...prev.instructor,
                              social_links: { ...prev.instructor.social_links, linkedin: e.target.value },
                            },
                          }))
                        }
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="twitter">Twitter</label>
                      <input
                        type="url"
                        id="twitter"
                        value={courseForm.instructor.social_links.twitter || ""}
                        onChange={(e) =>
                          setCourseForm((prev) => ({
                            ...prev,
                            instructor: {
                              ...prev.instructor,
                              social_links: { ...prev.instructor.social_links, twitter: e.target.value },
                            },
                          }))
                        }
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="website">Website</label>
                      <input
                        type="url"
                        id="website"
                        value={courseForm.instructor.social_links.website || ""}
                        onChange={(e) =>
                          setCourseForm((prev) => ({
                            ...prev,
                            instructor: {
                              ...prev.instructor,
                              social_links: { ...prev.instructor.social_links, website: e.target.value },
                            },
                          }))
                        }
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Tags */}
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                value={courseForm.tags || ""}
                onChange={(e) => setCourseForm((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="Enter tags separated by commas (e.g., python, data analysis, statistics)"
                required
              />
              <small>Separate tags with commas to help students find your course</small>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting || emailCheckStatus === "checking"}>
              {isSubmitting ? "Creating Course..." : "Create Course"}
            </button>
          </div>
        </form>

      </div>

      {showCoverUpload && (
        <CourseCoverUpload
          courseId={courseId}
          onClose={handleCloseCoverUpload}
          accessToken={getAccessToken()}
          fetchCsrfToken={fetchCsrfToken}
        />
      )}
    </div>
  );
};

export default CreateCourse;