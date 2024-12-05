<script setup>
import { ref } from 'vue';
import axios from 'axios';
import GameLayout from '@/components/GameLayout.vue';
import { useRouter } from 'vue-router';

// Props
const props = defineProps(['clientId']);

// Réactifs pour gérer le formulaire et les messages
const nombreTours = ref(3); // Par défaut à 3
const statusMessage = ref('');
const loading = ref(false);
const router = useRouter()

// Fonction pour initier une rencontre
async function initierRencontre() {
  loading.value = true;
  statusMessage.value = ''; // Réinitialise le message d'état

  try {
    const response = await axios.post('https://api.dpr.codelands.me/api/rencontre/initier', null, {
      params: {
        clientId: props.clientId,
        nombreTours: nombreTours.value,
      },
    });
    statusMessage.value = response.data; // Message de succès
    // Succès : Redirige vers la vue PartieEnCours
    router.push({ name: 'PartieEnCours', params: { clientId: props.clientId } });
  } catch (error) {
    if (error.response) {
      // Afficher le message d'erreur de l'API
      statusMessage.value = error.response.data;
    } else {
      statusMessage.value = 'Erreur de communication avec le serveur.';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <GameLayout :clientId="props.clientId">
    <div class="initiate-game">
      <h1>Initier une Partie</h1>
      <form @submit.prevent="initierRencontre">
        <label for="nombre-tours">Nombre de Tours :</label>
        <input
          id="nombre-tours"
          type="number"
          v-model="nombreTours"
          min="1"
          required
        />
        <button type="submit" :disabled="loading">
          {{ loading ? 'Chargement...' : 'Initier' }}
        </button>
      </form>
      <p v-if="statusMessage" :class="{'success': !loading, 'error': loading}">
        {{ statusMessage }}
      </p>
    </div>
  </GameLayout>
</template>

<style scoped>
.initiate-game {
  padding: 20px;
  font-family: Arial, sans-serif;
}

label {
  display: block;
  margin-bottom: 8px;
}

input {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
}

button {
  padding: 10px 20px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
