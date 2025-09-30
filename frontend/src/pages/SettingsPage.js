import React, { useState, useEffect } from 'react';
import { 
  CogIcon, 
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { appAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const SettingsPage = () => {
  const [aiStatus, setAiStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAIStatus();
  }, []);

  const loadAIStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await appAPI.getAIStatus();
      setAiStatus(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading AI status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (configured) => {
    if (configured) {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
    return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
  };

  const getStatusColor = (configured) => {
    return configured ? 'text-green-700' : 'text-yellow-700';
  };

  const getStatusBg = (configured) => {
    return configured ? 'bg-green-50' : 'bg-yellow-50';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gray-100 rounded-full">
            <CogIcon className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Settings
        </h1>
        <p className="text-lg text-gray-600">
          Configure your AI App Builder environment
        </p>
      </div>

      {/* AI Service Status */}
      <div className="card">
        <div className="flex items-center mb-4">
          <InformationCircleIcon className="w-5 h-5 text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            AI Service Status
          </h2>
        </div>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">Error loading AI status: {error}</span>
            </div>
          </div>
        ) : aiStatus ? (
          <div className={`border rounded-lg p-4 ${getStatusBg(aiStatus.configured)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(aiStatus.configured)}
                <span className={`ml-2 font-medium ${getStatusColor(aiStatus.configured)}`}>
                  {aiStatus.configured ? 'AI Service Configured' : 'AI Service Using Mock Data'}
                </span>
              </div>
              <button
                onClick={loadAIStatus}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Refresh
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {aiStatus.message}
            </p>
          </div>
        ) : null}
      </div>

      {/* Configuration Instructions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Configuration Instructions
        </h2>
        
        <div className="space-y-6">
          {/* Backend Configuration */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Backend Configuration
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                To enable real AI processing, configure the following environment variables in your backend:
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm">MONGODB_URI</code>
                  <span className="text-sm text-gray-600">Your MongoDB connection string</span>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm">GEMINI_API_KEY</code>
                  <span className="text-sm text-gray-600">Your Google Gemini API key</span>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm">FRONTEND_URL</code>
                  <span className="text-sm text-gray-600">Frontend URL (default: http://localhost:3000)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Frontend Configuration */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Frontend Configuration
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                Configure the frontend to connect to your backend:
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm">REACT_APP_API_URL</code>
                  <span className="text-sm text-gray-600">Backend API URL (default: http://localhost:5000/api)</span>
                </div>
              </div>
            </div>
          </div>

          {/* MongoDB Setup */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              MongoDB Setup
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                Set up MongoDB Atlas (recommended) or use a local MongoDB instance:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Create a MongoDB Atlas account</li>
                <li>Create a new cluster</li>
                <li>Get your connection string</li>
                <li>Update the MONGODB_URI in your backend .env file</li>
              </ol>
            </div>
          </div>

          {/* Google Gemini Setup */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Google Gemini API Setup
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                To enable real AI processing:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Create a Google AI Studio account</li>
                <li>Generate an API key</li>
                <li>Update the GEMINI_API_KEY in your backend .env file</li>
                <li>Restart your backend server</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          System Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Frontend</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>React: {React.version}</div>
              <div>Environment: {process.env.NODE_ENV}</div>
              <div>API URL: {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Backend</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Node.js: Express + MongoDB</div>
              <div>AI Service: {aiStatus?.configured ? 'Google Gemini' : 'Mock Data'}</div>
              <div>Status: {aiStatus?.configured ? 'Configured' : 'Demo Mode'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
