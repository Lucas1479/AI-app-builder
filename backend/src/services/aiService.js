// AI Service for requirement extraction
// This service handles communication with AI APIs (Google Gemini, etc.)

const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';
    
    console.log('AIService constructor - API Key:', this.apiKey ? 'Present' : 'Missing');
    console.log('AIService constructor - Model:', this.model);
    
    // Initialize Google Generative AI
    if (this.apiKey && this.apiKey !== 'your_gemini_api_key_here') {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.generativeModel = this.genAI.getGenerativeModel({ model: this.model });
        console.log('GoogleGenerativeAI initialized successfully');
      } catch (error) {
        console.error('Error initializing GoogleGenerativeAI:', error);
      }
    } else {
      console.log('API Key not configured, using mock data');
    }
  }

  /**
   * Extract structured requirements from user description
   * @param {string} userDescription - The user's app description
   * @returns {Promise<Object>} - Structured requirements object
   */
  async extractRequirements(userDescription) {
    try {
      console.log('Extracting requirements for:', userDescription.substring(0, 100) + '...');
      
      // Use Google Gemini API if available
      if (this.generativeModel) {
        console.log('Using Google Gemini API');
        return await this.extractWithGemini(userDescription);
      }
      
      // Fallback to mock data
      console.log('Using mock data - Gemini API not configured');
      return this.mockExtractRequirements(userDescription);
      
    } catch (error) {
      console.error('AI service error:', error);
      // Fallback to mock data on error
      console.log('Falling back to mock data due to error');
      return this.mockExtractRequirements(userDescription);
    }
  }

  /**
   * Extract requirements using Google Gemini API
   * @param {string} userDescription - The user's app description
   * @returns {Promise<Object>} - Structured requirements object
   */
  async extractWithGemini(userDescription) {
    const prompt = `You are an expert app analyst and system architect. Extract structured information from user app descriptions and design role-based access control.

User Description: "${userDescription}"

Please analyze this description and return a JSON object with the following structure:
{
  "appName": "App Name",
  "entities": [
    {
      "name": "EntityName",
      "fields": [
        {
          "name": "FieldName",
          "type": "text|email|number|date|select|textarea",
          "required": true/false
        }
      ]
    }
  ],
  "roles": ["Role1", "Role2"],
  "features": ["Feature1", "Feature2"],
  "rolePermissions": {
    "Role1": {
      "canCreate": ["Entity1", "Entity2"],
      "canView": ["Entity1", "Entity2", "Entity3"],
      "canEdit": ["Entity1"]
    },
    "Role2": {
      "canCreate": ["Entity2", "Entity3"],
      "canView": ["Entity2", "Entity3"],
      "canEdit": ["Entity2", "Entity3"]
    }
  }
}

CRITICAL GUIDELINES FOR ROLE PERMISSIONS:

1. **Permission Definitions**:
   - **canCreate**: Entities this role can add new instances of
   - **canView**: Entities this role can see/list (read-only access)
   - **canEdit**: Entities this role can modify existing instances of

2. **Role Analysis Framework**:
   For each role identified, think through these questions:
   - What is this role's primary responsibility in the business context?
   - What data does this role need to create to fulfill their duties?
   - What data does this role need to view to do their job effectively?
   - What data does this role need to edit to maintain accuracy?
   - What are the business rules and constraints for this role?

3. **Permission Logic Principles**:
   - **Self-Management**: Users should typically be able to create/edit their own profile/account
   - **Responsibility-Based**: Permissions should align with the role's actual job responsibilities
   - **Data Ownership**: Consider who "owns" or is responsible for each type of data
   - **Business Workflow**: Think about the actual business processes and who needs what access
   - **Security**: Apply principle of least privilege - only give access that's necessary

4. **Entity Analysis**:
   - Extract the main app name from the description
   - Identify key entities (data objects) mentioned
   - For each entity, include relevant fields (name, email, etc.)
   - Identify user roles mentioned
   - List key features/functionality

5. **Field Types**:
   - Use appropriate field types (text, email, number, date, select, textarea)
   - Mark important fields as required

6. **Critical Thinking Process**:
   - Analyze the business context and workflow
   - Consider what each role actually needs to accomplish
   - Ensure permissions make logical sense for the role's responsibilities
   - Don't just filter entities - consider the actual business operations
   - Think about data relationships and dependencies

Return only the JSON object, no additional text.`;

    try {
      console.log('Sending request to Gemini API...');
      const result = await this.generativeModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Gemini API response:', text);
      
      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        console.log('Parsed AI response:', JSON.stringify(parsedData, null, 2));
        return parsedData;
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  /**
   * Mock implementation for development/testing
   * @param {string} userDescription - The user's app description
   * @returns {Object} - Mock structured requirements
   */
  mockExtractRequirements(userDescription) {
    // Simple keyword-based extraction for demo
    const description = userDescription.toLowerCase();
    
    let appName = 'My App';
    let entities = [];
    let roles = [];
    let features = [];

    // Extract app name (simple heuristic)
    if (description.includes('course') && description.includes('student')) {
      appName = 'Course Manager';
      entities = [
        {
          name: 'Student',
          fields: [
            { name: 'Name', type: 'text', required: true },
            { name: 'Email', type: 'email', required: true },
            { name: 'Age', type: 'number', required: false },
            { name: 'Student ID', type: 'text', required: true }
          ]
        },
        {
          name: 'Course',
          fields: [
            { name: 'Title', type: 'text', required: true },
            { name: 'Code', type: 'text', required: true },
            { name: 'Credits', type: 'number', required: true },
            { name: 'Description', type: 'textarea', required: false }
          ]
        },
        {
          name: 'Grade',
          fields: [
            { name: 'Student', type: 'select', required: true },
            { name: 'Course', type: 'select', required: true },
            { name: 'Grade', type: 'number', required: true },
            { name: 'Date', type: 'date', required: true }
          ]
        }
      ];
      roles = ['Teacher', 'Student', 'Admin'];
      features = ['Add course', 'Enroll students', 'View reports', 'Manage grades'];
    } else if (description.includes('inventory') || description.includes('product')) {
      appName = 'Inventory Manager';
      entities = [
        {
          name: 'Product',
          fields: [
            { name: 'Name', type: 'text', required: true },
            { name: 'SKU', type: 'text', required: true },
            { name: 'Price', type: 'number', required: true },
            { name: 'Quantity', type: 'number', required: true }
          ]
        },
        {
          name: 'Supplier',
          fields: [
            { name: 'Company Name', type: 'text', required: true },
            { name: 'Contact Email', type: 'email', required: true },
            { name: 'Phone', type: 'text', required: false }
          ]
        }
      ];
      roles = ['Manager', 'Employee', 'Admin'];
      features = ['Add products', 'Update inventory', 'Generate reports', 'Manage suppliers'];
    } else {
      // Generic app structure
      appName = 'Business App';
      entities = [
        {
          name: 'User',
          fields: [
            { name: 'Name', type: 'text', required: true },
            { name: 'Email', type: 'email', required: true },
            { name: 'Role', type: 'select', required: true }
          ]
        }
      ];
      roles = ['User', 'Admin'];
      features = ['Manage data', 'View reports', 'User management'];
    }

    // Generate role permissions based on the app type
    let rolePermissions = {};
    
    if (description.includes('course') && description.includes('student')) {
      rolePermissions = {
        'Student': {
          canCreate: ['Student'],
          canView: ['Student', 'Course', 'Grade'],
          canEdit: ['Student']
        },
        'Teacher': {
          canCreate: ['Course', 'Student', 'Grade'],
          canView: ['Course', 'Student', 'Grade'],
          canEdit: ['Course', 'Student', 'Grade']
        },
        'Admin': {
          canCreate: ['Student', 'Course', 'Grade', 'User'],
          canView: ['Student', 'Course', 'Grade', 'User'],
          canEdit: ['Student', 'Course', 'Grade', 'User']
        }
      };
    } else if (description.includes('inventory') || description.includes('product')) {
      rolePermissions = {
        'Manager': {
          canCreate: ['Product', 'Supplier'],
          canView: ['Product', 'Supplier', 'Sale'],
          canEdit: ['Product', 'Supplier']
        },
        'Employee': {
          canCreate: ['Sale'],
          canView: ['Product', 'Sale'],
          canEdit: []
        },
        'Admin': {
          canCreate: ['Product', 'Supplier', 'Sale', 'User'],
          canView: ['Product', 'Supplier', 'Sale', 'User'],
          canEdit: ['Product', 'Supplier', 'Sale', 'User']
        }
      };
    } else {
      // Generic permissions
      rolePermissions = {
        'User': {
          canCreate: ['User'],
          canView: ['User'],
          canEdit: ['User']
        },
        'Admin': {
          canCreate: ['User'],
          canView: ['User'],
          canEdit: ['User']
        }
      };
    }

    return {
      appName,
      entities,
      roles,
      features,
      rolePermissions
    };
  }

  /**
   * Validate AI API configuration
   * @returns {boolean} - Whether the AI service is properly configured
   */
  isConfigured() {
    return !!this.apiKey && this.apiKey !== 'your_gemini_api_key_here' && !!this.generativeModel;
  }
}

module.exports = new AIService();
