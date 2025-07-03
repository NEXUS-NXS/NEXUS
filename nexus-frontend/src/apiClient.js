import axios from 'axios';

// Create axios instance with base URL and credentials
const apiClient = axios.create({
  baseURL: 'https://nexus-test-api-8bf398f16fc4.herokuapp.com', // Using HTTPS instead of HTTP
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the CSRF token
apiClient.interceptors.request.use(
  (config) => {
    // Get CSRF token from cookies
    const csrftoken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];

    // Add CSRF token to headers if it exists
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific status codes
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });

      // Handle 401 Unauthorized (e.g., redirect to login)
      if (error.response.status === 401) {
        // You might want to redirect to login or show a login modal
        console.warn('Unauthorized access - please login');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
