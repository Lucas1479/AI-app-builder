import React, { useState } from 'react';
import { 
  UserIcon, 
  PlusIcon
} from '@heroicons/react/24/outline';

const DynamicForm = ({ entity, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    entity.fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].trim() === '')) {
        newErrors[field.name] = `${field.name} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getInputType = (field) => {
    switch (field.type) {
      case 'email':
        return 'email';
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      default:
        return 'text';
    }
  };

  const renderField = (field) => {
    const fieldId = `${entity.name}-${field.name}`;
    
    if (field.type === 'textarea') {
      return (
        <textarea
          id={fieldId}
          name={field.name}
          rows={3}
          className={`input-field resize-none ${errors[field.name] ? 'border-red-500' : ''}`}
          placeholder={`Enter ${field.name.toLowerCase()}`}
          value={formData[field.name] || ''}
          onChange={(e) => handleInputChange(field.name, e.target.value)}
        />
      );
    }
    
    if (field.type === 'select') {
      return (
        <select
          id={fieldId}
          name={field.name}
          className={`input-field ${errors[field.name] ? 'border-red-500' : ''}`}
          value={formData[field.name] || ''}
          onChange={(e) => handleInputChange(field.name, e.target.value)}
        >
          <option value="">Select {field.name}</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      );
    }
    
    return (
      <input
        type={getInputType(field)}
        id={fieldId}
        name={field.name}
        className={`input-field ${errors[field.name] ? 'border-red-500' : ''}`}
        placeholder={`Enter ${field.name.toLowerCase()}`}
        value={formData[field.name] || ''}
        onChange={(e) => handleInputChange(field.name, e.target.value)}
      />
    );
  };

  return (
    <div className="card max-w-xl mx-auto">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-primary-100 rounded-lg mr-3">
          <UserIcon className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Add New {entity.name}
          </h3>
          <p className="text-xs text-gray-600">
            Fill in the details for this {entity.name.toLowerCase()}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {entity.fields.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={`${entity.name}-${field.name}`} className="form-label">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
            {errors[field.name] && (
              <p className="text-sm text-red-600">{errors[field.name]}</p>
            )}
          </div>
        ))}

        <div className="flex justify-end space-x-2 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary text-sm px-3 py-1.5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-1.5 text-sm px-3 py-1.5"
          >
            <PlusIcon className="w-3 h-3" />
            <span>Add {entity.name}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;
