const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sql555",
    database: "carhub"
});

db.connect((err) => {
    if (err) {
        console.log("Database Error");
    } else {
        console.log("MySQL Connected");
    }
});

module.exports = db;