import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  UserGroupIcon, 
  CogIcon,
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  UserIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import DynamicForm from './DynamicForm';

const GeneratedApp = ({ requirement }) => {
  const [activeTab, setActiveTab] = useState(requirement.roles[0]?.toLowerCase() || 'student');
  const [showForm, setShowForm] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [mockData, setMockData] = useState({});

  const handleAddEntity = (entity) => {
    setSelectedEntity(entity);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    const entityName = selectedEntity.name;
    setMockData(prev => ({
      ...prev,
      [entityName]: [...(prev[entityName] || []), formData]
    }));
    setShowForm(false);
    setSelectedEntity(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedEntity(null);
  };

  // Get role-specific entities based on the active tab
  const getRoleSpecificEntities = (role) => {
    // Convert role to proper case to match AI response keys
    const roleKey = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    
    // Use AI-generated role permissions if available
    if (requirement.rolePermissions && requirement.rolePermissions[roleKey]) {
      const permissions = requirement.rolePermissions[roleKey];
      const allowedEntities = permissions.canView || [];
      
      return requirement.entities.filter(entity => 
        allowedEntities.includes(entity.name)
      );
    }
    
    // If no AI permissions, show all entities for all roles
    return requirement.entities;
  };

  // Get role-specific features based on the active tab
  const getRoleSpecificFeatures = (role) => {
    // Convert role to proper case to match AI response keys
    const roleKey = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    
    // Use AI-generated role permissions if available
    if (requirement.rolePermissions && requirement.rolePermissions[roleKey]) {
      const permissions = requirement.rolePermissions[roleKey];
      // For now, show all features for the role
      return requirement.features;
    }
    
    // If no AI permissions, show all features
    return requirement.features;
  };

  const renderEntityList = (entity) => {
    const data = mockData[entity.name] || [];
    
    // Check if current role can create this entity
    const roleKey = activeTab.charAt(0).toUpperCase() + activeTab.slice(1).toLowerCase();
    const canCreate = requirement.rolePermissions && requirement.rolePermissions[roleKey] 
      ? requirement.rolePermissions[roleKey].canCreate || []
      : [];
    const canCreateEntity = canCreate.includes(entity.name);
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-base font-medium text-gray-900">
            {entity.name}s ({data.length})
          </h4>
          {canCreateEntity && (
            <button
              onClick={() => handleAddEntity(entity)}
              className="btn-primary flex items-center space-x-1.5 text-sm px-3 py-1.5"
            >
              <PlusIcon className="w-3 h-3" />
              <span>Add {entity.name}</span>
            </button>
          )}
        </div>
        
        {data.length > 0 ? (
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="bg-gray-50 p-2.5 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {entity.fields.map((field) => (
                      <div key={field.name} className="text-xs">
                        <span className="font-medium text-gray-700">{field.name}:</span>
                        <span className="ml-2 text-gray-600">{item[field.name] || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <EyeIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <DocumentTextIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No {entity.name.toLowerCase()}s added yet</p>
            <p className="text-xs">Click "Add {entity.name}" to get started</p>
          </div>
        )}
      </div>
    );
  };

  // Generate role-based tabs from AI response
  const tabs = requirement.roles.map((role, index) => ({
    id: role.toLowerCase(),
    name: role,
    icon: role.toLowerCase() === 'admin' ? CogIcon : 
          role.toLowerCase() === 'teacher' ? AcademicCapIcon : UserIcon
  }));

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="card mb-4">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="p-2.5 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {requirement.appName}
          </h1>
          <p className="text-base text-gray-600 mb-3">
            Your app has been generated successfully!
          </p>
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Ready to use
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-1.5 ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab content */}
        <div className="pt-4">
          {tabs.map((tab) => (
            activeTab === tab.id && (
              <div key={tab.id} className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tab.name} Dashboard
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage {tab.name.toLowerCase()}-related tasks and data
                  </p>
                </div>
                
                {/* Role-specific entities and forms */}
                <div className="space-y-4">
                  {getRoleSpecificEntities(activeTab).map((entity, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      {renderEntityList(entity)}
                    </div>
                  ))}
                </div>
                
                {/* Role-specific features */}
                <div className="mt-6">
                  <h4 className="text-base font-medium text-gray-900 mb-3">
                    Available Features for {tab.name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getRoleSpecificFeatures(activeTab).map((feature, index) => (
                      <div key={index} className="flex items-center p-2.5 bg-gray-50 rounded-lg">
                        <CogIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Dynamic Form Modal */}
      {showForm && selectedEntity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <DynamicForm
              entity={selectedEntity}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedApp;
