// budgetRoutes.js
const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const budgetCapController = require('../controllers/budgetCapController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to authenticate requests
router.use(authMiddleware.authenticateToken);

// Get all budgets
router.get('/getAllBudgets', budgetController.getAllBudgets);

// Add a new budget
router.post('/', budgetController.addBudget);

// Add a new budget capacity
router.post('/capacity', budgetCapController.addBudgetCap);

module.exports = router;
