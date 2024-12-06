<script setup>
import GameLayout from '@/components/GameLayout.vue';
import { useSseStore } from '@/stores/sseStore';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps(['clientId']);

// SSE Store
const sseStore = useSseStore();
const {
  gameReady,
  userChoice,
  waitingForResult,
  canMakeChoice,
  gameFinished,
  gameMessage,
  countdown,
  gameEnAttente,
  tourFinishedMessage,
} = storeToRefs(sseStore);

// Gestion de l'abandon
const abandonModalVisible = ref(false); // Affiche la modale pour abandonner
const selectedStrategy = ref(''); // Stratégie choisie par l'utilisateur
const strategies = ref([
  'DONNANTDONNANT',
  'DONNANTDONNANTALEATOIRE',
  'DONNANTPOURDEUXDONNANTS',
  'DONNANTPOURDEUXDONNANTSALEATOIRE',
  'SONDEURNAIF',
  'SONDEURREPENTANT',
  'PACIFICATEURNAIF',
  'VRAIPACIFICATEUR',
  'ALEATOIRE',
  'TOUJOURSTRAHIR',
  'TOUJOURSCOOPERER',
  'RANCUNIERSTRATEGIE',
  'PAVLOVSTRATEGIE',
  'PAVLOVALEATOIRE',
  'ADAPTATIF',
  'GRADUEL',
  'DONNANTDONNANTSOUPCONNEUX',
  'RANCUNIERDOUX',
]);

const router = useRouter()

// Gérer le choix de l'utilisateur
async function handleUserChoice(choice) {
  if (!waitingForResult.value) {
    userChoice.value = choice;
    waitingForResult.value = true;
    canMakeChoice.value = false;

    try {
      await axios.post('https://api.dpr.codelands.me/api/rencontre/play/choix', null, {
        params: {
          clientId: props.clientId,
          action: userChoice.value,
          strategie: selectedStrategy.value,
        },
      });
      console.log('Choix envoyé au serveur');
    } catch (error) {
      console.error("Erreur lors de l'envoi du choix :", error);
    }
  }
}

// Gérer l'abandon
async function handleAbandon() {
  if (!selectedStrategy.value) {
    alert('Veuillez sélectionner une stratégie avant d’abandonner.');
    return;
  }
    handleUserChoice('ABONDONNER')
    console.log('Abandon envoyé avec la stratégie :', selectedStrategy.value);
    gameFinished.value = true;
    gameMessage.value = 'Vous avez abandonné la partie.';
    abandonModalVisible.value = false;
} 


// Gérer l'abandon
function redirectToHome() {
    sseStore.resetGameStates()
    router.push({ name: 'Game', params: { clientId: props.clientId } });
} 


</script>


<template>
    <GameLayout :clientId="props.clientId">
      <div  class="partie-en-cours">
        <h1 v-if="gameEnAttente">Partie en Attente</h1>
        <p v-if="gameEnAttente">Veuillez attendre qu'un  joueur rejoigne votre partie   </p>
        <h1 v-if="!gameFinished && !gameEnAttente">Partie en Cours</h1>
        <p v-if="gameReady && !gameFinished && !waitingForResult ">{{ gameMessage }}</p>
        <p v-if="waitingForResult && !gameFinished && gameReady && countdown <= 0">Veuillez attendre la réponse de l'autre joueur</p>
        <div v-if="countdown > 0 && !gameFinished">
          <p>{{ tourFinishedMessage }}</p>
          <p>Prochain tour dans {{ countdown }} seconde(s)...</p>
        </div>
  
        <!-- Boutons pour Coopérer ou Trahir -->
        <div v-if="gameReady && !gameFinished" class="choices">
          <button
            class="btn btn-cooperate"
            :disabled="waitingForResult"
            @click="handleUserChoice('COOPERER')"
          >
            Coopérer
          </button>
          <button
            class="btn btn-betray"
            :disabled="waitingForResult"
            @click="handleUserChoice('TRAHIR')"
          >
            Trahir
          </button>
        </div>
  
        <!-- Bouton Abandonner -->
        <button
          class="btn btn-abandon"
          v-if="gameReady && !gameFinished"
          :disabled="waitingForResult"
          @click="abandonModalVisible = true"
        >
          Abandonner
        </button>


  
        <!-- Modale pour abandonner -->
        <div v-if="abandonModalVisible" class="modal">
          <div class="modal-content">
            <h3>Abandonner la partie</h3>
            <p>Veuillez choisir une stratégie avant d’abandonner :</p>
            <select v-model="selectedStrategy">
              <option disabled value="">Sélectionnez une stratégie</option>
              <option v-for="strategy in strategies" :key="strategy" :value="strategy">
                {{ strategy }}
              </option>
            </select>
            <div class="modal-buttons">
              <button class="btn btn-confirm" @click="handleAbandon">Confirmer</button>
              <button class="btn btn-cancel" @click="abandonModalVisible = false">Annuler</button>
            </div>
          </div>
        </div>
  
        <!-- Message en cas de fin de partie -->
        <div v-if="gameFinished" class="game-finished">
          <h2>Partie terminée</h2>
          <p>{{ gameMessage }}</p>
        </div>
                        <!-- Bouton Abandonner -->
        <button
          class="btn btn-abandon"
          v-if="gameFinished"
          :disabled="!gameFinished"
          @click="redirectToHome"
        >
          Home
        </button>
      </div>
    </GameLayout>
  </template>
  

<style scoped>
.partie-en-cours {
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  color: #007bff;
  margin-bottom: 20px;
}

p {
  margin: 10px 0;
  font-size: 16px;
}

.choices {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  margin: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:focus {
  outline: none;
}

.btn:disabled {
  background-color: var(--neutral-color);
  cursor: not-allowed;
}

.btn-cooperate {
  background-color: #28a745; /* Vert pour Coopérer */
  color: white;
}

.btn-betray {
  background-color: #dc3545; /* Rouge pour Trahir */
  color: white;
}

.btn-abandon {
  background-color: #ff5733; /* Orange pour abandonner */
  color: white;
}

.btn-confirm {
  background-color: #28a745; /* Vert pour confirmer */
  color: white;
}

.btn-cancel {
  background-color: #dc3545; /* Rouge pour annuler */
  color: white;
}

button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

button:active {
  transform: scale(1);
  box-shadow: none;
}

.game-finished {
  margin-top: 20px;
  font-size: 18px;
  color: #6c757d;
}

.modal {
  position: fixed;
  top: 29%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
}

.modal-content {
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
