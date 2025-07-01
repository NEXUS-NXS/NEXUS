"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const getAccessToken = () => {
    const token = localStorage.getItem("access_token");
    console.log("Retrieved access token:", token);
    return token;
  };

  const fetchCsrfToken = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Fetching CSRF token (attempt ${i + 1})...`);
        await axios.get("https://127.0.0.1:8000/auth/csrf/", {
          withCredentials: true,
        });

        console.log("Document cookie:", document.cookie);
        const csrfToken = getCookie("csrftoken");
        if (csrfToken) {
          console.log("Fetched CSRF token:", csrfToken);
          return csrfToken;
        }

        throw new Error("CSRF cookie not set");
      } catch (error) {
        console.error(`CSRF fetch attempt ${i + 1} failed:`, error);
        if (error.response) {
          console.error("CSRF response data:", error.response.data);
          console.error("CSRF response status:", error.response.status);
        }
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    console.error("All CSRF fetch attempts failed");
    return null;
  };

  const checkAuth = async () => {
    try {
      console.log("Checking authentication...");
      await axios.get("https://127.0.0.1:8000/auth/protected/", {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        withCredentials: true,
      });
      console.log("Authentication check successful");
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Authentication check failed:", error);
      if (error.response) {
        console.error("Auth response data:", error.response.data);
        console.error("Auth response status:", error.response.status);
      }
      setIsAuthenticated(false);
      localStorage.removeItem("nexus_user");
      localStorage.removeItem("access_token");
      setUser(null);
    }
  };

  const fetchChatUserId = async () => {
    try {
      console.log("Fetching chat user ID...");
      const accessToken = getAccessToken();
      if (!accessToken) throw new Error("No access token for chat user ID fetch");
      const response = await axios.get("https://127.0.0.1:8000/chats/api/me/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      const chatUserId = response.data.id;
      console.log("Fetched chat user ID:", chatUserId);

      setUser((prev) => {
        if (!prev) return prev;
        const updatedUser = { ...prev, chat_user_id: chatUserId };
        localStorage.setItem("nexus_user", JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (err) {
      console.error("Failed to fetch ChatUser ID:", err);
      if (err.response) {
        console.error("Chat user response data:", err.response.data);
        console.error("Chat user response status:", err.response.status);
      }
    }
  };

  const login = async (email, password) => {
    try {
      const csrfToken = await fetchCsrfToken();
      if (!csrfToken) throw new Error("Failed to fetch CSRF token");

      console.log("Logging in with email:", email);
      const response = await axios.post(
        "https://127.0.0.1:8000/auth/token/",
        { email, password },
        {
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      );
      console.log("Login response:", response.data);

      const { user, access } = response.data;
      if (!user || !access) throw new Error("Incomplete login response");

      let profileId = null;
      let profilePhoto = null;
      try {
        console.log("Fetching profile...");
        const profileResponse = await axios.get(
          "https://127.0.0.1:8000/auth/api/profile/me/", // Use /profile/ for consistency with previous logs
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
            withCredentials: true,
          }
        );
        console.log("Profile response:", profileResponse.data);
        console.log("Results array:", profileResponse.data.results);
        if (profileResponse.data.results && profileResponse.data.results.length > 0) {
          profileId = profileResponse.data.results[0].id;
          profilePhoto = profileResponse.data.results[0].profile_photo || null;
          console.log("Extracted profileId:", profileId);
        } else {
          console.warn("No profile data found in response:", profileResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        if (error.response) {
          console.error("Profile response data:", error.response.data);
          console.error("Profile response status:", error.response.status);
        }
      }

      const userData = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: `${user.first_name} ${user.last_name}`.trim(),
        created_at: user.date_joined,
        profile_photo: profilePhoto,
        gender: user.gender || null,
        education: user.education || null,
        chat_user_id: null,
        profile_id: profileId,
      };

      console.log("Constructed user data:", userData);
      localStorage.setItem("nexus_user", JSON.stringify(userData));
      localStorage.setItem("access_token", access);

      setUser(userData);
      setIsAuthenticated(true);

      await fetchChatUserId();
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage =
        error.response?.data?.detail ||
        Object.values(error.response?.data || {})
          .flat()
          .join(" ") ||
        error.message ||
        "Login failed";
      throw new Error(errorMessage);
    }
  };

  const register = async (fullName, email, password, confirmPassword, gender, education) => {
    try {
      const csrfToken = await fetchCsrfToken();
      if (!csrfToken) throw new Error("Failed to fetch CSRF token");

      console.log("Registering with email:", email);
      const response = await axios.post(
        "https://127.0.0.1:8000/auth/register/",
        {
          full_name: fullName,
          email,
          password,
          password2: confirmPassword,
          gender,
          education,
        },
        {
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      );
      console.log("Register response:", response.data);

      const { user: userData, access } = response.data;
      if (!userData || !access) throw new Error("Incomplete registration response");

      let profileId = null;
      let profilePhoto = null;
      try {
        console.log("Fetching profile after registration...");
        const profileResponse = await axios.get(
          "https://127.0.0.1:8000/auth/api/profile/me/", // Use /profile/ for consistency
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
            withCredentials: true,
          }
        );
        console.log("Profile response:", profileResponse.data);
        console.log("Results array:", profileResponse.data.results);
        if (profileResponse.data.results && profileResponse.data.results.length > 0) {
          profileId = profileResponse.data.results[0].id;
          profilePhoto = profileResponse.data.results[0].profile_photo || null;
          console.log("Extracted profileId:", profileId);
        } else {
          console.warn("No profile data found in response:", profileResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        if (error.response) {
          console.error("Profile response data:", error.response.data);
          console.error("Profile response status:", error.response.status);
        }
      }

      const updatedUserData = {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        full_name: `${userData.first_name} ${userData.last_name}`.trim(),
        created_at: userData.date_joined,
        profile_photo: profilePhoto,
        gender: userData.gender || null,
        education: userData.education || null,
        chat_user_id: null,
        profile_id: profileId,
      };

      console.log("Constructed user data:", updatedUserData);
      localStorage.setItem("nexus_user", JSON.stringify(updatedUserData));
      localStorage.setItem("access_token", access);

      setUser(updatedUserData);
      setIsAuthenticated(true);

      await fetchChatUserId();
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage =
        error.response?.data?.detail ||
        Object.values(error.response?.data || {})
          .flat()
          .join(" ") ||
        error.message ||
        "Registration failed";
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      const csrfToken = await fetchCsrfToken();
      if (csrfToken) {
        console.log("Logging out with CSRF token:", csrfToken);
        await axios.post(
          "https://127.0.0.1:8000/auth/logout/",
          {},
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        );
        console.log("Logout request successful");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      if (error.response) {
        console.error("Logout response data:", error.response.data);
        console.error("Logout response status:", error.response.status);
      }
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("nexus_user");
    localStorage.removeItem("access_token");
    console.log("User logged out");
  };

  const refreshToken = async () => {
    try {
      const csrfToken = await fetchCsrfToken();
      if (!csrfToken) throw new Error("Failed to fetch CSRF token");
      console.log("Refreshing token with CSRF:", csrfToken);
      const response = await axios.post(
        "https://127.0.0.1:8000/auth/token/refresh/",
        {},
        {
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      );
      const newAccessToken = response.data.access;
      console.log("New access token:", newAccessToken);
      localStorage.setItem("access_token", newAccessToken);
      setIsAuthenticated(true);
      await checkAuth();
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      if (error.response) {
        console.error("Refresh response data:", error.response.data);
        console.error("Refresh response status:", error.response.status);
      }
      await logout();
      return false;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("nexus_user");
    const storedToken = localStorage.getItem("access_token");
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Restored user from localStorage:", parsedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        checkAuth();
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("nexus_user");
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
        refreshToken,
        fetchCsrfToken,
        getAccessToken,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};