const express = require("express");
const mysql = require("mysql2");       // mysql2 for SSL
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));  
require('dotenv').config();


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
  }
});

db.connect(err => {
    if (err) {
        console.log("MySQL Connection Failed", err);
    } else {
        console.log("MySQL Connected Successfully!");
    }
});

app.post("/save", (req, res) => {
    const { username, text } = req.body;
    if (!username || !text) return res.status(400).send({ message: "Username & Text Required" });

    const checkQuery = "SELECT * FROM note WHERE username = ?";
    db.query(checkQuery, [username], (err, result) => {
        if (err) return res.status(500).send(err);

        if (result.length > 0) {
            db.query("UPDATE note SET text=? WHERE username=?", [text, username], (err) => {
                if (err) return res.status(500).send(err);
                res.send({ message: "Updated Successfully" });
            });
        } else {
            db.query("INSERT INTO note(username, text) VALUES (?,?)", [username, text], (err) => {
                if (err) return res.status(500).send(err);
                res.send({ message: "Saved Successfully" });
            });
        }
    });
});

app.get("/load/:username", (req, res) => {
    const username = req.params.username;

    db.query("SELECT text FROM note WHERE username=?", [username], (err, result) => {
        if (err) return res.status(500).send(err);

        if (result.length === 0) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send({ text: result[0].text });
    });
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "note1.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
