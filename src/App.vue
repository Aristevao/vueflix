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
  import { ref, computed, provide, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import Sidebar from './components/Sidebar.vue'
  import HeaderBar from './components/HeaderBar.vue'
  import apiClient from './store/apiClient'
  import defaultUserPicture from '@/assets/user.jpg' // Import the default image

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
      const userPicture = ref(defaultUserPicture)

      const toggleSidebar = () => {
        collapsed.value = !collapsed.value
      }

      const showHeaderAndSidebar = computed(() => route.name !== 'Login')

      provide('username', username)

      const fetchUserData = async (userId) => {
        try {
          const response = await apiClient.get(`http://localhost:8080/api/digital-pec/user/${userId}`)
          if (response.data) {
            username.value = response.data.name
            userPicture.value = `data:image/png;base64,${response.data.picture}`
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error)
        }
      }

      onMounted(() => {
        const storedUsername = localStorage.getItem('name')
        const storedUserId = localStorage.getItem('id')

        if (storedUserId) {
          username.value = storedUsername || 'Guest'
          console.log("USER_ID: ", storedUserId);

          fetchUserData(storedUserId)
        }
      })

      return {
        collapsed,
        toggleSidebar,
        username,
        userPicture,
        showHeaderAndSidebar
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
