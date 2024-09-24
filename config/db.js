const mysql = require('mysql2');
const config = require('./config');

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME
});

// Promisify pool queries
const promisePool = pool.promise();

// Test the connection when starting the app
promisePool.getConnection()
  .then((connection) => {
    console.log('DB Connected');
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error('Error connecting to DB:', err.message);
  });

module.exports = promisePool;

