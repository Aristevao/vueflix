<template>
  <div id="app">
    <HeaderBar v-if="showHeaderAndSidebar" :username="username" :userPicture="userPicture" />
    <div class="main-content">
      <Sidebar v-if="showHeaderAndSidebar" :collapsed="collapsed" @toggleSidebar="toggleSidebar" />
      <div class="content" :class="{ 'full-screen': !showHeaderAndSidebar }">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, computed, provide } from 'vue'
  import { useRoute } from 'vue-router'
  import Sidebar from './components/Sidebar.vue'
  import HeaderBar from './components/HeaderBar.vue'

  export default {
    name: 'App',
    components: {
      HeaderBar,
      Sidebar
    },
    setup() {
      const collapsed = ref(false)
      const route = useRoute()

      const username = ref('Guest')
      const userPicture = '@/assets/user.jpg'

      const toggleSidebar = () => {
        collapsed.value = !collapsed.value
      }

      const showHeaderAndSidebar = computed(() => route.name !== 'Login')

      // Provide the username to child components
      provide('username', username)

      return {
        collapsed,
        toggleSidebar,
        username,
        userPicture,
        showHeaderAndSidebar
      }
    },
    created() {
      // Set the username from localStorage when the component is created
      const storedUsername = localStorage.getItem('name')
      if (storedUsername) {
        this.username = storedUsername
      }
    }
  }
</script>

<style scoped>
  #app {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .main-content {
    display: flex;
    flex: 1;
  }

  .content {
    flex: 1;
    padding: 40px;
    overflow: auto;
  }

  .content.full-screen {
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  router-view {
    width: 100%;
  }
</style>
