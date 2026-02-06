import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';
let client: MongoClient;
let db: Db;

export async function connect(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(); // default DB from URI
  console.log('✅ Connected to MongoDB');
  return db;
}
