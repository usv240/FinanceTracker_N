// config.js
module.exports = {
  SECRET_KEY: 'your-secret-key',
  apiUrl: 'http://localhost:5000', // Update this with your backend URL
  mysql: {
    host: 'nbadprojectfinal.cccnx8pptmin.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'abcde12345',
    database: 'sys',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
};
