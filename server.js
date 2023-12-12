// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const authRoutes = require('./authRoutes');
const budgetRoutes = require('./budgetRoutes');
const port = 5000;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(compression());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the budget app API' });
});

app.use('/api/auth', authRoutes);

app.use('/api/budgets', budgetRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { app, server };