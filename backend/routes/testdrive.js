const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/book", (req, res) => {

    const {
        name,
        email,
        phone,
        carmodel,
        booking_date
    } = req.body;

    const sql =
        "INSERT INTO testdrive(name,email,phone,carmodel,booking_date) VALUES(?,?,?,?,?)";

    db.query(
        sql,
        [name, email, phone, carmodel, booking_date],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Booking Failed"
                });
            }

            res.json({
                message: "Test Drive Booked Successfully"
            });
        }
    );
});

module.exports = router;