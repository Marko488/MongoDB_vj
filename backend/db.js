import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();
let Mongouri = process.env.MONGO_URI;
let db_name = process.env.DB_NAME;

async function connectToDatabase() {
  try {
    const client = new MongoClient(Mongouri);
    await client.connect();
    let db = client.db(db_name);
    console.log("Uspjesno spojeno na bazu podataka!");
    return db;
  } catch (error) {
    console.log("Greska prilikom povezivanja na bazu podataka!");
    throw error;
  }
}

export { connectToDatabase };
