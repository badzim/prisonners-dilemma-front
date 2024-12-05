<script setup>
import { defineProps } from 'vue';

const props = defineProps(['clientId']); // Client ID passé depuis la route
</script>

<template>
  <div class="partie-en-cours">
    <h1>Partie en Cours</h1>
    <p>En attente d'un autre joueur pour commencer la partie...</p>
    <p>Votre ID : {{ clientId }}</p>
  </div>
</template>

<style scoped>
.partie-en-cours {
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  color: #007bff;
}

p {
  margin: 10px 0;
}
</style>
