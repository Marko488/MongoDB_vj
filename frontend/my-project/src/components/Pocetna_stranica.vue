<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const pizze = ref([]);
const korisnik = ref({ ime: "", adresa: "", telefon: "" });
const errorMessage = ref("");
const successMessage = ref("");

// Dohvatanje pizza sa servera
const fetchPizze = async () => {
  try {
    const response = await axios.get("http://localhost:3000/pizze");
    pizze.value = response.data.map((pizza) => ({
      ...pizza,
      kolicina: 1,
      odabrana: false,
      velicina: "srednja",
    }));
  } catch (error) {
    console.error("Greška pri dohvaćanju pizza:", error.message);
  }
};

// Funkcija za naručivanje
const naruciPizze = async () => {
  errorMessage.value = "";
  const naruceni_proizvodi = pizze.value
    .filter((pizza) => pizza.odabrana && pizza.kolicina > 0)
    .map((pizza) => ({
      naziv: pizza.naziv,
      kolicina: pizza.kolicina,
      velicina: pizza.velicina,
    }));

  if (naruceni_proizvodi.length == 0) {
    errorMessage.value = "Morate odabrat neku pizzu za narudznu!";
    return;
  }

  try {
    const response = await axios.post("http://localhost:3000/narudzbe", {
      ime: korisnik.value.ime,
      adresa: korisnik.value.adresa,
      telefon: korisnik.value.telefon,
      naruceni_proizvodi,
    });

    // Prikazuje tačno poruku sa backend-a
    successMessage.value =
      response.data.message || "Narudžba je uspješno poslana!";
    errorMessage.value = "";
  } catch (error) {
    // Ako backend vrati detaljnu grešku, frontend je prikazuje
    errorMessage.value = error.response?.data?.message || "Došlo je do greške!";
    successMessage.value = "";
  }
};

onMounted(fetchPizze);
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-900">
      🍕 Naša ponuda pizza 🍕
    </h1>

    <!-- Unos korisničkih podataka -->
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 class="text-xl font-semibold mb-4">Unesite podatke za narudžbu</h2>
      <input
        v-model="korisnik.ime"
        type="text"
        placeholder="Ime"
        class="w-full mb-3 p-2 border rounded"
      />
      <input
        v-model="korisnik.adresa"
        type="text"
        placeholder="Adresa"
        class="w-full mb-3 p-2 border rounded"
      />
      <input
        v-model="korisnik.telefon"
        type="text"
        placeholder="Telefon"
        class="w-full mb-3 p-2 border rounded"
      />
    </div>

    <!-- Lista pizza -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
    >
      <div
        v-for="pizza in pizze"
        :key="pizza._id"
        class="bg-white rounded-2xl shadow-lg p-4"
      >
        <img
          :src="pizza.slika"
          :alt="pizza.naziv"
          class="w-full h-48 object-cover rounded-md"
        />
        <h2 class="text-xl font-semibold text-gray-800 mt-2">
          {{ pizza.naziv }}
        </h2>
        <p class="text-gray-600 text-sm">{{ pizza.sastojci.join(", ") }}</p>
        <p class="text-lg font-bold text-green-600 mt-2">
          {{ pizza.cijena }} kn
        </p>

        <!-- Checkbox za odabir pizze -->
        <div class="flex items-center mt-3">
          <input
            type="checkbox"
            v-model="pizza.odabrana"
            class="w-5 h-5 text-blue-600"
          />
          <span class="ml-2 text-gray-700">Odaberi ovu pizzu</span>
        </div>

        <!-- Unos količine i veličine -->
        <div class="mt-2" v-if="pizza.odabrana">
          <label class="text-gray-700 text-sm">Količina:</label>
          <input
            type="number"
            v-model="pizza.kolicina"
            min="1"
            class="w-16 p-1 border rounded text-center"
          />

          <label class="text-gray-700 text-sm ml-4">Veličina:</label>
          <select v-model="pizza.velicina" class="p-1 border rounded">
            <option value="mala">Mala</option>
            <option value="srednja">Srednja</option>
            <option value="velika">Velika</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Poruka o grešci -->
    <div
      v-if="errorMessage"
      class="mt-6 text-red-600 text-center font-semibold bg-red-200 p-3 rounded-lg"
    >
      {{ errorMessage }}
    </div>

    <!-- Poruka o uspešnoj narudžbi -->
    <div
      v-if="successMessage"
      class="mt-6 text-green-600 text-center font-semibold bg-green-200 p-3 rounded-lg"
    >
      {{ successMessage }}
    </div>

    <!-- Dugme za naručivanje -->
    <div class="text-center mt-8">
      <button
        @click="naruciPizze"
        class="bg-blue-500 text-white px-6 py-3 text-lg rounded-lg hover:bg-blue-600"
      >
        Naruči pizze
      </button>
    </div>
  </div>
</template>
