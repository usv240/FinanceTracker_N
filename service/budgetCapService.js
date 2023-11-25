// service/budgetCapService.js
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

const handleAddBudgetCapacity = async (data) => {
  try {
    console.log('handleAddBudgetCapacity Token:', data.token);
    const apiUrl = 'http://localhost:5000/api/budgets/capacity';

    // Add the 'username' key to the data object
    data.username = data.username; // Use the passed username

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify(data),
    });

    // Log headers and request payload for debugging
    console.log('Request Headers:', response.headers);
    console.log('Request Payload:', JSON.stringify(data));

    if (response.ok) {
      const responseData = await response.json();
      console.log('Budget capacity added successfully:', responseData);
      // You can update your local state or perform any additional actions here
      return responseData; // Make sure to return the response data
    } else {
      console.error('Failed to add budget capacity:', response.statusText);

      // Log response body in case of an error
      const errorData = await response.json();
      console.error('Error Data:', errorData);

      // You can show an error message to the user or perform other error-handling actions
      throw new Error('Failed to add budget capacity'); // Throw an error to be caught in the calling function
    }
  } catch (error) {
    console.error('Error adding budget capacity:', error.message);
    throw error; // Throw the error to be caught in the calling function
  }
};


module.exports = budgetCapService;