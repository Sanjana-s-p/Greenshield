// server.js
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const con = require('./db');

const app = express();
const PORT = 9990;

const publicpath = path.join(__dirname, 'public');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(publicpath));

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(publicpath, 'home1.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(publicpath, 'home1.html'));
});

// Login page
app.get('/Login', (req, res) => {
  res.sendFile(path.join(publicpath, 'Login.html'));
});

// Registration page
app.get('/Registration', (req, res) => {
  res.sendFile(path.join(publicpath, 'Registration.html'));
});

// Registration handler
app.post('/RegistrationValidation', (req, res) => {
  const { name, email, psw: password, cpass, address, gender, hobbies } = req.body;

  if (password !== cpass) {
    return res.status(400).send('Passwords do not match');
  }

  const hobbyString = Array.isArray(hobbies) ? hobbies.join(',') : hobbies;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send('Error hashing password');

    const sql = 'INSERT INTO user (name, email, psw, address, gender, hobbies) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [name, email, hash, address, gender, hobbyString];

    con.query(sql, values, (err) => {
      if (err) return res.status(500).send('Error saving user to database');
      res.redirect('/Login.html');
    });
  });
});

// Login handler
app.post('/LoginValidation', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt with:', username);

  con.query('SELECT * FROM user WHERE email = ?', [username], (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      console.log('No user found with this email');
      return res.status(401).send('Invalid email or password');
    }

    const storedHash = results[0].psw;
    console.log('Stored hash:', storedHash);

    bcrypt.compare(password, storedHash, (err, result) => {
      if (err) {
        console.error('Compare error:', err);
        return res.status(500).send('Error comparing passwords');
      }

      if (result) {
        console.log('Login successful');
        res.sendFile(path.join(publicpath, 'main.html'));
      } else {
        console.log('Password mismatch');
        res.status(401).send('Invalid email or password');
      }
    });
  });
});


// Catch-all route
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(publicpath, 'home1.html'));
});

// Start server silently (no log)
app.listen(PORT);
