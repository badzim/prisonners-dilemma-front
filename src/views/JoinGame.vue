<script setup>
import GameLayout from '@/components/GameLayout.vue'
import { useSseStore } from '@/stores/sseStore'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps(['clientId'])
const loading = ref(false)
const statusMessage = ref([])
const selectedRencontreId = ref('') // ID sélectionnée par l'utilisateur
const statusMessageRejoindre = ref('')
const router = useRouter()
const sseStore = useSseStore()
const {eventSource} = storeToRefs(sseStore)

// Fonction pour récupérer les rencontres
async function getRencontres() {
    loading.value = true
    statusMessage.value = []

    try {
        const response = await axios.get('https://api.dpr.codelands.me/api/rencontre/disponibles')
        statusMessage.value = response.data // Supposons que response.data est un tableau d'objets avec des idRencontre
    } catch (error) {
        if (error.response) {
            statusMessage.value = [{ idRencontre: 'Erreur: ' + error.response.data }]
        } else {
            statusMessage.value = [{ idRencontre: 'Erreur de communication avec le serveur.' }]
        }
    } finally {
        loading.value = false
    }
}

// Fonction pour initier une rencontre
async function rejoindreUneRencontre() {
    if (!selectedRencontreId.value) {
        statusMessageRejoindre.value = 'Veuillez sélectionner une rencontre.'
        return
    }

    loading.value = true
    statusMessageRejoindre.value = ''
    try {
        // Envoi des données au backend
        const response = await axios.post('https://api.dpr.codelands.me/api/rencontre/rejoindre', null, {
            params: {
                clientId: props.clientId, // Client ID passé comme prop
                idRencontre: selectedRencontreId.value, // ID de la rencontre sélectionnée
            },
        })
        statusMessageRejoindre.value = 'Succès: ' + response.data.message

        // Redirection vers la partie en cours
        router.push({ name: 'PartieEnCours', params: { clientId: props.clientId } })
    } catch (error) {
        if (error.response) {
            statusMessageRejoindre.value = 'Erreur: ' + error.response.data.message
        } else {
            statusMessageRejoindre.value = 'Erreur de communication avec le serveur.'
        }
    } finally {
        loading.value = false
    }
}

// Initialisation de SSE pour écouter les événements
function initializeSSE() {

    // Écoute des événements SSE
    eventSource.value.addEventListener('broadcast-game-taken', (event) => {

        console.log('Événement reçu : ', event.data)
        getRencontres() // Actualiser les rencontres
    })

    eventSource.value.addEventListener('broadcast-game-initiated-all', (event) => {
        console.log('Événement reçu : Game Initiated', event.data)
        getRencontres() // Actualiser les rencontres
    })

    eventSource.value.addEventListener('broadcast-player-disconnected', (event) => {
        console.log('Événement reçu : Player Disconnected', event.data)
        getRencontres() // Actualiser les rencontres
    })

    eventSource.value.onerror = (error) => {
        console.error('Erreur SSE :', error)
    }
}


onMounted(() => {
    getRencontres() // Récupérer les rencontres dès le chargement
    initializeSSE() // Configurer SSE
})

</script>

<template>
    <GameLayout :clientId="props.clientId">
        <h1 class="title">Rejoindre une Partie</h1>
        <div class="game-content">
            <div class="join-game-container">
                <div v-if="statusMessage.length" class="rencontres-list">
                    <select v-model="selectedRencontreId" class="select">
                        <option disabled value="">Sélectionnez une rencontre</option>
                        <option v-for="partie in statusMessage" :key="partie.idRencontre" :value="partie.idRencontre">
                            {{ partie.initiateur }}
                        </option>
                    </select>
                </div>
                <button
                    class="btn join-btn"
                    :disabled="loading || !selectedRencontreId"
                    @click="rejoindreUneRencontre"
                >
                    Rejoindre la rencontre
                </button>
                <p v-if="statusMessageRejoindre" class="status-message">{{ statusMessageRejoindre }}</p>
            </div>
        </div>
    </GameLayout>
</template>

<style scoped>
.join-game-container {
    text-align: center;
    padding: 20px;
    max-width: 500px;
    margin: 0 auto;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.game-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 90%;
}

.title {
    font-size: 1.8rem;
    color: var(--primary-color);
    margin-bottom: 20px;
}

.rencontres-list {
    margin-bottom: 20px;
}

.select {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    margin-top: 10px;
    border: 1px solid var(--border-color);
    border-radius: 5px;
}

.select:focus {
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

.join-btn {
    background-color: var(--primary-color);
}

.join-btn:hover:not(:disabled) {
    background-color: var(--highlight-color);
}

.status-message {
    margin-top: 20px;
    font-size: 1rem;
    color: var(--primary-color);
}
</style>
