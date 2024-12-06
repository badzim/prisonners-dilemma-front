<script setup>
import { useSseStore } from '@/stores/sseStore';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { defineProps, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  clientId: {
    type: String,
    required: true,
  },
});

const router = useRouter()

const sseStore = useSseStore();
const { connected, gameReady, waitingForResult, onAuthError } = storeToRefs(sseStore);

async function handleDisconnect() {
  if (gameReady.value) {
    // Envoyer le choix "abandonne" avec la stratégie définie
    try {

      await axios.post('https://api.dpr.codelands.me/api/rencontre/play/choix', null, {
          params: {
            clientId: props.clientId,
            action: 'ABONDONNER',
            strategie: 'ALEATOIRE',
          },
      });
      console.log('Choix envoyé au serveur');
    } 
    catch (error) {
      console.error("Erreur lors de l'envoi du choix :", error);
    } 
    finally {
      waitingForResult.value = false;
    }
  }

  // Déconnecter le client
  sseStore.disconnect(router);
}


</script>

<template>
  <div class="game-layout">
    <!-- Header commun -->
    <header class="game-header">
      <div class="player-id">ID Joueur : {{ clientId }}</div>
      <button class="disconnect-button" @click="handleDisconnect">Se déconnecter</button>
    </header>
    <!-- Slot pour le contenu -->
    <main class="game-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.game-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
}

.player-id {
  font-size: 1rem;
  color: var(--primary-color);
}

.disconnect-button {
  padding: 10px 20px;
  font-size: 1rem;
  color: var(--vt-c-white);
  background-color: var(--negative-color);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.disconnect-button:hover {
  background-color: darkred;
}

.game-content {
  flex-grow: 1;
  padding: 20px;
}
</style>
