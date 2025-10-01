import React, { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

const RequirementForm = ({ onSubmit, isLoading }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description.trim());
    }
  };

  const exampleDescriptions = [
    "I need a university portal where teachers manage courses and grades, and students enroll and check their results.",
    "I want a personal finance app to record expenses and income, organize categories, import bank statements, set budgets, and get monthly and yearly summaries.",
    "Simple procurement flow: employees submit purchase requests, managers approve, and finance records invoices and payments.",
  ];

  return (
    <div className="card max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className="p-2.5 bg-primary-100 rounded-lg">
            <SparklesIcon className="w-6 h-6 text-primary-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Describe Your App Idea
        </h2>
        <p className="text-base text-gray-600">
          Tell us what kind of app you want to build, and our AI will analyze your requirements
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            App Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            className="input-field resize-none"
            placeholder="Describe your app idea in detail. For example: 'I want an app to manage student courses and grades. Teachers add courses, students enroll, and admins manage reports.'"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            required
          />
          <p className="text-sm text-gray-500">
            Be as specific as possible about entities, roles, and features you want.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !description.trim()}
            className="btn-primary px-6 py-2.5 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" text="" />
                <span>Analyzing Requirements...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4" />
                <span>Generate App</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Example descriptions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Example Descriptions:</h3>
        <div className="space-y-2">
          {exampleDescriptions.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setDescription(example)}
              disabled={isLoading}
              className="block w-full text-left p-2.5 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200 disabled:opacity-50"
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequirementForm;
