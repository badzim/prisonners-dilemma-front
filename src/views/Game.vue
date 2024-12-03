<template>
  <div class="game-page">
    <header class="game-header">
      <div class="player-id">ID Joueur : {{ clientId }}</div>
      <button class="disconnect-button" @click="disconnect">Se déconnecter</button>
    </header>
    <div class="game-content">
      <LoadingScreen v-if="loading" />
      <div v-else>
        <p v-if="message">message du serveur : {{ message }}</p>
        <!-- Autres éléments du jeu -->
      </div>
    </div>
  </div>
</template>

<script>
import LoadingScreen from '../components/LoadingScreen.vue';

export default {
  name: 'Game',
  props: ['clientId'],
  components: {
    LoadingScreen,
  },
  data() {
    return {
      eventSource: null,
      message: '',
      connected: false,
      loading: true, // Nouvel état pour le chargement
    };
  },
  mounted() {
    this.connectToSSE();
  },
  methods: {
    connectToSSE() {
      if (this.connected) {
        console.log('Déjà connecté.');
        return;
      }

      const baseUrl = 'http://localhost:8001'; // Assurez-vous que cette URL correspond à votre backend
      const url = `${baseUrl}/api/sse/subscribe/${this.clientId}`;

      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        console.log('Connexion SSE établie.');
        this.connected = true;
        // On attend le ping du serveur, le chargement reste actif
      };

      this.eventSource.onmessage = (event) => {
        console.log('Message reçu :', event.data);
        this.message = event.data;
      };

      this.eventSource.onerror = (error) => {
        console.error('Erreur SSE :', error);
        if (this.eventSource.readyState === EventSource.CLOSED) {
          console.log('Tentative de reconnexion dans 5 secondes...');
          setTimeout(() => {
            this.connectToSSE();
          }, 5000);
        }
      };

      // Écoute de l'événement 'ping' pour arrêter le chargement
      this.eventSource.addEventListener('ping', (event) => {
        console.log('Événement ping reçu :', event.data);
        this.message = event.data;
        this.loading = false; // Arrête le chargement une fois le ping reçu
      });
    },
    disconnect() {
      if (this.eventSource) {
        this.eventSource.close();
        this.connected = false;
        this.message = 'Déconnecté du serveur.';
        console.log('Connexion SSE fermée.');
        // Redirige vers la page d'accueil après déconnexion
        this.$router.push({ name: 'Home' });
      }
    },
  },
  beforeUnmount() {
    this.disconnect();
  },
};
</script>

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
</style>
