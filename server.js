const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));  // Serve frontend folder

// ---------------- MySQL Connection -------------------
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "noteit",
    port: 3307
});

db.connect((err) => {
    if (err) {
        console.log("MySQL Connection Failed", err);
    } else {
        console.log("MySQL Connected Successfully!");
    }
});

// ---------------- API ROUTES -------------------

// Save or update text based on username
app.post("/save", (req, res) => {
    console.log("REQ.BODY:", req.body);

    const { username, text } = req.body;

    if (!username) {
        return res.status(400).send({ message: "Username Required" });
    }

    const checkQuery = "SELECT * FROM note WHERE username = ?";
    db.query(checkQuery, [username], (err, result) => {
        if (err) return res.status(500).send(err);

        if (result.length > 0) {
            const updateQuery = "UPDATE note SET text=? WHERE username=?";
            db.query(updateQuery, [text, username], (err) => {
                if (err) return res.status(500).send(err);
                res.send({ message: "Updated Successfully" });
            });
        } else {
            const insertQuery = "INSERT INTO note(username, text) VALUES (?,?)";
            db.query(insertQuery, [username, text], (err) => {
                if (err) return res.status(500).send(err);
                res.send({ message: "Saved Successfully" });
            });
        }
    });
});

// Get saved text
app.get("/load/:username", (req, res) => {
    const username = req.params.username;
    const query = "SELECT text FROM note WHERE username=?";

    db.query(query, [username], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length > 0) {
            res.send({ text: result[0].text });
        } else {
            res.send({ text: "" });
        }
    });
});

// ---------------- Serve note1.html on root ----------------
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "note1.html"));
});

// ---------------- START SERVER -------------------
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
