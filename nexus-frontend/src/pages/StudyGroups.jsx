"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Users, BookOpen } from "lucide-react"
import { useUser } from "../context/UserContext"
import CreateGroupModal from "../components/study-groups/CreateGroupModal"
import GroupCard from "../components/study-groups/GroupCard"
import GroupDetail from "../components/study-groups/GroupDetail"
import "./StudyGroups.css"
import axios from "axios"

const StudyGroups = () => {
  const { user, isAuthenticated } = useUser()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedExam, setSelectedExam] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [groups, setGroups] = useState([])
  const [filteredGroups, setFilteredGroups] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [activeTab, setActiveTab] = useState("discover")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [examFocuses, setExamFocuses] = useState([])

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(";").shift()
    return null
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchGroups()
      fetchCategoriesAndExams()
    }
  }, [isAuthenticated, activeTab])

  const fetchGroups = async () => {
    setIsLoading(true)
    setError(null)
    try {
      let url = "https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/groups/"
      if (activeTab === "my-groups") {
        url = "https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/my-groups/"
      }
      const response = await axios.get(url, { withCredentials: true })
      setGroups(response.data)

      console.log("Fetched groups:", response.data)

      setFilteredGroups(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch groups")
      console.error("Error fetching groups:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategoriesAndExams = async () => {
    try {
      const [categoriesRes, examsRes] = await Promise.all([
        axios.get("https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/categories/", { withCredentials: true }),
        axios.get("https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/exam-focus/", { withCredentials: true })
      ])
      setCategories(categoriesRes.data)
      setExamFocuses(examsRes.data)
    } catch (err) {
      console.error("Error fetching categories/exams:", err)
    }
  }

  const filterGroups = () => {
    let filtered = [...groups]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (group) =>
          group.name.toLowerCase().includes(query) ||
          group.description.toLowerCase().includes(query) ||
          (group.tags && group.tags.some(tag => tag.name.toLowerCase().includes(query)))
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(group => 
        group.category && group.category.name.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    }

    if (selectedExam !== "all") {
      filtered = filtered.filter(group => 
        group.exam_focus && group.exam_focus.name.toLowerCase().includes(selectedExam.toLowerCase())
      )
    }

    setFilteredGroups(filtered)
  }

  useEffect(() => {
    filterGroups()
  }, [selectedCategory, selectedExam, searchQuery, groups])

  const handleCreateGroup = async (groupData) => {
    try {
      const formData = new FormData()
      formData.append('name', groupData.name)
      formData.append('description', groupData.description)
      formData.append('category_id', groupData.category)
      formData.append('exam_focus_id', groupData.examFocus)
      formData.append('max_members', groupData.maxMembers)
      formData.append('status', groupData.isPrivate ? 'PRIVATE' : 'PUBLIC')
      groupData.tags.forEach(tag => formData.append('tag_ids', tag))
      if (groupData.icon) {
        formData.append('icon', groupData.icon)
      }

      const csrfToken = getCookie('csrftoken')
      const response = await axios.post(
        "https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/groups/",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': csrfToken
          },
          withCredentials: true
        }
      )

      setGroups([response.data, ...groups])
      setShowCreateModal(false)
      return { success: true }
    } catch (err) {
      console.error("Error creating group:", err)
      return { 
        success: false,
        error: err.response?.data || { detail: "Failed to create group" }
      }
    }
  }

  const handleJoinGroup = async (groupId) => {
    try {
      
      const csrfToken = getCookie('csrftoken')
      const token = localStorage.getItem("access_token"); // Get JWT token

      const response = await axios.post(
        `https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/groups/${groupId}/join/`,
        {},
        {
        headers: {
          "X-CSRFToken": csrfToken,
          "Authorization": `Bearer ${token}`,  // ✅ Send JWT token
        },
        withCredentials: true,
      }
      )

      // Group is returned in response whether it's public (auto-joined) or private (request sent)
      const updatedGroup = response.data.group || response.data

      // Update local state to reflect changes
      setGroups(prevGroups =>
        prevGroups.map(g => g.id === groupId ? updatedGroup : g)
      )

      return { success: true, group: updatedGroup }

    } catch (err) {
      console.error("Error joining group:", err)
      return {
        success: false,
        error: err.response?.data || { detail: "Failed to join group" }
      }
    }
  }


  const handleLeaveGroup = async (groupId) => {
    try {
      const csrfToken = getCookie('csrftoken')
      const response = await axios.post(
        `https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/groups/${groupId}/leave/`,
        {},
        { 
          headers: { 'X-CSRFToken': csrfToken },
          withCredentials: true 
        }
      )
      // Update the group in the groups state
      const updatedGroup = response.data.group || response.data
      setGroups(groups.map(g => g.id === groupId ? updatedGroup : g))
      return { success: true, group: updatedGroup }
    } catch (err) {
      console.error("Error leaving group:", err)
      return {
        success: false,
        error: err.response?.data || { detail: "Failed to leave group" }
      }
    }
  }

  const handleJoinByLink = async (inviteLink) => {
    try {
      const csrfToken = getCookie('csrftoken')
      const response = await axios.post(
        `https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/join/${inviteLink}/`,
        {},
        { 
          headers: { 'X-CSRFToken': csrfToken },
          withCredentials: true 
        }
      )
      fetchGroups() // Refresh all groups since we don't know which group was joined
      return { 
        success: true,
        message: response.data.status
      }
    } catch (err) {
      console.error("Error joining group by link:", err)
      return {
        success: false,
        error: err.response?.data || { detail: "Failed to join group by link" }
      }
    }
  }

  const myGroups = groups.filter(group => 
    group.members?.some(member => member.user.id === user?.chat_user_id)
  )


  if (selectedGroup) {
    return (
      <GroupDetail
        group={selectedGroup}
        onBack={() => setSelectedGroup(null)}
        onLeave={() => handleLeaveGroup(selectedGroup.id)}
        currentUser={user}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="study-groups-page">
        <div className="loading-spinner">Loading groups...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="study-groups-page">
        <div className="error-message">{error}</div>
        <button onClick={fetchGroups} className="retry-btn">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="study-groups-page">
      <div className="study-groups-header">
        <div className="header-content">
          <h1>Study Groups</h1>
          <p>Connect with fellow students and accelerate your learning</p>
        </div>
        <button 
          className="create-group-btn" 
          onClick={() => setShowCreateModal(true)}
          disabled={!isAuthenticated}
        >
          <Plus size={20} />
          Create Group
        </button>
      </div>

      <div className="study-groups-tabs">
        <button
          className={`tab-btn ${activeTab === "discover" ? "active" : ""}`}
          onClick={() => setActiveTab("discover")}
        >
          <Search size={16} />
          Discover Groups
        </button>
        <button
          className={`tab-btn ${activeTab === "my-groups" ? "active" : ""}`}
          onClick={() => setActiveTab("my-groups")}
          disabled={!isAuthenticated}
        >
          <Users size={16} />
          My Groups ({myGroups.length})
        </button>
      </div>

      {activeTab === "discover" && (
        <>
          <div className="study-groups-filters">
            <div className="search-container-std-grp"> {/* Fixed <post> to <div> */}
              <Search size={18} />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-container">
              <Filter size={18} />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-container">
              <BookOpen size={18} />
              <select 
                value={selectedExam} 
                onChange={(e) => setSelectedExam(e.target.value)}
              >
                <option value="all">All Exams</option>
                {examFocuses.map((exam) => (
                  <option key={exam.id} value={exam.name}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="groups-grid">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onJoin={handleJoinGroup}
                  onLeave={handleLeaveGroup}
                  onViewDetails={() => setSelectedGroup(group)}
                  currentUser={user}
                  showManageButton={group.owner?.id === user?.chat_user_id}
                />
              ))
            ) : (
              <div className="no-groups">
                <p>No groups found matching your criteria.</p>
                {isAuthenticated && (
                  <button className="create-first-group-btn" onClick={() => setShowCreateModal(true)}>
                    Create the first group
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "my-groups" && (
        <div className="my-groups-section">
          {myGroups.length > 0 ? (
            <div className="groups-grid">
              {myGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onJoin={handleJoinGroup}
                  onLeave={handleLeaveGroup}
                  onViewDetails={() => setSelectedGroup(group)}
                  currentUser={user}
                  showManageButton={group.owner?.id === user?.chat_user_id}
                />
              ))}
            </div>
          ) : (
            <div className="no-groups">
              <p>You haven't joined any groups yet.</p>
              <button className="browse-groups-btn" onClick={() => setActiveTab("discover")}>
                Browse Groups
              </button>
            </div>
          )}
        </div>
      )}

      {showCreateModal && (
        <CreateGroupModal 
          onClose={() => setShowCreateModal(false)} 
          onCreateGroup={handleCreateGroup}
          categories={categories}
          examFocuses={examFocuses}
        />
      )}
    </div>
  )
}

export default StudyGroups