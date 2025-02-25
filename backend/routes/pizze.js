import express from "express";
import { connectToDatabase } from "../db.js";
const router = express.Router();
let db = await connectToDatabase();

router.get("/", async (req, res) => {
  let pizze_col = db.collection("pizze");

  try {
    let pizze = await pizze_col.find().toArray();
    if (pizze) {
      return res.status(200).json(pizze);
    } else {
      res.status(404).json({ message: "Pizze ne postoje!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  let pizze_col = db.collection("pizze");
  let nova_pizza = req.body;
  let obavezni_kljucevi = ["cijena", "naziv", "sastojci", "slika"];

  if (!obavezni_kljucevi.every((kljuc) => kljuc in nova_pizza)) {
    return res.status(400).json({ message: "Nedostaju obavezni kljucevi!" });
  }

  if (typeof nova_pizza.cijena != "number") {
    return res.status(400).json({ message: "Cijena mora biti broj!" });
  }

  for (let sastojak of nova_pizza.sastojci) {
    if (typeof sastojak != "string") {
      return res
        .status(400)
        .json({ message: "Sastojci moraju biti stringovi!" });
    }
  }

  try {
    let result = await pizze_col.insertOne(nova_pizza);
    return res.status(201).json({ insertedID: result.insertedId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
