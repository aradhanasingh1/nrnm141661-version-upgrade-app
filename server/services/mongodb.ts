import { MongoClient, Db } from "mongodb"

const url = process.env.MONGO_URL || "mongodb://localhost:27017"
const dbName = process.env.DB_NAME || "legacy_app"

let db: Db | null = null

export async function connect(): Promise<Db> {
  if (db) return db

  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as any)

  db = client.db(dbName)
  return db
}
