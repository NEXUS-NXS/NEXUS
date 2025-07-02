// 📦 lib/api.ts - Nexus Simulation API Client

// Base configuration
const BASE_URL = 'https://127.0.0.1:8000/api/simulations';

// Types for better type safety
export interface SimulationModel {
  id: string;
  name: string;
  category: string;
  language: string;
  code: string;
  description?: string;
  owner: string;
  isPublic?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  long_description: string;
  file: string;
  type: string;
  size: number;
  row_count: number;
  column_count: number;
  owner: string;
  is_public: boolean;
  shared_with: Array<{
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  }>;
  shared_with_count: number;
  source: string;
  category: string;
  tags: string[];
  quality_completeness: number;
  quality_accuracy: number;
  quality_consistency: number;
  quality_timeliness: number;
  quality: {
    completeness: number;
    accuracy: number;
    consistency: number;
    timeliness: number;
  };
  downloads: number;
  views: number;
  schema: Array<{
    name: string;
    type: string;
    description?: string;
    nullable?: boolean;
  }>;
  preview_data: {
    columns: string[];
    rows: any[][];
  };
  preview: {
    columns: string[];
    rows: any[][];
  };
  usage_stats: {
    models: number;
    modelNames: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface SimulationSession {
  id: string;
  session_id: string;
  model: string;
  parameters: any;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  current_step?: string;
  start_time?: string;
  estimated_completion?: string;
  created_at: string;
}

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = localStorage.getItem('access_token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const config: RequestInit = {
    credentials: 'include', // Include cookies for CSRF
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API call failed: ${response.status}`);
  }
  
  return response.json();
}

// ==========================
// MODEL ENDPOINTS
// ==========================

export async function fetchModels(params?: { category?: string; language?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.language) searchParams.set('language', params.language);
  
  const query = searchParams.toString();
  return apiCall(`/models/${query ? `?${query}` : ''}`);
}

export async function getModel(id: string): Promise<SimulationModel> {
  return apiCall(`/models/${id}/`);
}

export async function createModel(model: {
  name: string;
  category: string;
  language: string;
  code: string;
  description?: string;
  isPublic?: boolean;
}) {
  return apiCall('/models/', {
    method: 'POST',
    body: JSON.stringify({
      name: model.name,
      category: model.category,
      language: model.language,
      code: model.code,
      metadata: { 
        description: model.description,
        isPublic: model.isPublic 
      },
    }),
  });
}

export async function updateModel(id: string, model: Partial<SimulationModel>) {
  return apiCall(`/models/${id}/update/`, {
    method: 'PUT',
    body: JSON.stringify(model),
  });
}

export async function deleteModel(id: string) {
  return apiCall(`/models/${id}/delete/`, {
    method: 'DELETE',
  });
}

export async function validateModel(data: {
  model_id?: string;
  language: string;
  code: string;
  parameters: any;
  dataset_id?: string;
}) {
  return apiCall('/models/validate/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ==========================
// DATASET ENDPOINTS
// ==========================

export async function fetchDatasets(params?: { 
  category?: string; 
  type?: string; 
  owner?: string; 
  search?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.type) searchParams.set('type', params.type);
  if (params?.owner) searchParams.set('owner', params.owner);
  if (params?.search) searchParams.set('search', params.search);
  
  const query = searchParams.toString();
  return apiCall(`/datasets/${query ? `?${query}` : ''}`);
}

export async function getDataset(id: string): Promise<Dataset> {
  return apiCall(`/datasets/${id}/`);
}

export async function uploadDataset(formData: FormData) {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${BASE_URL}/datasets/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Dataset upload failed');
  }
  
  return response.json();
}

export async function updateDataset(id: string, data: Partial<Dataset>) {
  return apiCall(`/datasets/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteDataset(id: string) {
  return apiCall(`/datasets/${id}/`, {
    method: 'DELETE',
  });
}

export async function shareDataset(id: string, data: { 
  user_ids?: number[]; 
  make_public?: boolean; 
}) {
  return apiCall(`/datasets/${id}/share/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function downloadDataset(id: string) {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${BASE_URL}/datasets/${id}/download/`, {
    credentials: 'include',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
  
  if (!response.ok) {
    throw new Error('Dataset download failed');
  }
  
  return response;
}

export async function fetchMyDatasets() {
  return apiCall('/datasets/my-datasets/');
}

export async function fetchDatasetStats() {
  // This would need to be implemented on the backend if needed
  // For now, return mock data or calculate from datasets
  const datasets = await fetchDatasets();
  return {
    total: datasets.length,
    public: datasets.filter((d: Dataset) => d.is_public).length,
    downloads: datasets.reduce((sum: number, d: Dataset) => sum + d.downloads, 0),
    contributors: [...new Set(datasets.map((d: Dataset) => d.owner))].length,
  };
}

// ==========================
// SIMULATION ENDPOINTS
// ==========================

export async function runSimulation(data: {
  model_id: string;
  parameters: any;
  dataset_id?: string;
}) {
  return apiCall('/run/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchSimulationStatus(session_id: string) {
  return apiCall(`/${session_id}/status/`);
}

export async function fetchSimulationResults(session_id: string) {
  return apiCall(`/${session_id}/results/`);
}

export async function exportSimulation(session_id: string, format: string = 'json') {
  return apiCall(`/${session_id}/export/?format=${format}`);
}

// ==========================
// SESSION MANAGEMENT ENDPOINTS
// ==========================

export async function fetchSimulationSessions() {
  return apiCall('/sessions/');
}

export async function shareSimulationSession(session_id: string) {
  return apiCall(`/sessions/${session_id}/share/`, {
    method: 'POST',
  });
}

export async function fetchSharedSessions() {
  return apiCall('/sessions/shared/');
}