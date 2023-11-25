const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';

const generateToken = (userData) => {
  return jwt.sign(userData, SECRET_KEY, { expiresIn: '1m', algorithm: 'HS256' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
