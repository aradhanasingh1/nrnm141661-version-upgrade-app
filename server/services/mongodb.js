// server/services/mongodb.js
const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "legacy_app";

let db = null;

async function connect() {
  if (db) return db;

  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db = client.db(dbName);
  return db;
}

module.exports = { connect };
