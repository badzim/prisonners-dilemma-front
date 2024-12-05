import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue' // Ou changez le nom du fichier si vous le renommez
import Game from '@/views/Game.vue'
import JoinGame from '@/views/JoinGame.vue';
import InitiateGame from '@/views/InitiateGame.vue';
import PartieEnCours from '@/views/PartieEnCours.vue';

const routes = [
  { path: '/', name: 'Home', component: LandingPage },
  { path: '/game/:clientId', name: 'Game', component: Game, props:true },
  { path: '/game/initiate-game/:clientId', name: 'InitiateGame', component: InitiateGame, props:true },
  { path: '/game/join-game/:clientId', name: 'JoinGame', component: JoinGame, props:true },
  { path: '/game/partie-en-cours/:clientId', name: 'PartieEnCours', component: PartieEnCours, props:true }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
