// db.js
const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // your MySQL username
  password: 'root1',       // your MySQL password ('' if none)
  database: 'db' // replace with your database name
});

con.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to database.');
});

module.exports = con;
