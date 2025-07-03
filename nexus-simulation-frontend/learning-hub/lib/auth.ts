// 📦 lib/auth.ts - Authentication utilities for Nexus Simulation Frontend
// Integrates with the main Nexus frontend authentication system

export interface User {
  id: string;
  email: string;
  full_name: string;
  chat_user_id?: string;
}

// Get authentication token from localStorage (shared with main frontend)
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// Set authentication token in localStorage
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
}

// Remove authentication token from localStorage
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('nexus_user');
}

// Get user data from localStorage (shared with main frontend)
export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem('nexus_user');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

// Set user data in localStorage
export function setUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('nexus_user', JSON.stringify(user));
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getAuthToken() !== null && getUser() !== null;
}

// Login function - redirect to main nexus frontend for authentication
export function redirectToLogin(): void {
  if (typeof window === 'undefined') return;
  
  // Redirect to the main Nexus frontend login page
  // The user will authenticate there and then can return to simulation platform
  const currentUrl = encodeURIComponent(window.location.href);
  window.location.href = `https://127.0.0.1:5173/login?redirect_to_simulation=${currentUrl}`;
}

// Handle cross-app authentication check
export async function checkAuthenticationStatus(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  const token = getAuthToken();
  const user = getUser();
  
  if (!token || !user) {
    return false;
  }
  
  try {
    // Verify token is still valid by making a protected request
    const response = await fetch('https://nexus-test-api-8bf398f16fc4.herokuapp.com/auth/protected/', {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Auth status check failed:', error);
    return false;
  }
}

// Logout function - calls main backend and cleans up local storage
export async function logout(): Promise<void> {
  try {
    const csrfToken = await fetchCsrfToken();
    if (csrfToken) {
      await fetch('https://nexus-test-api-8bf398f16fc4.herokuapp.com/auth/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Logout request failed:', error);
  } finally {
    removeAuthToken();
  }
}

// Get CSRF token from cookies (needed for Django)
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

// Fetch CSRF token from Django backend (compatible with main frontend)
export async function fetchCsrfToken(retries = 3, delay = 1000): Promise<string | null> {
  for (let i = 0; i < retries; i++) {
    try {
      // Trigger Django to set the csrf cookie (same endpoint as main frontend)
      await fetch('https://nexus-test-api-8bf398f16fc4.herokuapp.com/auth/csrf/', {
        credentials: 'include',
      });
      
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        return csrfToken;
      }
      
      throw new Error('CSRF cookie not set');
    } catch (error) {
      console.error(`CSRF fetch attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  return null;
}

// Initialize auth from URL parameters (if redirected from main frontend)
export function initializeAuthFromParams(): boolean {
  if (typeof window === 'undefined') return false;
  
  const urlParams = new URLSearchParams(window.location.search);
  const fromMainApp = urlParams.get('from_main_app');
  
  if (fromMainApp === 'true') {
    // User is coming from main app, they should already have auth in localStorage
    const token = getAuthToken();
    const user = getUser();
    
    if (token && user) {
      // Clean up URL parameters
      urlParams.delete('from_main_app');
      const newUrl = urlParams.toString() 
        ? `${window.location.pathname}?${urlParams.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      return true;
    }
  }
  
  return false;
}
