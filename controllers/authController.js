const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const authService = require('../token/token'); // Import authService

const SECRET_KEY = 'your-secret-key';
const REFRESH_SECRET_KEY = 'your-refresh-secret-key'; // Use a different secret key for refresh tokens
const saltRounds = 10;

const pool = mysql.createPool({
  host: 'nbadprojectfinal.cccnx8pptmin.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'abcde12345',
  database: 'sys',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Fetch the user from the database based on the provided username
      const [users] = await pool.execute('SELECT * FROM users WHERE `Username` = ?', [username]);

      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const user = users[0];

      // Compare the provided password with the hashed password from the database
      const passwordMatch = await bcrypt.compare(password, user.Password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Generate a JWT token for the user
      const token = jwt.sign({ id: user.id, username: user.Username }, SECRET_KEY, { expiresIn: '10m' });

      // Generate a refresh token for the user
      const refreshToken = jwt.sign({ id: user.id, username: user.Username }, REFRESH_SECRET_KEY, { expiresIn: '5m' });
      console.log('authController token', token);
      console.log('authController refreshToken', refreshToken);
      res.json({ token, refreshToken });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  refreshAccessToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;
  
      // Verify the refresh token
      const newAccessToken = authService.verifyRefreshToken(refreshToken);
  
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      console.error('Token refresh error:', error);
  
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Refresh token has expired' });
      }
  
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
  },

  register: async (req, res) => {
    try {
      const { username, password, fullName } = req.body;

      // Check if the username already exists
      const [existingUsers] = await pool.execute('SELECT * FROM users WHERE `Username` = ?', [username]);

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Save the username, hashed password, and full name in the MySQL database
      await pool.execute('INSERT INTO users (`Fullname`, `Username`, `Password`) VALUES (?, ?, ?)', [fullName, username, hashedPassword]);
      res.json({ message: 'Registration successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};
const refreshAccessToken = async () => {
  try {
    const newToken = await authService.refreshAccessToken();
    setToken(newToken);
    localStorage.setItem('token', newToken);
    console.log('Access token refreshed successfully. New token:', newToken);
    return newToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    logout();
  }
};


module.exports = authController;
