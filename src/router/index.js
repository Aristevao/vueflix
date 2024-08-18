import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../components/Dashboard.vue';
import UnitList from '../components/UnitList.vue';
import Animais from '../components/AnimalList.vue';
import VaccineList from '../components/VaccineList.vue';
import Calendario from '../components/Calendario.vue';
import Notificacoes from '../components/Notificacoes.vue';

const routes = [
  { path: '/dashboard', component: Dashboard },
  { path: '/units', component: UnitList },
  { path: '/animals', component: Animais },
  { path: '/vaccines', component: VaccineList },
  { path: '/calendar', component: Calendario },
  { path: '/notifications', component: Notificacoes },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
