const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'database-3-instance-1.cccnx8pptmin.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'abcde12345',
  database: 'sys',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const budgetController = {
  getAllBudgets: async (req, res) => {
    try {
      console.log('Inside getAllBudgets function'); // Add this line

      const username = req.user.username;
      const { month } = req.params;

      let query;
      let queryParams = [username];
      console.log('Query Parameters:', queryParams);
      console.log('month', month);
      if (month) {
        queryParams.push(parseInt(month, 10));
        query = 'SELECT budgetname, SUM(budgetnumber) as budgetnumber FROM budget WHERE username = ? AND MONTH(date) = ? GROUP BY budgetname ORDER BY budgetname ASC';
      } else {
        query = 'SELECT budgetname, SUM(budgetnumber) as budgetnumber FROM budget WHERE username = ? GROUP BY budgetname ORDER BY budgetname ASC';
      }

      console.log('SQL Query:', query);
      console.log('Query Parameters:', queryParams);

      const [budgets] = await pool.execute(query, queryParams);

      if (!budgets || !budgets.length) {
        return res.status(200).json({ message: 'No budget data available.' });
      }

      console.log(budgets);
      res.status(200).json({ data: budgets });
    } catch (error) {
      console.error('Error in getAllBudgets:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  addBudget: async (req, res) => {
    try {
      const { budgetName, budgetNumber } = req.body;
      const username = req.user.username;

      // Add a null check before inserting data
      if (!budgetName || !budgetNumber) {
        return res.status(400).json({ message: 'Budget name and budget number are required' });
      }

      // Get the current timestamp
      const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

      await pool.execute(
        'INSERT INTO budget (username, budgetname, budgetnumber, date) VALUES (?, ?, ?, ?)',
        [username, budgetName, budgetNumber, currentDate]
      );

      res.json({ message: 'Budget added successfully' });
    } catch (error) {
      console.error('Error in addBudget:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

module.exports = budgetController;
