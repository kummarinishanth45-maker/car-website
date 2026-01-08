const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const router = express.Router();

// File storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Test Drive Booking
router.post('/book', upload.fields([
    { name: 'license', maxCount: 1 },
    { name: 'aadhar', maxCount: 1 },
    { name: 'photo', maxCount: 1 }
]), (req, res) => {
    const { CarModel, quantity, name, email, phone } = req.body;
    const licenseFile = req.files['license'][0].filename;
    const aadharFile = req.files['aadhar'][0].filename;
    const photoFile = req.files['photo'][0].filename;

    db.query(
        'INSERT INTO test_drives (CarModel, quantity, name, email, phone, license, aadhar, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [CarModel, quantity, name, email, phone, licenseFile, aadharFile, photoFile],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Test drive booked successfully' });
        }
    );
});

module.exports = router;
