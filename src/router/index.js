import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Dashboard from '../components/Dashboard.vue'
import UnitList from '../components/UnitList.vue'
import Animais from '../components/AnimalList.vue'
import VaccineList from '../components/VaccineList.vue'
import VaccineAnimal from '../components/VaccineAnimal.vue'
import Notification from '../components/NotificationList.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/home', name: 'Home', component: Home },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/unit', name: 'Units', component: UnitList },
  { path: '/animal', name: 'Animals', component: Animais },
  { path: '/vaccine', name: 'Vaccines', component: VaccineList },
  { path: '/vaccineAnimal', name: 'VaccineAnimal', component: VaccineAnimal },
  { path: '/notification', name: 'Notifications', component: Notification }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
