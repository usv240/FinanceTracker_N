// budgetRoutes.js
const express = require('express');
const router = express.Router();
const budgetController = require('./budgetController');
const budgetCapController = require('./budgetCapController');
const authMiddleware = require('../middleware/authMiddleware');


router.use(authMiddleware.authenticateToken);

router.get('/getAllBudgets/:month?', budgetController.getAllBudgets);

router.post('/', budgetController.addBudget);

router.post('/capacity', budgetCapController.addBudgetCap);

router.get('/capacity', budgetCapController.getBudgetCap);

router.get('/capacity/:month?', budgetCapController.getBudgetCap);

module.exports = router;
