import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue' // Ou changez le nom du fichier si vous le renommez
import Game from '@/views/Game.vue'

const routes = [
  { path: '/', name: 'Home', component: LandingPage },
  { path: '/game/:clientId', name: 'Game', component: Game, props:true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
