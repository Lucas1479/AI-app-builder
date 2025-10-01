import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RequirementForm from '../components/RequirementForm';
import GeneratedApp from '../components/GeneratedApp';
import LoadingSpinner from '../components/LoadingSpinner';
import { appAPI } from '../services/api';

const BuilderPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requirement, setRequirement] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if we have a requirement ID in the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const requirementId = urlParams.get('id');
    
    if (requirementId) {
      loadRequirement(requirementId);
    }
  }, []);

  const loadRequirement = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await appAPI.getRequirement(id);
      setRequirement(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading requirement:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRequirement = async (description) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await appAPI.submitRequirement(description);
      
      // Start polling for the result
      pollForResult(response.data.id);
      
    } catch (err) {
      setError(err.message);
      console.error('Error submitting requirement:', err);
      setIsLoading(false);
    }
  };

  const pollForResult = async (requirementId) => {
    const maxAttempts = 30; // 30 seconds max
    let attempts = 0;
    
    const poll = async () => {
      try {
        const response = await appAPI.getRequirement(requirementId);
        const data = response.data;
        
        if (data.aiProcessingStatus === 'completed') {
          setRequirement(data);
          setIsLoading(false);
          
          // Update URL to include the requirement ID
          navigate(`/builder?id=${requirementId}`, { replace: true });
          
        } else if (data.aiProcessingStatus === 'failed') {
          setError('Failed to process requirements. Please try again.');
          setIsLoading(false);
          
        } else if (attempts < maxAttempts) {
          // Still processing, poll again
          attempts++;
          setTimeout(poll, 1000);
        } else {
          setError('Processing timeout. Please try again.');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error polling for result:', err);
        setError('Error checking processing status. Please try again.');
        setIsLoading(false);
      }
    };
    
    poll();
  };

  const handleStartOver = () => {
    setRequirement(null);
    setError(null);
    navigate('/builder', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Processing your requirements..." />
          <p className="mt-4 text-gray-600">
            This may take a few seconds while our AI analyzes your description.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card max-w-2xl mx-auto text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={handleStartOver}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (requirement) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={handleStartOver}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Start Over
          </button>
        </div>
        <GeneratedApp requirement={requirement} />
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">
          Describe your app idea and let our AI create a mock interface for you
        </h1>
      </div>
      
      <RequirementForm 
        onSubmit={handleSubmitRequirement}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BuilderPage;
