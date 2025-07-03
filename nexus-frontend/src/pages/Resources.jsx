"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Filter, BookOpen, FileText, Download } from "lucide-react"
import "./Resources.css"
import axios from 'axios';

// API base URL from environment variables
const API_BASE_URL = 'https://nexus-test-api-8bf398f16fc4.herokuapp.com'; // Using HTTPS for secure connection

// Create a custom axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For CSRF token and session cookies
  xsrfHeaderName: 'X-CSRFToken',
  xsrfCookieName: 'csrftoken',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  // Enable sending credentials with CORS requests
  withCredentials: true,
  // Add CORS headers
  crossDomain: true,
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor to include the CSRF token
apiClient.interceptors.request.use(
  config => {
    // Only add the X-CSRFToken header for non-GET requests
    if (config.method !== 'get' && config.method !== 'GET') {
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
      
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.config.url);
      return Promise.reject({ ...error, message: 'Request timed out. Please try again.' });
    }
    return Promise.reject(error);
  }
);

// Function to test API connection
const testApiConnection = async () => {
  try {
    console.log('Testing API connection to:', `${API_BASE_URL}/api/resources/test-connection/`);
    const response = await apiClient.get('/api/resources/test-connection/');
    console.log('API Connection Test Success:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Connection Test Failed:', {
      message: error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      },
      response: error.response?.data,
    });
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

// Map backend category values to frontend display names
const categoryMap = {
  'books': 'Actuarial Books',
  'papers': 'Research Papers',
  'exams': 'Past Exams',
  'guides': 'Study Guides',
  'other': 'Other Resources'
};

// Map backend organization values to frontend display names
const organizationMap = {
  'soa': 'Society of Actuaries (SOA)',
  'ifoa': 'Institute and Faculty of Actuaries (IFOA)',
  'cas': 'Casualty Actuarial Society (CAS)',
  'general': 'General'
};

// Organization options
const organizationOptions = [
  { id: "all", name: "All Organizations" },
  { id: "soa", name: "Society of Actuaries (SOA)" },
  { id: "ifoa", name: "Institute and Faculty of Actuaries (IFOA)" },
  { id: "cas", name: "Casualty Actuarial Society (CAS)" }
];

// Category options
const categoryOptions = [
  { id: "all", name: "All Categories" },
  { id: "books", name: "Books" },
  { id: "papers", name: "Research Papers" },
  { id: "exams", name: "Past Exams" },
  { id: "guides", name: "Study Guides" }
];

// Type options (access type)
const typeOptions = [
  { id: "all", name: "All Types" },
  { id: "free", name: "Free Resources" },
  { id: "premium", name: "Premium Resources" }
];

// Map frontend filter values to backend query parameters
const mapToBackendFilters = (org, category, type) => {
  const params = new URLSearchParams();
  
  if (org && org !== 'all') {
    params.append('organization', org);
  }
  
  if (category && category !== 'all') {
    params.append('category', category);
  }
  
  if (type && type !== 'all') {
    params.append('is_premium', type === 'premium');
  }
  
  return params.toString();
};

const Resources = () => {
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Format resource data for display
  const formatResource = (resource) => ({
    ...resource,
    // Map backend category to frontend display name
    categoryDisplay: categoryMap[resource.category] || resource.category,
    // Map organization to display name
    organizationDisplay: organizationMap[resource.organization] || resource.organization,
    // Set type based on is_premium
    type: resource.is_premium ? 'premium' : 'free',
    // Set download URL
    downloadUrl: resource.download_url || '#',
    // Use cover image URL if available, otherwise use a default
    // coverImage: resource.coverImage || "/assets/default-cover.jpg"
  });

  // Fetch resources from the API
  const fetchResources = async (org = selectedOrg, category = selectedCategory, type = selectedType, search = searchQuery) => {
    setIsLoading(true);
    setError(null);
    
    let url = '/api/resources/resources/';
    const params = new URLSearchParams();
    
    // Add filters to query params
    if (org && org !== 'all') {
      params.append('organization', org);
    }
    
    if (category && category !== 'all') {
      params.append('category', category);
    }
    
    if (type && type !== 'all') {
      if (type === 'premium') {
        params.append('is_premium', 'true');
      } else if (type === 'free') {
        params.append('is_premium', 'false');
      }
    }
    
    // Add search query if provided
    if (search && search.trim() !== '') {
      params.append('search', search.trim());
    }
    
    console.log('Fetching resources with params:', params.toString());
    
    try {
      const response = await apiClient.get(url, { 
        params,
        validateStatus: (status) => status < 500 // Don't throw for 4xx errors
      });
      
      // Handle 4xx errors
      if (response.status >= 400) {
        const errorMsg = response.data?.detail || 'Failed to fetch resources';
        throw new Error(`API Error (${response.status}): ${errorMsg}`);
      }
      
      // Handle both array and paginated responses
      const resourcesData = Array.isArray(response.data) ? 
        response.data : 
        (response.data?.results || response.data);
      
      if (!resourcesData) {
        throw new Error('Invalid response format from server');
      }
      
      const formattedResources = Array.isArray(resourcesData) ? 
        resourcesData.map(formatResource) : 
        [formatResource(resourcesData)];
      
      setResources(formattedResources);
      setFilteredResources(formattedResources);
      return formattedResources;
    } catch (error) {
      console.error('API request failed:', {
        message: error.message,
        url: error.config?.url,
        params: error.config?.params,
        response: error.response?.data,
      });
      
      let errorMessage = 'Failed to load resources';
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.detail || error.response.statusText || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else {
        // Other errors (e.g., network errors)
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
      setResources([]);
      setFilteredResources([]);
      throw error; // Re-throw to be caught by the caller
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchResources(selectedOrg, selectedCategory, selectedType, searchQuery);
  }, []);

  // Initialize and handle filter changes
  useEffect(() => {
    // Test API connection on initial load
    const initialize = async () => {
      // Only test connection on initial load
      if (!resources.length) {
        const result = await testApiConnection();
        if (!result.success) {
          setError(`Failed to connect to the API: ${result.error?.message || 'Unknown error'}`);
          return;
        }
      }
      
      // Fetch resources with current filters
      try {
        await fetchResources(selectedOrg, selectedCategory, selectedType, searchQuery);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources. Please try again later.');
      }
    };
    
    initialize();
  }, [selectedOrg, selectedCategory, selectedType, searchQuery]);

  // Handle download button click
  const handleDownload = async (resourceId, isPremium = false) => {
    console.log('Starting download for resource:', resourceId);
    
    // Check if already downloading
    if (downloadingId === resourceId) return;
    
    // Check if user is logged in for premium resources
    if (isPremium && !user) {
      const errorMsg = 'Please sign in to download premium resources';
      console.log(errorMsg);
      setError(errorMsg);
      setShowLoginModal(true);
      return;
    }
    
    try {
      setDownloadingId(resourceId);
      setError(null);
      
      const downloadUrl = `/api/resources/resources/${resourceId}/download/`;
      console.log('Making download request to:', downloadUrl);
      
      // Make API request to get the file
      const response = await apiClient.get(downloadUrl, {
        responseType: 'blob',
      });
      
      console.log('Download response received:', {
        status: response.status,
        headers: response.headers,
        dataType: response.data?.constructor.name
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      // Create a blob URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      
      // Get the resource to access its title
      const resource = resources.find(r => r.id === resourceId);
      
      // Create a safe filename from the resource title or use a default
      let filename = 'document.pdf';
      if (resource && resource.title) {
        // Remove special characters and replace spaces with underscores
        const cleanTitle = resource.title
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '_')      // Replace spaces with underscores
          .toLowerCase();             // Convert to lowercase
        filename = `${cleanTitle}.pdf`;
      }
      
      // If we have a content-disposition header, use that filename instead
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch != null && filenameMatch[1]) { 
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      console.log('Triggering download for file:', filename);
      
      // Set download attributes and trigger click
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      link.remove();
      
      // Show success message
      console.log('Download started successfully!');
      
      // Reset downloading state after a short delay
      setTimeout(() => {
        setDownloadingId(null);
      }, 5000);
      
    } catch (error) {
      console.error('Download error:', {
        error,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data
        } : 'No response data'
      });
      
      let errorMessage = 'Failed to download the file. Please try again.';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Please sign in to download this resource';
          setShowLoginModal(true);
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to download this resource';
        } else if (error.response.status === 404) {
          errorMessage = 'The requested resource was not found';
        } else if (error.response.data) {
          // Try to parse error message if it's a Blob
          if (error.response.data instanceof Blob) {
            try {
              const errorText = await error.response.data.text();
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.detail || errorMessage;
            } catch (e) {
              console.error('Error parsing error response:', e);
            }
          } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Download failed:', errorMessage);
      setError(errorMessage);
      setDownloadingId(null);
    } finally {
      // Removed setDownloadingId(null) from here
    }
  };

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle organization filter change
  const handleOrgChange = (orgId) => {
    setSelectedOrg(orgId);
  };

  // Handle category filter change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Handle type filter change
  const handleTypeChange = (typeId) => {
    setSelectedType(typeId);
  };

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchResources(selectedOrg, selectedCategory, selectedType, searchQuery);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  // Handle filter changes
  useEffect(() => {
    fetchResources(selectedOrg, selectedCategory, selectedType, searchQuery);
  }, [selectedOrg, selectedCategory, selectedType]);

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Resource Library</h1>
        <p>Access actuarial books, papers, and exam materials from leading organizations</p>
        
        <div className="resources-search">
          <div className="search-input-container">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by title, author, or description..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
              disabled={isLoading}
            />
          </div>
          
          {/* Organization Filter */}
          <div className="filter-container">
            <Filter size={18} />
            <select 
              value={selectedOrg} 
              onChange={(e) => handleOrgChange(e.target.value)}
              className="filter-select"
              disabled={isLoading}
            >
              {organizationOptions.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Category Filter */}
          <div className="filter-container">
            <BookOpen size={18} />
            <select 
              value={selectedCategory} 
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="filter-select"
              disabled={isLoading}
            >
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Type Filter */}
          <div className="filter-container">
            <FileText size={18} />
            <select 
              value={selectedType} 
              onChange={(e) => handleTypeChange(e.target.value)}
              className="filter-select"
              disabled={isLoading}
            >
              {typeOptions.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Loading and Error States */}
      {isLoading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading resources...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={() => fetchResources()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="resources-container">
          <div className="resources-grid">
            {filteredResources && filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-image-container">
                    {resource.coverImage ? (
                      <img
                        src={resource.coverImage}
                        alt={resource.title}
                        className="resource-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="resource-image-placeholder">
                        <FileText size={48} />
                      </div>
                    )}
                    {resource.isPremium && (
                      <div className="premium-badge">Premium</div>
                    )}
                  </div>
                  <div className="resource-content">
                    <div className="resource-meta">
                      <span className="resource-org">
                        {organizationMap[resource.organization] || resource.organization}
                      </span>
                      <span className="resource-category">
                        {categoryMap[resource.category] || resource.category}
                      </span>
                    </div>
                    <h3 className="resource-title">{resource.title}</h3>
                    <p className="resource-author">By {resource.author}</p>
                    <p className="resource-description">
                      {resource.description && resource.description.length > 150 
                        ? `${resource.description.substring(0, 150)}...` 
                        : resource.description || 'No description available'}
                    </p>
                    <div className="resource-actions">
                      <button
                        className={`download-btn ${resource.isPremium ? 'premium-btn' : ''}`}
                        onClick={() => handleDownload(resource.id, resource.isPremium)}
                        disabled={isLoading}
                        title={`Download ${resource.title}`}
                        style={{ cursor: isLoading ? 'wait' : 'pointer' }}
                      >
                        {downloadingId === resource.id ? (
                          <span>Downloading...</span>
                        ) : (
                          <>
                            <Download size={16} /> 
                            {resource.isPremium ? 'Download (Premium)' : 'Download'}
                          </>
                        )}
                      </button>
                      <button 
                        className="view-btn"
                        onClick={() => navigate(`/resources/${resource.id}`)}
                        title={`View details for ${resource.title}`}
                      >
                        <FileText size={16} /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No resources found matching your criteria.</p>
                <button 
                  className="btn-clear-filters"
                  onClick={() => {
                    setSelectedOrg('all');
                    setSelectedCategory('all');
                    setSelectedType('all');
                    setSearchQuery('');
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
          
          {filteredResources && filteredResources.length > 0 && (
            <div className="pagination-controls">
              <button disabled={true} className="pagination-btn">
                Previous
              </button>
              <span className="page-info">Page 1</span>
              <button className="pagination-btn">
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Resources
