import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import UnitList from '../components/UnitList.vue'
import Animais from '../components/AnimalList.vue'
import VaccineList from '../components/VaccineList.vue'
import AnimalVaccine from '../components/AnimalVaccineList.vue'
import Notification from '../components/NotificationList.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/unit', name: 'Units', component: UnitList },
  { path: '/animal', name: 'Animals', component: Animais },
  { path: '/vaccine', name: 'Vaccines', component: VaccineList },
  { path: '/animalVaccine', name: 'AnimalVaccine', component: AnimalVaccine },
  { path: '/notification', name: 'Notifications', component: Notification }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
