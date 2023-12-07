// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const token = require('./../token/token');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/refreshAccessToken', authController.refreshAccessToken);

// Ensure the 'authenticateToken' middleware is applied properly using a callback function
router.get('/protected', (req, res, next) => {
  authenticateToken(req, res, next, (err) => {
    if (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    // If authentication succeeds, proceed to the next middleware
    res.json({ message: 'Protected Route', user: req.user });
  });
});

module.exports = router;
