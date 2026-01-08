const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

/* ------------------- LOGIN API ------------------- */
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

/* ------------------- REGISTER API ------------------- */
app.post('/register', (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [fullName, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User registered successfully' });
  });
});

/* ------------------- BOOK TEST DRIVE API ------------------- */
app.post(
  '/book-test-drive',
  upload.fields([
    { name: 'license', maxCount: 1 },
    { name: 'aadhar', maxCount: 1 },
    { name: 'photo', maxCount: 1 }
  ]),
  (req, res) => {
    try {
      const { CarModel, quantity, name, email, phone } = req.body;

      if (!CarModel || !quantity || !name || !email) {
        return res.status(400).json({ message: 'All required fields must be filled' });
      }

      const licensePath = req.files['license'][0].path;
      const aadharPath = req.files['aadhar'][0].path;
      const photoPath = req.files['photo'][0].path;

      const sql = `
        INSERT INTO test_drives 
        (car_model, quantity, name, email, phone, license_path, aadhar_path, photo_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [CarModel, quantity, name, email, phone, licensePath, aadharPath, photoPath],
        (err) => {
          if (err) {
            console.error('DB error:', err);
            return res.status(500).json({ message: 'Database error' });
          }
          res.json({ message: 'Test drive booked successfully!' });
        }
      );
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
