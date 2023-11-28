// budgetRoutes.js
const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const budgetCapController = require('../controllers/budgetCapController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to authenticate requests
router.use(authMiddleware.authenticateToken);

// Get all budgets
//router.get('/getAllBudgets', budgetController.getAllBudgets);

// Get all budgets or get budgets by month
router.get('/getAllBudgets/:month?', budgetController.getAllBudgets);

// Add a new budget
router.post('/', budgetController.addBudget);

// Add a new budget capacity
router.post('/capacity', budgetCapController.addBudgetCap);

// Add a new budget capacity
router.get('/capacity', budgetCapController.getBudgetCap);

module.exports = router;
