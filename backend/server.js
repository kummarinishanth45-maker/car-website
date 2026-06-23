const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const testDriveRoutes = require("./routes/testdrive");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/testdrive", testDriveRoutes);

app.listen(5000, () => {
    console.log("Server Running on Port 5000");
});