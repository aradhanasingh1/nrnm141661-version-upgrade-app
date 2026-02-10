const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const { connect } = require("../mongodb");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  // Signup route
  server.post("/api/signup", async (req, res) => {
    try {
      const db = await connect();
      const users = db.collection("users");

      const { username, email, password, role } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await users.insertOne({
        username,
        email,
        password, // ⚠️ hash in production
        role,
        createdAt: new Date(),
      });

      res.json({ message: "User created", id: result.insertedId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Let Next handle everything else
  server.all("*", (req, res) => handle(req, res));

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
