// Component to add to the main nexus-frontend for navigation to simulation platform
// Add this to nexus-frontend/src/components/SimulationLauncher.jsx

import React from 'react';
import { useUser } from '../context/UserContext';

const SimulationLauncher = ({ children, className = '' }) => {
  const { user, isAuthenticated } = useUser();

  const handleLaunchSimulation = () => {
    if (!isAuthenticated) {
      // If not authenticated, handle login first
      alert('Please log in to access the simulation platform');
      return;
    }

    // Get current auth data
    const authToken = localStorage.getItem('access_token');
    const userData = localStorage.getItem('nexus_user');

    if (!authToken || !userData) {
      alert('Authentication error. Please log in again.');
      return;
    }

    // Open simulation platform in new tab/window with auth context
    const simulationUrl = 'https://127.0.0.1:3000/simulation?from_main_app=true';
    window.open(simulationUrl, '_blank');
  };

  return (
    <button 
      onClick={handleLaunchSimulation}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
};

export default SimulationLauncher;

/* 
Usage example in main frontend:

import SimulationLauncher from './components/SimulationLauncher';

// In a menu or dashboard:
<SimulationLauncher className="btn btn-primary">
  <span>🧮 Launch Simulation Platform</span>
</SimulationLauncher>

// Or as a card:
<SimulationLauncher className="simulation-card">
  <div className="card">
    <h3>Advanced Simulations</h3>
    <p>Build and run actuarial models</p>
  </div>
</SimulationLauncher>
*/
