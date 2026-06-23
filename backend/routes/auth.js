const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    const sql =
        "INSERT INTO users(full_name,email,password) VALUES(?,?,?)";

    db.query(
        sql,
        [username, email, password],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Registration Successful"
            });
        }
    );
});

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE email=? AND password=?";

    db.query(sql,
        [email, password],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Server Error"
                });
            }

            if (result.length > 0) {
                res.json({
                    success: true,
                    message: "Login Successful"
                });
            } else {
                res.json({
                    success: false,
                    message: "Invalid Credentials"
                });
            }
        });
});

module.exports = router;