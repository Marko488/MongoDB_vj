import express from "express";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "./db.js";
import pizzeRouter from "./routes/pizze.js";
import narudzbeRouter from "./routes/narudzbe.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
app.use("/pizze", pizzeRouter);
app.use("/narudzbe", narudzbeRouter);
const PORT = 3000;

app.listen(PORT, (e) => {
  if (e) {
    console.log("Greska prilikom pokretanja posluzitelja!");
  } else {
    console.log("Posluzizetelj dela!");
  }
});
