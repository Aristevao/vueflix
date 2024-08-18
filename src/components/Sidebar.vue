<template>
  <div :class="['sidebar', { collapsed }]">
    <button @click="toggleSidebar" class="toggle-btn">
      <img src="@/assets/menu.png" alt="Toggle" class="toggle-icon" />
    </button>
    <div class="logo">
      <img src="@/assets/paw.png" alt="Logo" class="logo-icon" v-if="!collapsed" />
      <span class="logo-text" v-if="!collapsed">DigitalPec</span>
    </div>
    <nav>
      <ul>
        <li>
          <router-link to="/dashboard" active-class="active">
            <img src="@/assets/home.png" alt="Dashboard" class="menu-icon" />
            <span v-if="!collapsed">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/units" active-class="active">
            <img src="@/assets/fazendas.png" alt="Units" class="menu-icon" />
            <span v-if="!collapsed">Fazendas</span>
          </router-link>
        </li>
        <li>
          <router-link to="/animals" active-class="active">
            <img src="@/assets/animais.png" alt="Animals" class="menu-icon" />
            <span v-if="!collapsed">Animais</span>
          </router-link>
        </li>
        <li>
          <router-link to="/vaccines" active-class="active">
            <img src="@/assets/vacinas.png" alt="Vaccines" class="menu-icon" />
            <span v-if="!collapsed">Vacinas</span>
          </router-link>
        </li>
        <li>
          <router-link to="/calendar" active-class="active">
            <img src="@/assets/calendario.png" alt="Calendar" class="menu-icon" />
            <span v-if="!collapsed">Calendário</span>
          </router-link>
        </li>
        <li>
          <router-link to="/notifications" active-class="active">
            <img src="@/assets/notificacoes.png" alt="Notifications" class="menu-icon" />
            <span v-if="!collapsed">Notificações</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      collapsed: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.collapsed = !this.collapsed;
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #f4f4f4;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: width 0.3s;
  position: relative;
  font-family: sans-serif;
}

.sidebar.collapsed {
  width: 40px;
}

.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #333;
}

.logo-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.toggle-icon {
  width: 24px;
  height: 24px;
}

.sidebar.collapsed .toggle-icon {
  width: 24px;
  height: 24px;
  margin-top: -10px;
  margin-left: -28px;
}

.sidebar.collapsed .logo-text {
  display: none;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav li {
  margin: 10px 0;
}

nav a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: #ddd;
}

nav a.active {
  background-color: #ddd;
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.sidebar.collapsed .menu-icon {
  margin-right: 0;
}

.sidebar.collapsed nav a span {
  display: none;
}
</style>
