import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import apiClient from '../apiClient';
import './ResourceDetails.css';

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Extract metadata from resource description or other fields
  const extractMetadata = (resource) => {
    if (!resource) return {};
    
    const metadata = {};
    
    // If we have a description, try to extract metadata from it
    if (resource.description) {
      // Common metadata patterns
      const patterns = {
        pages: /Pages?:\s*(\d+)/i,
        author: /(?:By|Author|Creator)[\s:]+([^\n<]+)/i,
        version: /(?:Version|PDF Version)[\s:]+([\d.]+)/i,
        subject: /Subject[\s:]+([^\n<]+)/i,
        producer: /Producer[\s:]+([^\n<]+)/i,
        creator: /Creator[\s:]+([^\n<]+)/i,
        keywords: /Keywords[\s:]+([^\n<]+)/i,
        language: /Language[\s:]+([^\n<]+)/i,
        isbn: /(?:ISBN|isbn)[\s:]+([0-9\-\s]+)/i,
        publisher: /Publisher[\s:]+([^\n<]+)/i
      };
      
      // Apply patterns to extract metadata
      Object.entries(patterns).forEach(([key, pattern]) => {
        const match = resource.description.match(pattern);
        if (match) {
          if (key === 'keywords') {
            metadata[key] = match[1].split(/[,\s]+/).filter(k => k.trim() !== '');
          } else if (key === 'pages') {
            metadata[key] = parseInt(match[1], 10);
          } else {
            metadata[key] = match[1].trim();
          }
        }
      });
      
      // Extract dates in various formats
      const datePatterns = [
        /(?:Date|Created|Modified)[\s:]+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i,
        /(?:Date|Created|Modified)[\s:]+(\d{4}-\d{2}-\d{2})/i,
        /(?:Date|Created|Modified)[\s:]+(\d{2}\/\d{2}\/\d{4})/i
      ];
      
      datePatterns.some(pattern => {
        const match = resource.description.match(pattern);
        if (match) {
          metadata.date = match[1];
          return true; // Stop after first match
        }
        return false;
      });
    }
    
    // Add file metadata if available
    if (resource.file_size) {
      metadata.file_size = resource.file_size;
    }
    if (resource.created_at) {
      metadata.created = resource.created_at;
    }
    if (resource.modified) {
      metadata.modified = resource.modified;
    }
    
    return metadata;
  };
  
  const metadata = resource ? extractMetadata(resource) : {};

  useEffect(() => {
    const fetchResource = async () => {
      try {
        console.log(`Fetching resource with ID: ${id}`);
        const response = await apiClient.get(`/api/resources/resources/${id}/`);
        console.log('Resource data received:', response.data);
        setResource(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.detail || 
                          err.message || 
                          'Failed to load resource details';
        console.error('Error fetching resource:', {
          error: err,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResource();
    } else {
      setError('No resource ID provided');
      setLoading(false);
    }
  }, [id]);

  const handleDownload = async () => {
    if (!resource) return;
    
    setDownloading(true);
    try {
      const response = await apiClient.get(`/api/resources/resources/${id}/download/`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Create a safe filename
      const cleanTitle = resource.title
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase();
      const filename = `${cleanTitle}.pdf`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download resource');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading resource details...</div>;
  }

  if (error || !resource) {
    return (
      <div className="error-state">
        {error || 'Resource not found'}
        <button 
          onClick={() => navigate('/resources')}
          className="error-button"
        >
          Back to Resources
        </button>
      </div>
    );
  }

  return (
    <div className="resource-details-container">
      <div className="resource-details">
        <button
          onClick={() => navigate('/resources')}
          className="back-button"
        >
          <ArrowLeft size={18} />
          <span>Back to Resources</span>
        </button>

        <div className="resource-card">
          <div className="resource-content">
            <div className="resource-header">
              <div className="resource-info">
                <div className="resource-badges">
                  {resource.category && (
                    <span className="category-badge">
                      {resource.category}
                    </span>
                  )}
                  {resource.is_premium && (
                    <span className="premium-badge">
                      Premium
                    </span>
                  )}
                </div>
                <h1 className="resource-title">{resource.title}</h1>
                {resource.author && (
                  <p className="resource-author">By {resource.author}</p>
                )}
                
                <div className="resource-meta">
                  {resource.organization && (
                    <div className="meta-item">
                      <span>Organization:</span>
                      <span>{resource.organization}</span>
                    </div>
                  )}
                  {resource.resource_type && (
                    <div className="meta-item">
                      <span>Type:</span>
                      <span>{resource.resource_type}</span>
                    </div>
                  )}
                  {resource.created_at && (
                    <div className="meta-item">
                      <span>Added:</span>
                      <span>
                        {new Date(resource.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="download-container">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className={`download-button ${downloading ? 'disabled' : ''}`}
                >
                  <Download size={18} />
                  {downloading ? 'Downloading...' : 'Download PDF'}
                </button>
              </div>
            </div>

            <div className="details-grid">
              <div className="content-wrapper">
                {resource.description && (
                  <div className="description-section">
                    <h2 className="section-title">Description</h2>
                    <p className="description-text">{resource.description}</p>
                  </div>
                )}

                {/* PDF Metadata Section */}
                <div className="metadata-section">
                  <h2 className="section-title">Document Details</h2>
                  <div className="metadata-grid">
                    {metadata.file_size && (
                      <div className="metadata-item">
                        <span className="metadata-label">File Size:</span>
                        <span className="metadata-value">
                          {(metadata.file_size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    )}
                    
                    {(metadata.pages || resource.page_count) && (
                      <div className="metadata-item">
                        <span className="metadata-label">Pages:</span>
                        <span className="metadata-value">{metadata.pages || resource.page_count}</span>
                      </div>
                    )}
                    
                    {metadata.version && (
                      <div className="metadata-item">
                        <span className="metadata-label">PDF Version:</span>
                        <span className="metadata-value">{metadata.version}</span>
                      </div>
                    )}
                    
                    {metadata.author && (
                      <div className="metadata-item">
                        <span className="metadata-label">Author:</span>
                        <span className="metadata-value">{metadata.author}</span>
                      </div>
                    )}
                    
                    {metadata.subject && (
                      <div className="metadata-item">
                        <span className="metadata-label">Subject:</span>
                        <span className="metadata-value">{metadata.subject}</span>
                      </div>
                    )}
                    
                    {metadata.producer && (
                      <div className="metadata-item">
                        <span className="metadata-label">Producer:</span>
                        <span className="metadata-value">{metadata.producer}</span>
                      </div>
                    )}
                    
                    {metadata.creator && metadata.creator !== metadata.author && (
                      <div className="metadata-item">
                        <span className="metadata-label">Creator:</span>
                        <span className="metadata-value">{metadata.creator}</span>
                      </div>
                    )}
                    
                    {metadata.keywords && metadata.keywords.length > 0 && (
                      <div className="metadata-item full-width">
                        <span className="metadata-label">Keywords:</span>
                        <div className="keywords-container">
                          {metadata.keywords.map((keyword, index) => (
                            <span key={index} className="keyword-tag">{keyword}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {metadata.language && (
                      <div className="metadata-item">
                        <span className="metadata-label">Language:</span>
                        <span className="metadata-value">{metadata.language}</span>
                      </div>
                    )}
                    
                    {metadata.isbn && (
                      <div className="metadata-item">
                        <span className="metadata-label">ISBN:</span>
                        <span className="metadata-value">{metadata.isbn}</span>
                      </div>
                    )}
                    
                    {metadata.publisher && (
                      <div className="metadata-item">
                        <span className="metadata-label">Publisher:</span>
                        <span className="metadata-value">{metadata.publisher}</span>
                      </div>
                    )}
                    
                    {(metadata.created || resource.created_at) && (
                      <div className="metadata-item">
                        <span className="metadata-label">Created:</span>
                        <span className="metadata-value">
                          {new Date(metadata.created || resource.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                    
                    {(metadata.modified || resource.modified) && (
                      <div className="metadata-item">
                        <span className="metadata-label">Last Modified:</span>
                        <span className="metadata-value">
                          {new Date(metadata.modified || resource.modified).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                    {metadata.keywords && metadata.keywords.length > 0 && (
                      <div className="metadata-item full-width">
                        <span className="metadata-label">Keywords:</span>
                        <div className="keywords-container">
                          {metadata.keywords.map((keyword, index) => (
                            <span key={index} className="keyword">{keyword}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              {resource.summary && (
                <div className="summary-section">
                  <h2 className="section-title">Summary</h2>
                  <div className="summary-content">
                    {resource.summary}
                  </div>
                </div>
              )}
            </div>

            <div className="resource-stats">
              <div className="stats-container">
                <div className="stat-item">
                  <span>Downloads:</span>
                  <span>{resource.download_count || 0}</span>
                </div>
                <div className="stat-item">
                  <span>Views:</span>
                  <span>{resource.view_count || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
