const AppRequirement = require('../models/AppRequirement');
const aiService = require('../services/aiService');

/**
 * Submit a new app requirement for AI processing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const submitRequirement = async (req, res) => {
  try {
    const { userDescription } = req.body;

    // Validate input
    if (!userDescription || userDescription.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User description is required'
      });
    }

    // Create new app requirement record
    const appRequirement = new AppRequirement({
      userDescription: userDescription.trim(),
      aiProcessingStatus: 'pending'
    });

    // Save to database
    await appRequirement.save();

    // Start AI processing (async)
    processRequirementWithAI(appRequirement._id, userDescription);

    res.status(201).json({
      success: true,
      message: 'Requirement submitted successfully',
      data: {
        id: appRequirement._id,
        status: 'processing'
      }
    });

  } catch (error) {
    console.error('Error submitting requirement:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get app requirement by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRequirement = async (req, res) => {
  try {
    const { id } = req.params;

    const appRequirement = await AppRequirement.findById(id);

    if (!appRequirement) {
      return res.status(404).json({
        success: false,
        message: 'Requirement not found'
      });
    }

    res.json({
      success: true,
      data: appRequirement
    });

  } catch (error) {
    console.error('Error fetching requirement:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get all app requirements
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllRequirements = async (req, res) => {
  try {
    const requirements = await AppRequirement.find()
      .sort({ createdAt: -1 })
      .limit(50); // Limit to recent 50 requirements

    res.json({
      success: true,
      data: requirements
    });

  } catch (error) {
    console.error('Error fetching requirements:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Process requirement with AI service (async function)
 * @param {string} requirementId - The requirement ID
 * @param {string} userDescription - The user description
 */
const processRequirementWithAI = async (requirementId, userDescription) => {
  try {
    // Update status to processing
    await AppRequirement.findByIdAndUpdate(requirementId, {
      aiProcessingStatus: 'processing'
    });

    // Extract requirements using AI service
    const extractedData = await aiService.extractRequirements(userDescription);

    // Update the requirement with extracted data
    await AppRequirement.findByIdAndUpdate(requirementId, {
      appName: extractedData.appName,
      entities: extractedData.entities,
      roles: extractedData.roles,
      features: extractedData.features,
      rolePermissions: extractedData.rolePermissions,
      aiProcessingStatus: 'completed',
      aiResponse: extractedData
    });

    console.log(`Successfully processed requirement ${requirementId}`);

  } catch (error) {
    console.error(`Error processing requirement ${requirementId}:`, error);
    
    // Update status to failed
    await AppRequirement.findByIdAndUpdate(requirementId, {
      aiProcessingStatus: 'failed',
      aiResponse: { error: error.message }
    });
  }
};

/**
 * Get AI service status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAIStatus = async (req, res) => {
  try {
    const isConfigured = aiService.isConfigured();
    
    res.json({
      success: true,
      data: {
        configured: isConfigured,
        message: isConfigured 
          ? 'AI service is properly configured with Google Gemini' 
          : 'AI service is using mock data (configure Gemini API key for real processing)'
      }
    });

  } catch (error) {
    console.error('Error checking AI status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  submitRequirement,
  getRequirement,
  getAllRequirements,
  getAIStatus
};
