const express = require('express');
const router = express.Router();
const {
  submitRequirement,
  getRequirement,
  getAllRequirements,
  getAIStatus
} = require('../controllers/appController');

// @route   POST /api/apps/requirements
// @desc    Submit a new app requirement
// @access  Public
router.post('/requirements', submitRequirement);

// @route   GET /api/apps/requirements/:id
// @desc    Get app requirement by ID
// @access  Public
router.get('/requirements/:id', getRequirement);

// @route   GET /api/apps/requirements
// @desc    Get all app requirements
// @access  Public
router.get('/requirements', getAllRequirements);

// @route   GET /api/apps/ai-status
// @desc    Get AI service status
// @access  Public
router.get('/ai-status', getAIStatus);

module.exports = router;
