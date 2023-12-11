// config.js
module.exports = {
  SECRET_KEY: 'ujwal',
  apiUrl: 'http://localhost:5000', 
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
