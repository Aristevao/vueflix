<template>
  <div id="app">
    <HeaderBar :username="username" :userPicture="userPicture" />
    <div class="main-content">
      <Sidebar :collapsed="collapsed" @toggleSidebar="toggleSidebar" />
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import Sidebar from './components/Sidebar.vue';
  import HeaderBar from './components/HeaderBar.vue';

  export default {
    name: 'App',
    components: {
      HeaderBar,
      Sidebar,
    },
    setup() {
      const collapsed = ref(false);

      const username = 'John Doe'; // Replace with actual username
      const userPicture = '@/assets/user.jpg'; // Replace with actual user picture path

      const toggleSidebar = () => {
        collapsed.value = !collapsed.value;
      };

      return {
        collapsed,
        toggleSidebar,
        username,
        userPicture,
      };
    },
  };
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

  router-view {
    width: 100%;
  }
</style>
