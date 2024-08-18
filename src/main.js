import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';

import Dashboard from './components/Dashboard.vue';
import Fazendas from './components/Fazendas.vue';
import Animais from './components/AnimalList.vue';
import Vacinas from './components/Vacinas.vue';
import Calendario from './components/Calendario.vue';
import Notificacoes from './components/Notificacoes.vue';

const routes = [
  { path: '/dashboard', component: Dashboard },
  { path: '/units', component: Fazendas },
  { path: '/animals', component: Animais },
  { path: '/vaccines', component: Vacinas },
  { path: '/calendar', component: Calendario },
  { path: '/notifications', component: Notificacoes },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');
