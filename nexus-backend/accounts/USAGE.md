# Nexus Authentication System README

This document explains the login and registration functionality in the Nexus application, a platform for actuarial professionals. It covers the frontend and backend implementation, the authentication flow using JWT with HTTP-only cookies, and how to interact with the API using Postman.

## Table of Contents
- [Overview](#overview)
- [Frontend Implementation](#frontend-implementation)
  - [Login.jsx](#loginjsx)
  - [UserContext.jsx](#usercontextjsx)
- [Backend Implementation](#backend-implementation)
  - [Models](#models)
  - [Serializers](#serializers)
  - [Views](#views)
  - [Settings](#settings)
- [Authentication Flow](#authentication-flow)
  - [Registration](#registration)
  - [Login](#login)
  - [Protected Routes](#protected-routes)
  - [Token Refresh](#token-refresh)
  - [Logout](#logout)
- [Interacting with the API Using Postman](#interacting-with-the-api-using-postman)
  - [Setup](#setup)
  - [Register a User](#register-a-user)
  - [Login](#login)
  - [Access Protected Endpoint](#access-protected-endpoint)
  - [Refresh Token](#refresh-token)
  - [Logout](#logout)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)

## Overview

The Nexus authentication system allows users to register and log in to access premium actuarial resources. It uses:
- **Frontend**: React with `Login.jsx` for a combined login/signup form and `UserContext.jsx` for state management. The frontend runs on `http://localhost:5173`.
- **Backend**: Django REST Framework with SimpleJWT for token-based authentication, extended to use HTTP-only cookies for `access_token` and `refresh_token`. The backend runs on `http://127.0.0.1:8000`.
- **Authentication**: JWT tokens stored in HTTP-only cookies (`access_token` for authentication, `refresh_token` for refreshing access tokens). User data is stored in `localStorage` as `nexus_user`.
- **Additional Features**: Supports `full_name`, `email`, `password`, `confirmPassword`, `gender`, and `education` for registration, with `gender` and `education` stored in a `Profile` model.

## Frontend Implementation

### Login.jsx
Located in `src/pages/Login.jsx`, this component handles both login and signup in a single form, toggled by the `isSignUp` state.

- **Features**:
  - **Signup Form**: Collects `fullName`, `email`, `password`, `confirmPassword`, `gender`, and `education`.
  - **Login Form**: Collects `email` and `password`.
  - Toggles between login and signup with a button.
  - Displays error messages (e.g., "Passwords do not match", "Invalid email or password").
  - Includes social login placeholders (Google, Facebook, not implemented).
  - Uses `MathClock` component for visual decoration.
- **Key Logic**:
  - Uses `useState` for form data and error handling.
  - Calls `register` or `login` from `useUser` (from `UserContext`) based on `isSignUp`.
  - Redirects to `/` on success using `useNavigate`.
- **API Calls**:
  - Signup: Calls `register(fullName, email, password, confirmPassword, gender, education)`.
  - Login: Calls `login(email, password)`.

### UserContext.jsx
Located in `src/context/UserContext.jsx`, this provides a React context for managing authentication state and API calls.

- **State**:
  - `user`: Stores user data (`id`, `email`, `first_name`, `last_name`, `gender`, `education`) from `localStorage`.
  - `isAuthenticated`: Tracks login status.
- **Functions**:
  - `login(email, password)`: Sends POST to `/auth/token/`, stores user data in `localStorage`, and updates state.
  - `register(fullName, email, password, confirmPassword, gender, education)`: Sends POST to `/auth/register/`, stores user data, and updates state.
  - `logout()`: Sends POST to `/auth/logout/`, clears state and `localStorage`.
  - `refreshToken()`: Sends POST to `/auth/token/refresh/` to renew `access_token`.
  - `checkAuth()`: Sends GET to `/protected/` to verify authentication.
- **Axios Configuration**:
  - Sets `axios.defaults.withCredentials = true` to include cookies in requests.

## Backend Implementation

### Models
Located in `auth/models.py`.

- **User**: Django’s default `User` model, extended with a unique email constraint. `username` is set to `email` for simplicity.
- **Profile**: Custom model with a one-to-one relationship to `User`, storing:
  - `gender`: Choices (`male`, `female`, `other`, `prefer-not-to-say`).
  - `education`: Choices (`undergraduate`, `graduate`, `postgraduate`, `professional`).

### Serializers
Located in `auth/serializers.py`.

- **RegisterSerializer**:
  - Fields: `full_name`, `email`, `password`, `password2`, `gender`, `education`.
  - Validates: Email uniqueness, password match, password strength.
  - Creates: `User` (maps `full_name` to `first_name`/`last_name`, sets `username=email`) and `Profile` (stores `gender`, `education`).

### Views
Located in `auth/views.py`.

- **RegisterView**:
  - Endpoint: `POST http://127.0.0.1:8000/auth/register/`
  - Uses `RegisterSerializer` to create user and profile.
  - Returns user data and sets HTTP-only cookies (`access_token`, `refresh_token`).
- **CustomTokenObtainPairView**:
  - Endpoint: `POST http://127.0.0.1:8000/auth/token/`
  - Authenticates via `email` and `password`.
  - Returns user data and sets cookies.
- **ProtectedView**:
  - Endpoint: `GET http://127.0.0.1:8000/auth/protected/`
  - Requires authentication (verifies `access_token`).
- **LogoutView**:
  - Endpoint: `POST http://127.0.0.1:8000/auth/logout/`
  - Deletes cookies.
- **TokenRefreshView** (SimpleJWT default):
  - Endpoint: `POST http://127.0.0.1:8000/auth/token/refresh/`
  - Refreshes `access_token` using `refresh_token`.

### Settings
Located in `settings.py`.

- **CORS**:
  - `CORS_ALLOWED_ORIGINS`: Includes `http://localhost:5173`, `http://127.0.0.1:8000`.
  - `CORS_ALLOW_CREDENTIALS = True` to allow cookies.
- **SimpleJWT**:
  - `ACCESS_TOKEN_LIFETIME`: 1 hour.
  - `REFRESH_TOKEN_LIFETIME`: 1 day.
  - `AUTH_COOKIE_SAME_SITE`: `"None"` for cross-site cookies.
  - `AUTH_COOKIE_SECURE`: `False` (local dev; `True` in production).
- **Middleware**: Includes `corsheaders.middleware.CorsMiddleware`.

## Authentication Flow

### Registration
1. **Frontend**:
   - User fills out signup form in `Login.jsx` (`fullName`, `email`, `password`, `confirmPassword`, `gender`, `education`).
   - Submits form, triggering `register` in `UserContext.jsx`.
   - Sends POST to `http://127.0.0.1:8000/auth/register/` with:
     ```json
     {
       "full_name": "John Doe",
       "email": "john@example.com",
       "password": "securepass123",
       "password2": "securepass123",
       "gender": "male",
       "education": "undergraduate"
     }

2. **Backend**:
    - RegisterView validates data using RegisterSerializer.
    - Creates User (sets username=email, splits full_name into first_name/last_name).
    - Creates Profile with gender and education.
    - Generates JWT tokens (access_token, refresh_token).
    - Returns:

    ```json
    {
        "message": "User registered",
            "user": {
                "id": 1,
                "email": "john@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "gender": "male",
                "education": "undergraduate"
            }
    }
- Sets HTTP-only cookies: access_token (1 hour), refresh_token (1 day).

3. **Frontend**:
    - UserContext.jsx stores user data in localStorage as nexus_user.
    - Updates user and isAuthenticated state.
    - Redirects to /.

### Login
1. **Frontend**:
    - User fills out login form (email, password).
    - Submits form, triggering login in UserContext.jsx.
    - Sends POST to http://127.0.0.1:8000/auth/token/ with:
    
    ```json
    {
        
        "email": "john@example.com",
        "password": "securepass123"

    }

2. **Backend**:
    - CustomTokenObtainPairView authenticates user by email.
    - Generates JWT tokens.
    - Returns:

    ```json
    {
        
        "user": {
            "id": 1,
            "email": "john@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "gender": "male",
            "education": "undergraduate"
        }

    }
- Sets HTTP-only cookies.

3. **Frontend**:
    - Stores user data in localStorage.
    - Updates state and redirects to /.

### Protected Routes

1. **Frontend**:
    -   checkAuth in UserContext.jsx sends GET to /protected/ with cookies.

2. **Backend**:
    - ProtectedView verifies access_token.
    - Returns { "message": "Authenticated" } if valid.

3. **Frontend**:
    - Maintains isAuthenticated state.

### Token Refresh
1. **Frontend**:
    - If access_token expires, refreshToken sends POST to /auth/token/refresh/.

2. **Bakcend**: 
    - Validates refresh_token and issues new access_token.

3. **Frontend**:
    - Updates cookies and maintains session.


### Logout
1. **Frontend**:
    - logout sends POST to /auth/logout/.
    - Clears localStorage and state.

2. **Backend**: 
    - LogoutView deletes cookies.
    - Returns { "message": "Logged out" }.

## Interacting with the API Using Postman

### Setup
1. **Navigate to postman**: [postman.com](https://www.postman.com/)
2. **Start servers**:
- **backend**:  `python manage.py runserver`
- **frontend**: npm run dev
    - if first time running the frontend, proceed:
    ```bash
        npm install
        npm run dev
- else
    ```bash
        npm install
