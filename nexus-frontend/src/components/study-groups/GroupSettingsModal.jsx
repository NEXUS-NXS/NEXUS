"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Users,
  Settings,
  UserPlus,
  Camera,
  Globe,
  Lock,
  Hash,
  Trash2,
  Check,
  Crown,
  Shield,
  User,
  Search,
  Plus,
  Minus,
  Save,
} from "lucide-react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import "./GroupSettingsModal.css";

const GroupSettingsModal = ({ group, isOpen, onClose, onUpdateGroup, currentUser }) => {
  const { fetchCsrfToken, isAuthenticated } = useUser();
  const [activeTab, setActiveTab] = useState("requests");
  const [groupData, setGroupData] = useState({
    name: group?.name || "",
    description: group?.description || "",
    isPrivate: group?.status === "PRIVATE" || false,
    maxMembers: group?.max_members || 50,
    tags: group?.tags?.map(tag => ({ id: tag.id, name: tag.name })) || [],
    avatar: group?.icon || null,
    category_id: group?.category?.id || 1,
    exam_focus_id: group?.exam_focus?.id || 1,
  });
  const [joinRequests, setJoinRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Helper to get CSRF token from cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Helper to get access token from localStorage
  const getAccessToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found in localStorage");
      setError("Authentication error: Please log in again");
    }
    return token;
  };

  // Fetch pending join requests and members on mount
  useEffect(() => {
    if (!isOpen || !isAuthenticated || !group?.id) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const accessToken = getAccessToken();
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

        // Fetch pending join requests
        const requestsRes = await axios.get(
          `https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/groups/${group.id}/pending-requests/`,
          { 
            headers,
            withCredentials: true 
          }
        );
        console.log("Join requests response:", JSON.stringify(requestsRes.data, null, 2));
        setJoinRequests(
          requestsRes.data.map(req => ({
            id: req.id,
            user: {
              id: req.user.id,
              name: req.user.chat_username || req.user.email || "Unknown User",
              email: req.user.email || "No email provided",
              avatar: req.user.avatar || "/placeholder.svg",
            },
            message: req.message || "No message provided",
            requestDate: req.created_at || new Date().toISOString(),
          }))
        );

        // Fetch group members
        const membersRes = await axios.get(
          `https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/groups/${group.id}/members/`,
          { 
            headers,
            withCredentials: true 
          }
        );
        console.log("Members response:", JSON.stringify(membersRes.data, null, 2));
        setMembers(
          membersRes.data.map(m => ({
            id: m.user.id,
            name: m.user.chat_username || m.user.email || "Unknown User",
            email: m.user.email || "No email provided",
            role: m.role.toLowerCase(),
            avatar: m.user.avatar || "/placeholder.svg",
            status: m.user.is_online ? "online" : "offline",
            joinDate: m.joined_at ? formatDate(m.joined_at) : new Date().toISOString(),
          }))
        );
      } catch (err) {
        const errorMsg = err.response?.data?.detail || "Failed to load group data";
        setError(errorMsg);
        console.error("Error fetching data:", err, "Response:", JSON.stringify(err.response?.data, null, 2));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, group?.id, isAuthenticated]);

  // Helper to get CSRF token with fallback to fetchCsrfToken
  const getCsrfToken = async (retries = 3, delay = 1000) => {
    let csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      console.log("CSRF token retrieved from cookies:", csrfToken);
      return csrfToken;
    }

    console.warn("CSRF token not found in cookies, attempting to fetch...");
    for (let i = 0; i < retries; i++) {
      try {
        csrfToken = await fetchCsrfToken();
        if (csrfToken) {
          console.log("CSRF token fetched successfully:", csrfToken);
          return csrfToken;
        }
        throw new Error("CSRF token not received");
      } catch (err) {
        console.error(`CSRF token fetch attempt ${i + 1} failed:`, err);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    setError("Failed to fetch CSRF token after retries");
    throw new Error("Failed to fetch CSRF token");
  };

  // Handle approve/reject join request
  const handleManageRequest = async (requestId, action) => {
    try {
      setIsLoading(true);
      setError(null);
      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const csrfToken = await getCsrfToken();
      const headers = {
        "Authorization": `Bearer ${accessToken}`,
        "X-CSRFToken": csrfToken,
        "Content-Type": "application/json",
      };
      console.log(`Sending join request action: ${action} for ID ${requestId}`, { headers });
      const response = await axios.post(
        `https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/join-requests/${requestId}/manage/`,
        { action },
        {
          headers,
          withCredentials: true,
        }
      );
      console.log(`Join request ${action} response:`, JSON.stringify(response.data, null, 2));
      // Refetch both join requests and members
      const requestsRes = await axios.get(
        `https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/groups/${group.id}/pending-requests/`,
        { 
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true 
        }
      );
      setJoinRequests(
        requestsRes.data.map(req => ({
          id: req.id,
          user: {
            id: req.user.id,
            name: req.user.chat_username || req.user.email || "Unknown User",
            email: req.user.email || "No email provided",
            avatar: req.user.avatar || "/placeholder.svg",
          },
          message: req.message || "No message provided",
          requestDate: req.created_at || new Date().toISOString(),
        }))
      );
      const membersRes = await axios.get(
        `https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/groups/${group.id}/members/`,
        { 
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true 
        }
      );
      setMembers(
        membersRes.data.map(m => ({
          id: m.user.id,
          name: m.user.chat_username || m.user.email || "Unknown User",
          email: m.user.email || "No email provided",
          role: m.role.toLowerCase(),
          avatar: m.user.avatar || "/placeholder.svg",
          status: m.user.is_online ? "online" : "offline",
          joinDate: m.joined_at ? formatDate(m.joined_at) : new Date().toISOString(),
        }))
      );
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || `Failed to ${action.toLowerCase()} join request`;
      setError(errorMsg);
      console.error(`Error managing join request ${requestId}:`, err, "Response:", JSON.stringify(err.response?.data, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRequest = (requestId) => handleManageRequest(requestId, "APPROVE");
  const handleRejectRequest = (requestId) => handleManageRequest(requestId, "REJECT");

  // Handle member management (promote, demote, remove)
  const handleManageMember = async (memberId, action) => {
    if (action === "REMOVE" && !window.confirm("Are you sure you want to remove this member?")) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const csrfToken = await getCsrfToken();
      const headers = {
        "Authorization": `Bearer ${accessToken}`,
        "X-CSRFToken": csrfToken,
        "Content-Type": "application/json",
      };
      console.log(`Managing member ${memberId} with action ${action}`, { headers });
      await axios.post(
        `https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/groups/${group.id}/members/${memberId}/manage/`,
        { action },
        {
          headers,
          withCredentials: true,
        }
      );
      console.log(`Member ${action} successful for ID ${memberId}`);
      if (action === "REMOVE") {
        setMembers(prev => prev.filter(member => member.id !== memberId));
      } else {
        setMembers(prev =>
          prev.map(member =>
            member.id === memberId ? { ...member, role: action === "PROMOTE" ? "admin" : "member" } : member
          )
        );
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || `Failed to ${action.toLowerCase()} member`;
      setError(errorMsg);
      console.error(`Error managing member ${memberId}:`, err, "Response:", JSON.stringify(err.response?.data, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = (memberId) => handleManageMember(memberId, "REMOVE");
  const handleChangeRole = (memberId, newRole) => {
    const action = newRole === "admin" ? "PROMOTE" : "DEMOTE";
    handleManageMember(memberId, action);
  };

  // Handle group update
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const csrfToken = await getCsrfToken();
      const formData = new FormData();
      formData.append("name", groupData.name);
      formData.append("description", groupData.description);
      formData.append("category_id", groupData.category_id);
      formData.append("exam_focus_id", groupData.exam_focus_id);
      formData.append("max_members", groupData.maxMembers);
      formData.append("status", groupData.isPrivate ? "PRIVATE" : "PUBLIC");
      formData.append("tag_ids", JSON.stringify(groupData.tags.map(tag => tag.id).filter(id => id)));

      if (fileInputRef.current?.files[0]) {
        formData.append("icon", fileInputRef.current.files[0]);
      }

      console.log("Sending group update with data:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const headers = {
        "Authorization": `Bearer ${accessToken}`,
        "X-CSRFToken": csrfToken,
        "Content-Type": "multipart/form-data",
      };

      const response = await axios.put(
        `https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/groups/${group.id}/`,
        formData,
        {
          headers,
          withCredentials: true,
        }
      );
      console.log("Group update response:", JSON.stringify(response.data, null, 2));

      onUpdateGroup({
        ...groupData,
        id: group.id,
        icon: response.data.icon || groupData.avatar,
        status: groupData.isPrivate ? "PRIVATE" : "PUBLIC",
        tags: response.data.tags || groupData.tags,
        max_members: groupData.maxMembers,
      });
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to update group";
      setError(errorMsg);
      console.error("Error updating group:", err, "Response:", JSON.stringify(err.response?.data, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle group deletion
  const handleDeleteGroup = async () => {
    if (!window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const csrfToken = await getCsrfToken();
      const headers = { 
        "Authorization": `Bearer ${accessToken}`,
        "X-CSRFToken": csrfToken 
      };
      await axios.delete(
        `https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/groups/${group.id}/`,
        {
          headers,
          withCredentials: true,
        }
      );
      console.log("Group deleted successfully");
      onUpdateGroup(null);
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to delete group";
      setError(errorMsg);
      console.error("Error deleting group:", err, "Response:", JSON.stringify(err.response?.data, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGroupData({ ...groupData, avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle tags
  const handleAddTag = async () => {
    if (newTag.trim() && !groupData.tags.some(tag => tag.name.toLowerCase() === newTag.trim().toLowerCase())) {
      try {
        setIsLoading(true);
        setError(null);
        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token available");
        }
        const csrfToken = await getCsrfToken();
        const headers = { 
          "Authorization": `Bearer ${accessToken}`,
          "X-CSRFToken": csrfToken 
        };
        const response = await axios.post(
          `https://nexus-test-api-8bf398f16fc4.herokuapp.com/chats/tags/`,
          { name: newTag.trim() },
          {
            headers,
            withCredentials: true,
          }
        );
        console.log("Tag created:", JSON.stringify(response.data, null, 2));
        setGroupData({
          ...groupData,
          tags: [...groupData.tags, { id: response.data.id, name: response.data.name }],
        });
        setNewTag("");
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to add tag");
        console.error("Error adding tag:", err, "Response:", JSON.stringify(err.response?.data, null, 2));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveTag = (tagId) => {
    setGroupData({
      ...groupData,
      tags: groupData.tags.filter((tag) => tag.id !== tagId),
    });
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      member.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "owner":
        return <Crown size={14} className="set-role-icon set-owner" />;
      case "admin":
        return <Shield size={14} className="set-role-icon set-admin" />;
      default:
        return <User size={14} className="set-role-icon set-member" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="set-group-settings-overlay">
      <div className="set-group-settings-modal">
        <div className="set-modal-header">
          <h2>Group Settings</h2>
          <button className="set-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="set-error-message">
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="set-loading">
            <p>Loading...</p>
          </div>
        )}

        <div className="set-modal-tabs">
          <button
            className={`set-tab-btn ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            <UserPlus size={16} />
            Join Requests
            {joinRequests.length > 0 && <span className="set-tab-badge">{joinRequests.length}</span>}
          </button>
          <button
            className={`set-tab-btn ${activeTab === "members" ? "active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            <Users size={16} />
            Members
          </button>
          <button
            className={`set-tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>

        <div className="set-modal-content">
          {activeTab === "requests" && (
            <div className="set-requests-tab">
              <div className="set-tab-header">
                <h3>Pending Join Requests</h3>
                <p className="set-tab-description">Review and manage users who want to join your group</p>
              </div>

              {joinRequests.length === 0 ? (
                <div className="set-empty-state">
                  <UserPlus size={48} />
                  <h4>No pending requests</h4>
                  <p>When users request to join your private group, they'll appear here.</p>
                </div>
              ) : (
                <div className="set-requests-list">
                  {joinRequests.map((request) => (
                    <div key={request.id} className="set-request-item">
                      <div className="set-request-user">
                        <div className="set-user-avatar">
                          <img src={request.user.avatar} alt={request.user.name} />
                        </div>
                        <div className="set-user-info">
                          <h4>{request.user.name}</h4>
                          <p className="set-user-email">{request.user.email}</p>
                        </div>
                      </div>

                      <div className="set-request-message">
                        <p>"{request.message}"</p>
                        <span className="set-request-date">Requested {formatDate(request.requestDate)}</span>
                      </div>

                      <div className="set-request-actions">
                        <button
                          className="set-approve-btn"
                          onClick={() => handleApproveRequest(request.id)}
                          disabled={isLoading}
                        >
                          <Check size={16} />
                          Approve
                        </button>
                        <button
                          className="set-reject-btn"
                          onClick={() => handleRejectRequest(request.id)}
                          disabled={isLoading}
                        >
                          <X size={16} />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "members" && (
            <div className="set-members-tab">
              <div className="set-tab-header">
                <h3>Group Members ({members.length})</h3>
                <div className="set-member-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="set-members-list">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="set-member-item">
                    <div className="set-member-user">
                      <div className="set-user-avatar">
                        <img src={member.avatar} alt={member.name} />
                        <div className={`set-status-indicator ${member.status}`}></div>
                      </div>
                      <div className="set-user-info">
                        <div className="set-user-name">
                          {member.name}
                          {getRoleIcon(member.role)}
                        </div>
                        <p className="set-user-email">{member.email}</p>
                        <div className="set-user-details">
                          <span>Joined {formatDate(member.joinDate)}</span>
                        </div>
                      </div>
                    </div>

                    {member.id !== currentUser?.chat_user_id && (
                      <div className="set-member-actions">
                        <select
                          value={member.role}
                          onChange={(e) => handleChangeRole(member.id, e.target.value)}
                          className="set-role-select"
                          disabled={isLoading}
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                          {member.role === "owner" && <option value="owner">Owner</option>}
                        </select>
                        <button
                          className="set-remove-btn"
                          onClick={() => handleRemoveMember(member.id)}
                          title="Remove member"
                          disabled={isLoading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="set-settings-tab">
              <div className="set-settings-section">
                <h3>Group Information</h3>

                <div className="set-setting-item">
                  <label>Group Icon</label>
                  <div className="set-avatar-upload">
                    <div className="set-current-avatar">
                      <img src={groupData.avatar || "/placeholder.svg"} alt="Group avatar" />
                    </div>
                    <button className="set-upload-btn" onClick={() => fileInputRef.current?.click()}>
                      <Camera size={16} />
                      Change Icon
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>

                <div className="set-setting-item">
                  <label>Group Name</label>
                  <input
                    type="text"
                    value={groupData.name}
                    onChange={(e) => setGroupData({ ...groupData, name: e.target.value })}
                    placeholder="Enter group name"
                  />
                </div>

                <div className="set-setting-item">
                  <label>Description</label>
                  <textarea
                    value={groupData.description}
                    onChange={(e) => setGroupData({ ...groupData, description: e.target.value })}
                    placeholder="Describe your group's purpose and goals"
                    rows={4}
                  />
                  <span className="set-char-count">{groupData.description.length}/500</span>
                </div>
              </div>

              <div className="set-settings-section">
                <h3>Privacy & Access</h3>

                <div className="set-setting-item">
                  <div className="set-privacy-toggle">
                    <div className="set-toggle-info">
                      <label>Group Privacy</label>
                      <p>
                        {groupData.isPrivate
                          ? "Private groups require approval to join"
                          : "Public groups allow anyone to join instantly"}
                      </p>
                    </div>
                    <button
                      className={`set-toggle-btn ${groupData.isPrivate ? "private" : "public"}`}
                      onClick={() => setGroupData({ ...groupData, isPrivate: !groupData.isPrivate })}
                    >
                      {groupData.isPrivate ? <Lock size={16} /> : <Globe size={16} />}
                      {groupData.isPrivate ? "Private" : "Public"}
                    </button>
                  </div>
                </div>

                <div className="set-setting-item">
                  <label>Maximum Members</label>
                  <div className="set-member-limit">
                    <button
                      className="set-limit-btn"
                      onClick={() => setGroupData({ ...groupData, maxMembers: Math.max(5, groupData.maxMembers - 5) })}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="set-limit-value">{groupData.maxMembers}</span>
                    <button
                      className="set-limit-btn"
                      onClick={() =>
                        setGroupData({ ...groupData, maxMembers: Math.min(200, groupData.maxMembers + 5) })
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="set-limit-note">Current members: {members.length}</p>
                </div>
              </div>

              <div className="set-settings-section">
                <h3>Tags & Topics</h3>

                <div className="set-setting-item">
                  <label>Study Topics</label>
                  <div className="set-tags-container">
                    {groupData.tags.map((tag) => (
                      <div key={tag.id} className="set-tag-item">
                        <Hash size={12} />
                        {tag.name}
                        <button className="set-remove-tag" onClick={() => handleRemoveTag(tag.id)}>
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="set-add-tag">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a topic tag"
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <button className="set-add-tag-btn" onClick={handleAddTag} disabled={isLoading}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="set-settings-section">
                <h3>Danger Zone</h3>
                <div className="set-setting-item">
                  <label>Delete Group</label>
                  <button className="set-delete-btn" onClick={handleDeleteGroup} disabled={isLoading}>
                    <Trash2 size={16} />
                    Delete Group
                  </button>
                </div>
              </div>

              <div className="set-settings-actions">
                <button className="set-cancel-btn" onClick={onClose} disabled={isLoading}>
                  Cancel
                </button>
                <button className="set-save-btn" onClick={handleSaveSettings} disabled={isLoading}>
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupSettingsModal;