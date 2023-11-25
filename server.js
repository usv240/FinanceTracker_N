const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const authRoutes = require('./routes/authRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const mysql = require('mysql2/promise');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(compression());

// Database connection pool
const pool = mysql.createPool({
  host: 'sql5.freemysqlhosting.net',
  user: 'sql5661508',
  password: 'mIXmWWkcHX',
  database: 'sql5661508',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Attach the database connection pool to the request object
app.use((req, res, next) => {
  req.db = pool;
  next();
});

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
