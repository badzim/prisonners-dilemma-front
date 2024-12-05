<template>
  <div class="landing-page">
    <h1>Bienvenue dans le jeu du Dilemme du Prisonnier</h1>
    <input
      type="text"
      v-model="clientId"
      placeholder="Entrez votre identifiant"
      class="client-id-input"
    />
    <button
      class="play-button"
      :disabled="!clientId"
      @click="goToGame"
    >
      Jouer
    </button>
  </div>
</template>

<script setup>
import router from '@/router';
import { ref } from 'vue';

const clientId = ref('')

function goToGame() {
  if (clientId) {
    // Naviguer vers la page du jeu avec le clientId en paramètre
    router.push({ name: 'Game', params: { clientId: clientId.value } });
  }
}
</script>

<style scoped>
.landing-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.landing-page h1 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 40px;
}

.client-id-input {
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 20px;
  width: 100%;
  max-width: 300px;
  border: 1px solid var(--primary-color);
  border-radius: 5px;
}

.play-button {
  padding: 15px 30px;
  font-size: 1.2rem;
  color: var(--text-color-alt);
  background-color: var(--primary-color);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.play-button:disabled {
  background-color: var(--neutral-color);
  cursor: not-allowed;
}

.play-button:hover:not(:disabled) {
  background-color: var(--highlight-color);
}
</style>
