<script setup>
import { useSseStore } from '@/stores/sseStore';
import { storeToRefs } from 'pinia';
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  clientId: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const sseStore = useSseStore();
const { connected} = storeToRefs(sseStore);

function handleDisconnect() {
  sseStore.disconnect();
      // Redirection après déconnexion
      if (!connected.value) {
        console.log('Redirection après déconnexion...');
        router.push('/')
      }
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
