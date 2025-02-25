import express from "express";
import { connectToDatabase } from "../db.js";
const router = express.Router();
let db = await connectToDatabase();

class Narudzba {
  constructor(ime, adresa, telefon, naruceni_proizvodi) {
    (this.naruceni_proizvodi = naruceni_proizvodi),
      (this.ime = ime),
      (this.adresa = adresa),
      (this.telefon = telefon),
      (this.ukupna_cijena = 0);
  }
  async Ukupna_cijena() {
    let pizze_col = db.collection("pizze");
    let ukupno = 0;

    for (let e of this.naruceni_proizvodi) {
      let pizza_iz_baze = await pizze_col.findOne({ naziv: e.naziv });
      if (pizza_iz_baze) {
        ukupno += pizza_iz_baze.cijena * e.kolicina; // ✅ Ispravan izračun
      }
    }

    this.ukupna_cijena = ukupno; // ✅ Postavlja tačnu cijenu
  }
}

router.post("/", async (req, res) => {
  let nova_narudzba = req.body;
  let obavezni_kljucevi = ["ime", "adresa", "telefon", "naruceni_proizvodi"];
  let obavezni_kljucevi_stavke = ["naziv", "kolicina", "velicina"];

  if (!obavezni_kljucevi.every((kljuc) => kljuc in nova_narudzba)) {
    return res.status(400).json({ message: "Nedostaju obavezni kljucevi!" });
  }

  for (let kljuc of obavezni_kljucevi) {
    if (!nova_narudzba[kljuc]) {
      return res
        .status(400)
        .json({ message: "Fale obavezni kljucevi tj. prazni su!" });
    }
  }

  for (let stavka of nova_narudzba.naruceni_proizvodi) {
    if (!obavezni_kljucevi_stavke.every((kljuc) => kljuc in stavka)) {
      return res.status(400).json({ message: "Nedostaju obavezni kljucevi!" });
    }
  }
  for (let stavka of nova_narudzba.naruceni_proizvodi) {
    for (let kljuc of obavezni_kljucevi_stavke) {
      if (!stavka[kljuc]) {
        return res.status(400).json({
          message: "Nedostaju obavezni kljucevi stavke tj. prazni su!",
        });
      }
    }
  }

  try {
    let napravi_novu_narudzbu = new Narudzba(
      nova_narudzba.ime,
      nova_narudzba.adresa,
      nova_narudzba.telefon,
      nova_narudzba.naruceni_proizvodi
    );
    await napravi_novu_narudzbu.Ukupna_cijena();
    let Narudzbe_pizze_coll = db.collection("Narudzbe_pizze");
    await Narudzbe_pizze_coll.insertOne(napravi_novu_narudzbu);
    res.status(201).json({ message: "Napravili novu narudzbu!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
