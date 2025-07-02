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
  file: string;
  size: number;
  owner: string;
  is_public: boolean;
  created_at: string;
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

export async function createModel(model: {
  name: string;
  category: string;
  language: string;
  code: string;
  description?: string;
  isPublic?: boolean;
}) {
  return apiCall('/models/create/', {
    method: 'POST',
    body: JSON.stringify(model),
  });
}

export async function getModel(id: string) {
  return apiCall(`/models/${id}/`);
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

export async function fetchDatasets() {
  return apiCall('/datasets/');
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

export async function deleteDataset(id: string) {
  return apiCall(`/datasets/${id}/`, {
    method: 'DELETE',
  });
}

export async function shareDataset(id: string) {
  return apiCall(`/datasets/share/`, {
    method: 'POST',
    body: JSON.stringify({ dataset_id: id }),
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