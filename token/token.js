const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';
const REFRESH_SECRET_KEY = 'your-refresh-secret-key';

const generateAccessToken = (userData) => {
  return jwt.sign(userData, SECRET_KEY, { expiresIn: '10m', algorithm: 'HS256' });
};

const generateRefreshToken = (userData) => {
  return jwt.sign(userData, REFRESH_SECRET_KEY, { expiresIn: '5m', algorithm: 'HS256' });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET_KEY);
  } catch (error) {
    return null;
  }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
