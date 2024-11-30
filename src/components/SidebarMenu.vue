<template>
    <div :class="['sidebar', { collapsed: isCollapsed }]">
        <button @click="toggleSidebar" class="toggle-btn">
            <img src="@/assets/menu.png" alt="Toggle" class="toggle-icon" />
        </button>
        <div class="logo">
            <img src="@/assets/paw.png" alt="Logo" class="logo-icon" v-if="!isCollapsed" />
            <span class="logo-text" v-if="!isCollapsed">DigitalPec</span>
        </div>
        <div class="nav-container">
            <nav>
                <ul>
                    <li>
                        <router-link to="/dashboard" active-class="active">
                            <img src="@/assets/home.png" alt="Dashboard" class="menu-icon" />
                            <span v-if="!isCollapsed">Dashboard</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/unit" active-class="active">
                            <img src="@/assets/fazendas.png" alt="Units" class="menu-icon" />
                            <span v-if="!isCollapsed">Fazendas</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/animal" active-class="active">
                            <img src="@/assets/animais.png" alt="Animals" class="menu-icon" />
                            <span v-if="!isCollapsed">Animais</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/vaccine" active-class="active">
                            <img src="@/assets/vacinas.png" alt="Vaccines" class="menu-icon" />
                            <span v-if="!isCollapsed">Vacinas</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/animalVaccine" active-class="active">
                            <img src="@/assets/calendario.png" alt="AnimalVaccine" class="menu-icon" />
                            <span v-if="!isCollapsed">Aplicações</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/notification" active-class="active">
                            <img src="@/assets/notificacoes.png" alt="Notifications" class="menu-icon" />
                            <span v-if="!isCollapsed">Notificações</span>
                        </router-link>
                    </li>
                </ul>
            </nav>
        </div>
        <li @click="logout" class="logout">
            <img src="@/assets/logout.png" alt="Logout" class="menu-icon" />
            <span v-if="!isCollapsed">Logout</span>
        </li>
    </div>
</template>

<script>
    import { ref, inject } from 'vue';
    import { useRouter } from 'vue-router';
    import apiClient from '../store/apiClient';

    export default {
        name: 'SidebarMenu',
        setup() {
            const router = useRouter();
            const username = inject('username');
            const isCollapsed = ref(false); 

            const toggleSidebar = () => {
                isCollapsed.value = !isCollapsed.value;
            };

            const logout = async () => {
                try {
                    await apiClient.post('http://localhost:8080/api/digital-pec/logoff');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('name');
                    username.value = 'Guest';
                    router.push({ name: 'Login' });
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            };

            return {
                isCollapsed,
                toggleSidebar,
                logout,
            };
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
        display: flex;
        flex-direction: column;
    }

    .sidebar.collapsed {
        width: 80px;
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

    .nav-container {
        flex: 1;
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

    .logout {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 10px;
        color: #333;
        border-radius: 5px;
        transition: background-color 0.3s;
        margin-top: auto;
    }

    .logout:hover {
        background-color: #ddd;
    }

    .logout .menu-icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }

    .sidebar.collapsed .logout .menu-icon {
        margin-right: 0;
    }

    .sidebar.collapsed .logout span {
        display: none;
    }
</style>