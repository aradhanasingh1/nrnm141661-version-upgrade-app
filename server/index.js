const path = require("path");
process.chdir(path.join(__dirname, ".."));

const express = require("express");
const next = require("next");
const cors = require("cors");

console.log("NODE_ENV =", process.env.NODE_ENV);

const port = 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middlewares
  server.use(cors());
  server.use(express.json()); // fixes req.body undefined
  server.use(express.urlencoded({ extended: true }));

  // API routes
  const authRouter = require("./routes/auth"); // CommonJS require
  server.use("/api/auth", authRouter);

  // Next.js pages
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
