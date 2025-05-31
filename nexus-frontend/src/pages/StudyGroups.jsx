"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Users, BookOpen } from "lucide-react"
import { useUser } from "../context/UserContext"
import CreateGroupModal from "../components/study-groups/CreateGroupModal"
import GroupCard from "../components/study-groups/GroupCard"
import GroupDetail from "../components/study-groups/GroupDetail"
import "./StudyGroups.css"

const groupCategories = [
  { id: "all", name: "All Groups" },
  { id: "exam-prep", name: "Exam Preparation" },
  { id: "study-sessions", name: "Study Sessions" },
  { id: "project-groups", name: "Project Groups" },
  { id: "discussion", name: "Discussion Groups" },
]

const examTypes = [
  { id: "all", name: "All Exams" },
  { id: "soa-p", name: "SOA Exam P" },
  { id: "soa-fm", name: "SOA Exam FM" },
  { id: "soa-ifm", name: "SOA Exam IFM" },
  { id: "soa-ltam", name: "SOA Exam LTAM" },
  { id: "soa-stam", name: "SOA Exam STAM" },
  { id: "cas-1", name: "CAS Exam 1" },
  { id: "cas-2", name: "CAS Exam 2" },
]

const StudyGroups = () => {
  const { user } = useUser()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedExam, setSelectedExam] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [groups, setGroups] = useState([])
  const [filteredGroups, setFilteredGroups] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [activeTab, setActiveTab] = useState("discover")

  useEffect(() => {
    fetchGroups()
  }, [])

  useEffect(() => {
    filterGroups()
  }, [selectedCategory, selectedExam, searchQuery, groups])

  const fetchGroups = async () => {
    // Simulate API call
    const mockGroups = [
      {
        id: 1,
        name: "SOA Exam P Study Group",
        description: "Preparing for the SOA Exam P together. Daily problem solving and weekly mock exams.",
        category: "exam-prep",
        examType: "soa-p",
        members: 24,
        maxMembers: 30,
        isPrivate: false,
        owner: "Sarah Johnson",
        ownerId: "user123",
        tags: ["Probability", "Statistics", "SOA"],
        nextSession: "2024-01-15T18:00:00Z",
        lastActivity: "2024-01-10T14:30:00Z",
        avatar: "/assets/monte-carlo.jpg",
        isJoined: false,
      },
      {
        id: 2,
        name: "Actuarial Python Coding",
        description: "Learn Python programming for actuarial applications. Weekly coding challenges and projects.",
        category: "project-groups",
        examType: "all",
        members: 18,
        maxMembers: 25,
        isPrivate: false,
        owner: "Mike Chen",
        ownerId: "user456",
        tags: ["Python", "Programming", "Data Analysis"],
        nextSession: "2024-01-12T19:00:00Z",
        lastActivity: "2024-01-11T16:45:00Z",
        avatar: "/assets/monte-carlo.jpg",
        isJoined: true,
      },
      {
        id: 3,
        name: "CAS Exam 1 Intensive",
        description: "Intensive study group for CAS Exam 1. Focus on problem-solving techniques and time management.",
        category: "exam-prep",
        examType: "cas-1",
        members: 12,
        maxMembers: 15,
        isPrivate: true,
        owner: "Emily Rodriguez",
        ownerId: "user789",
        tags: ["CAS", "Probability", "Intensive"],
        nextSession: "2024-01-14T17:00:00Z",
        lastActivity: "2024-01-11T20:15:00Z",
        avatar: "/placeholder.svg?height=80&width=80",
        isJoined: false,
      },
      {
        id: 4,
        name: "Financial Mathematics Discussion",
        description: "Weekly discussions on financial mathematics concepts. Open to all levels.",
        category: "discussion",
        examType: "soa-fm",
        members: 31,
        maxMembers: 50,
        isPrivate: false,
        owner: "David Kim",
        ownerId: "user101",
        tags: ["Financial Math", "Discussion", "Theory"],
        nextSession: "2024-01-13T16:00:00Z",
        lastActivity: "2024-01-11T12:20:00Z",
        avatar: "/placeholder.svg?height=80&width=80",
        isJoined: true,
      },
      {
        id: 5,
        name: "Weekend Study Sessions",
        description: "Casual weekend study sessions. Bring your own materials and study together.",
        category: "study-sessions",
        examType: "all",
        members: 8,
        maxMembers: 12,
        isPrivate: false,
        owner: "Lisa Wang",
        ownerId: "user202",
        tags: ["Weekend", "Casual", "Study"],
        nextSession: "2024-01-13T10:00:00Z",
        lastActivity: "2024-01-10T18:30:00Z",
        avatar: "/assets/monte-carlo.jpg",
        isJoined: false,
      },
    ]

    setGroups(mockGroups)
    setFilteredGroups(mockGroups)
  }

  const filterGroups = () => {
    let filtered = groups

    if (selectedCategory !== "all") {
      filtered = filtered.filter((group) => group.category === selectedCategory)
    }

    if (selectedExam !== "all") {
      filtered = filtered.filter((group) => group.examType === selectedExam || group.examType === "all")
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (group) =>
          group.name.toLowerCase().includes(query) ||
          group.description.toLowerCase().includes(query) ||
          group.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    setFilteredGroups(filtered)
  }

  const handleCreateGroup = (groupData) => {
    const newGroup = {
      id: groups.length + 1,
      ...groupData,
      members: 1,
      owner: user.name,
      ownerId: user.id,
      lastActivity: new Date().toISOString(),
      avatar: "/placeholder.svg?height=80&width=80",
      isJoined: true,
    }

    setGroups([newGroup, ...groups])
    setShowCreateModal(false)
  }

  const handleJoinGroup = (groupId) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: group.members + 1,
              isJoined: true,
            }
          : group,
      ),
    )
  }

  const handleLeaveGroup = (groupId) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: group.members - 1,
              isJoined: false,
            }
          : group,
      ),
    )
  }

  const myGroups = groups.filter((group) => group.isJoined)

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

  return (
    <div className="study-groups-page">
      <div className="study-groups-header">
        <div className="header-content">
          <h1>Study Groups</h1>
          <p>Connect with fellow students and accelerate your learning</p>
        </div>
        <button className="create-group-btn" onClick={() => setShowCreateModal(true)}>
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
        >
          <Users size={16} />
          My Groups ({myGroups.length})
        </button>
      </div>

      {activeTab === "discover" && (
        <>
          <div className="study-groups-filters">
            <div className="search-container-std-grp">
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
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {groupCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-container">
              <BookOpen size={18} />
              <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
                {examTypes.map((exam) => (
                  <option key={exam.id} value={exam.id}>
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
                  onJoin={() => handleJoinGroup(group.id)}
                  onLeave={() => handleLeaveGroup(group.id)}
                  onViewDetails={() => setSelectedGroup(group)}
                  currentUser={user}
                />
              ))
            ) : (
              <div className="no-groups">
                <p>No groups found matching your criteria.</p>
                <button className="create-first-group-btn" onClick={() => setShowCreateModal(true)}>
                  Create the first group
                </button>
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
                  onJoin={() => handleJoinGroup(group.id)}
                  onLeave={() => handleLeaveGroup(group.id)}
                  onViewDetails={() => setSelectedGroup(group)}
                  currentUser={user}
                  showManageButton={group.ownerId === user.id}
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
        <CreateGroupModal onClose={() => setShowCreateModal(false)} onCreateGroup={handleCreateGroup} />
      )}
    </div>
  )
}

export default StudyGroups
