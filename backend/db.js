const mysql = require("mysql2/promise");
require('dotenv').config();

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
  },
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test the connection
db.getConnection()
  .then(connection => {
    console.log("Connected to Azure MySQL Database");
    return connection.query('SELECT DATABASE() AS name')
      .then(([result]) => {
        console.log("Connected to DB:", result[0].name);
        connection.release();
      });
  })
  .catch(err => {
    console.error("Error connecting to database:", err);
    console.error("Error code:", err.code);
    console.error("Error state:", err.sqlState);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
  });

// Add error handler for the pool
db.on('error', (err) => {
  console.error('Database pool error:', err);
  console.error('Error code:', err.code);
  console.error('Error state:', err.sqlState);
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);
});

module.exports = db;
