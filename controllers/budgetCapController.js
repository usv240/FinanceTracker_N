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

const budgetCapController = {
  addBudgetCap: async (req, res) => {
    try {
      const username = req.user.username;
      const { budgetName, budgetNumber } = req.body;

      console.log('Request payload:', req.body);

      if (!username || !budgetName || budgetNumber === undefined || isNaN(budgetNumber)) {
        console.error('Invalid input. Please provide valid data.');
        return res.status(400).json({ message: 'Invalid input. Please provide valid data.' });
      }

      // Check if the row already exists
      const [existingRows] = await pool.execute(
        'SELECT * FROM budgetcap WHERE username = ? AND budgetname = ?',
        [username, budgetName]
      );

      if (existingRows && existingRows.length > 0) {
        // Row already exists, update it
        const [result] = await pool.execute(
          'UPDATE budgetcap SET budgetnumber = ? WHERE username = ? AND budgetname = ?',
          [budgetNumber, username, budgetName]
        );

        if (result) {
          if (result.changedRows > 0) {
            const updatedBudgetCap = {
              username,
              budgetName,
              budgetNumber,
            };
            console.log('Updated Budget Capacity:', updatedBudgetCap);
            res.status(200).json({ message: 'Budget capacity updated successfully', updatedBudgetCap });
          } else {
            console.error('No changes were made. Database error:', result);
            res.status(200).json({ message: 'No changes were made to the budget capacity.' });
          }
        } else {
          console.error('Failed to update budget capacity. Database error:', result);
          res.status(500).json({ message: 'Failed to update budget capacity.' });
        }
      } else {
        // Row does not exist, insert a new one
        const [result] = await pool.execute(
          'INSERT INTO budgetcap (username, budgetname, budgetnumber) VALUES (?, ?, ?)',
          [username, budgetName, budgetNumber]
        );

        if (result) {
          if (result.insertId !== undefined) {
            const newBudgetCap = {
              username,
              budgetName,
              budgetNumber,
            };
            console.log('New Budget Capacity:', newBudgetCap);
            res.status(201).json({ message: 'Budget capacity added successfully', newBudgetCap });
          } else {
            console.error('Failed to insert budget capacity. Database error:', result);
            res.status(500).json({ message: 'Failed to insert budget capacity.' });
          }
        } else {
          console.error('Failed to insert budget capacity. Database error:', result);
          res.status(500).json({ message: 'Failed to insert budget capacity.' });
        }
      }
    } catch (error) {
      console.error('Error in addBudgetCap:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },


  getBudgetCap: async (req, res) => {
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
        query = 'SELECT budgetname, SUM(budgetnumber) as budgetnumber FROM budgetcap WHERE username = ? AND MONTH(date) = ? GROUP BY budgetname ORDER BY budgetname ASC';
      } else {
        query = 'SELECT budgetname, SUM(budgetnumber) as budgetnumber FROM budgetcap WHERE username = ? GROUP BY budgetname ORDER BY budgetname ASC';
      }
        
      console.log('SQL Query:', query);
      console.log('Query Parameters:', queryParams);

      const [budgets] = await pool.execute(query, queryParams);
      console.log(budgets);
      res.status(200).json({ data: budgets });
    } catch (error) {
      console.error('Error in getAllBudgets:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

};

module.exports = budgetCapController;
