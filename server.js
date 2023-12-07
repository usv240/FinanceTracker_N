// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const authRoutes = require('./routes/authRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const port = 5000;
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(compression());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the budget app API' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Budget routes
app.use('/api/budgets', budgetRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { app, server };