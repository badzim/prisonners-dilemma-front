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
    <h1 class="title">Initier une Partie</h1>
    <div class="game-content">
      <div class="initiate-game-container">
      <form @submit.prevent="initierRencontre" class="initiate-form">
        <div class="form-group">
          <label for="nombre-tours" class="form-label">Nombre de Tours :</label>
          <input
            id="nombre-tours"
            type="number"
            v-model="nombreTours"
            min="1"
            required
            class="form-input"
          />
        </div>
        <button type="submit" :disabled="loading" class="btn init-btn">
          {{ loading ? 'Chargement...' : 'Initier' }}
        </button>
      </form>
      <p v-if="statusMessage" :class="['status-message', { success: !loading, error: loading }]">
        {{ statusMessage }}
      </p>
      </div>
    </div >
    
  </GameLayout>
</template>

<style scoped>
.initiate-game-container {
  text-align: center;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.game-content {
  height: 82%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 1.8rem;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.initiate-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  text-align: left;
}

.form-label {
  font-size: 1rem;
  color: var(--primary-color);
  margin-bottom: 5px;
}

.form-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 5px;
}

.form-input:focus {
  border-color: var(--highlight-color);
  box-shadow: 0 0 8px var(--highlight-color);
}

.btn {
  padding: 12px 20px;
  font-size: 1rem;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.init-btn {
  background-color: var(--primary-color);
}

.init-btn:hover:not(:disabled) {
  background-color: var(--highlight-color);
}

.init-btn:disabled {
  background-color: var(--disabled-color);
  cursor: not-allowed;
}

.status-message {
  margin-top: 20px;
  font-size: 1rem;
}

.status-message.success {
  color: var(--positive-color);
}

.status-message.error {
  color: var(--error-color);
}
</style>
