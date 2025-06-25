// context/UserContext.jsx
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

  const fetchCsrfToken = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        // Trigger Django to set the csrf cookie
        await axios.get("https://127.0.0.1:8000/auth/csrf/", {
          withCredentials: true,
        });

        console.log("Document cookie:", document.cookie);

        const csrfToken = getCookie("csrftoken");
        if (csrfToken) return csrfToken;

        throw new Error("CSRF cookie not set");
      } catch (error) {
        console.error(`CSRF fetch attempt ${i + 1} failed:`, error);
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("nexus_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        checkAuth();
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("nexus_user");
        setIsAuthenticated(false);
      }
    }
  }, []);

  const checkAuth = async () => {
    try {
      await axios.get("https://127.0.0.1:8000/auth/protected/", {
        withCredentials: true,
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Authentication check failed:", error);
      setIsAuthenticated(false);
      localStorage.removeItem("nexus_user");
      setUser(null);
    }

    await fetchChatUserId();

  };


  const fetchChatUserId = async () => {
  try {
    const response = await axios.get("https://127.0.0.1:8000/chats/api/me/", {
      withCredentials: true,
    });
    const chatUserId = response.data.id;

    // Update the user object with chat_user_id
    setUser(prev => {
      const updatedUser = { ...prev, chat_user_id: chatUserId };
      localStorage.setItem("nexus_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  } catch (err) {
    console.error("Failed to fetch ChatUser ID:", err);
  }
};


  const login = async (email, password) => {
    try {
      const csrfToken = await fetchCsrfToken();
      if (!csrfToken) throw new Error("Failed to fetch CSRF token");

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

      // Store user and access token in localStorage
      localStorage.setItem("nexus_user", JSON.stringify(user));
      localStorage.setItem("access_token", access);

      setUser(user);
      setIsAuthenticated(true);

      // 👉 Fetch the ChatUser ID after login
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

  const register = async (
    fullName,
    email,
    password,
    confirmPassword,
    gender,
    education
  ) => {
    try {
      const csrfToken = await fetchCsrfToken();
      if (!csrfToken) throw new Error("Failed to fetch CSRF token");

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
      const { user: userData } = response.data;

      localStorage.setItem("nexus_user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
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
        await axios.post(
          "https://127.0.0.1:8000/auth/logout/",
          {},
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        );
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("nexus_user");
    localStorage.removeItem("access_token");
  };

  const refreshToken = async () => {
    try {
      const csrfToken = await fetchCsrfToken();
      if (!csrfToken) throw new Error("Failed to fetch CSRF token");
      await axios.post(
        "https://127.0.0.1:8000/auth/token/refresh/",
        {},
        {
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      );
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, login, logout, register, refreshToken }}
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
const getAccessToken = () => localStorage.getItem("access_token");
