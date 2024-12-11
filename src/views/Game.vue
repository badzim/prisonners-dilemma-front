<script setup>
import { useSseStore } from '@/stores/sseStore';
import { storeToRefs } from 'pinia';
import LoadingScreen from '../components/LoadingScreen.vue';
import { onMounted, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import GameLayout from '@/components/GameLayout.vue';

const sseStore = useSseStore();
const props = defineProps(['clientId'])

const {loading} = storeToRefs(sseStore);
const message = ref('')
const clientId = props.clientId

const router = useRouter();


console.log("hmmm", props.clientId)

onMounted(() => {
    connectToSSE()
  }  
)

function connectToSSE() {
  sseStore.connect(props.clientId);
  message.value = 'ping'
}


function initiateGame() {
  if (clientId) {
    // Naviguer vers la page du jeu avec le clientId en paramètre
    console.log("initiating game")
    router.push({ name: 'InitiateGame', params: { clientId: clientId } });
  }
}

function joinGame() {
  if (clientId) {
    // Naviguer vers la page du jeu avec le clientId en paramètre
    console.log("joining game")
    router.push({ name: 'JoinGame', params: { clientId: clientId } });
  }
}

watchEffect(() => {
      if (sseStore.onAuthError) {
        sseStore.disconnect(router);
      }
});


</script>


<template>
  <LoadingScreen v-if="loading" />
  <GameLayout v-else :client-id="clientId">
    <div class="game-page">
      <div class="game-content">
          <h1>Tu veux quoi ?</h1>
          <!-- Add your two choices here -->
          <div class="choices">
            <button class="choice-button" @click="initiateGame">Initier une Partie</button>
            <button class="choice-button" @click="joinGame">Rejoindre une Partie</button>
          </div>
        </div>
      </div>  
  </GameLayout>
</template>

<style scoped>
.game-page {
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.game-content h2 {
  margin-bottom: 20px;
}

.game-content p {
  font-size: 1.2rem;
  color: var(--primary-color);
}

.choices {
  display: flex;
  gap: 10px;
}

.choice-button {
  padding: 10px 20px;
  font-size: 1rem;
  color: white;
  background-color: var(--primary-color);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.choice-button:hover {
  background-color: var(--highlight-color);
}
</style>
