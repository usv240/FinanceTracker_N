// budgetRoutes.js
const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const budgetCapController = require('../controllers/budgetCapController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to authenticate requests
router.use(authMiddleware.authenticateToken);

// Uncommented line with a callback function
router.get('/getAllBudgets/:month?', budgetController.getAllBudgets);

// Add a new budget
router.post('/', budgetController.addBudget);

// Add a new budget capacity
router.post('/capacity', budgetCapController.addBudgetCap);

// Add a new budget capacity
router.get('/capacity', budgetCapController.getBudgetCap);

router.get('/capacity/:month?', budgetCapController.getBudgetCap);

module.exports = router;
