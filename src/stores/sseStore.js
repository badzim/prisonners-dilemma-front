// sseStore.js
import { defineStore } from 'pinia';

export const useSseStore = defineStore('sse', {
  state: () => ({
    eventSource: null,
    messages: [],
    connected: false,
    loading: true,
    errorMessage: '',
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

        this.eventSource.onmessage = (event) => {
          const data = event.data;
          console.log('Message reçu :', data);
          this.messages.push(data);
        };

        this.eventSource.onerror = (error) => {
          console.error('Erreur SSE :', error);
          this.errorMessage = 'Erreur lors de la connexion au serveur.';
          this.disconnect();

          // Retente la connexion après 5 secondes
          setTimeout(() => {
            this.connect(clientId);
          }, 5000);
        };

        // Arrête le chargement une fois le ping reçu
        this.eventSource.addEventListener('ping', (event) => {
          console.log('Événement ping reçu :', event.data);
          this.messages.push(event.data);
          this.loading = false;
        });
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
      console.log('Déconnecté du serveur SSE.');
    },
  },
});
