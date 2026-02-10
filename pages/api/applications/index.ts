// pages/api/applications/index.ts
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017", { useUnifiedTopology: true });
const dbName = "myapp";

export default async function handler(req, res) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("applications");

  if (req.method === "GET") {
    const apps = await collection.find({}).toArray();
    res.status(200).json(apps);
  } else if (req.method === "POST") {
    const { name, email, phone, education, address } = req.body;
    const result = await collection.insertOne({ name, email, phone, education, address });
    res.status(201).json(result.ops ? result.ops[0] : result);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
