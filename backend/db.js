require('dotenv').config();
const mysql = require("mysql2");

const db = mysql.createPool({
  connectionLimit: 10, // optional: set pool size
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === "true",
  },
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database: " + err.message);
    return;
  }
  console.log("Connected to Azure MySQL Database");

  connection.query('SELECT DATABASE() AS name', (err, result) => {
    connection.release(); // 🔓 always release after use
    if (err) {
      console.error("Could not fetch DB name:", err.message);
    } else {
      console.log("Connected to DB:", result[0].name);
    }
  });
});

module.exports = db;
