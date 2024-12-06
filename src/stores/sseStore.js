// sseStore.js
import { defineStore } from 'pinia';

export const useSseStore = defineStore('sse', {
  state: () => ({
    eventSource: null,
    messages: [],
    connected: false,
    loading: true,
    errorMessage: '',

    // États spécifiques au jeu
    gameReady: false,
    userChoice: null,
    waitingForResult: false,
    canMakeChoice: true,
    gameFinished: false,
    gameEnAttente: true,
    gameMessage: '',
    tourFinishedMessage: '',
    countdown: 0,
  }),

  actions: {
    connect(clientId) {
      if (this.eventSource || this.connected) {
        console.log('Déjà connecté.');
        return;
      }

      this.loading = true;
      this.errorMessage = '';

      const baseUrl = 'https://api.dpr.codelands.me';
      const url = `${baseUrl}/api/sse/subscribe/${clientId}`;

      try {
        this.eventSource = new EventSource(url);

        this.eventSource.onopen = () => {
          console.log('Connexion SSE établie.');
          this.connected = true;
        };

        this.eventSource.onerror = (error) => {
          console.error('Erreur SSE :', error);
          this.errorMessage = 'Erreur lors de la connexion au serveur.';
          this.disconnect();
        };

        this.registerEventListeners();
      } catch (error) {
        console.error('Erreur lors de l’établissement de la connexion :', error);
        this.errorMessage = 'Impossible d’établir une connexion SSE.';
        this.loading = false;
      }
    },

    disconnect() {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
      this.connected = false;
      this.loading = false;
      this.messages = [];
      this.errorMessage = '';
      this.resetGameStates();
      console.log('Déconnecté du serveur SSE.');
    },

    registerEventListeners() {
      this.eventSource.addEventListener('game-started', (event) => {
        console.log('Message reçu :', event.data);
        this.gameReady = true;
        this.gameEnAttente = false;
        this.gameMessage = event.data;
      });

      this.eventSource.addEventListener('tour-finished', (event) => {
        console.log('Tour terminé :', event.data);
        this.tourFinishedMessage = event.data;
        this.startCountdown(8);
      });

      this.eventSource.addEventListener('make-choice', (event) => {
        console.log('Veuillez faire un choix :', event.data);
        this.gameMessage = event.data;
        this.canMakeChoice = true;
      });

      this.eventSource.addEventListener('game-finished', (event) => {
        console.log('Partie terminée :', event.data);
        this.gameMessage = event.data;
        this.gameFinished = true;
      });

      this.eventSource.addEventListener('ping', (event) => {
        console.log('Événement ping reçu :', event.data);
        this.messages.push(event.data);
        this.loading = false;
      });
    },

    startCountdown(duration) {
      this.countdown = duration;
      const interval = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown <= 0) {
          clearInterval(interval);
          this.waitingForResult = false;
        }
      }, 1000);
    },

    resetGameStates() {
      this.gameReady = false;
      this.userChoice = null;
      this.waitingForResult = false;
      this.canMakeChoice = true;
      this.gameFinished = false;
      this.gameMessage = '';
      this.gameEnAttente = true;
      this.tourFinishedMessage = '';
      this.countdown = 0;
    },
  },
});
