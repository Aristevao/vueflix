import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Dashboard from './components/Dashboard.vue'
import UnitList from './components/UnitList.vue'
import Animais from './components/AnimalList.vue'
import VaccineList from './components/VaccineList.vue'
import VaccineAnimal from './components/VaccineAnimal.vue'
import Notificacoes from './components/Notificacoes.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/home', name: 'Home', component: Home },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/units', name: 'Units', component: UnitList },
  { path: '/animals', name: 'Animals', component: Animais },
  { path: '/vaccines', name: 'Vaccines', component: VaccineList },
  { path: '/vaccineAnimal', name: 'VaccineAnimal', component: VaccineAnimal },
  { path: '/notifications', name: 'Notifications', component: Notificacoes }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
