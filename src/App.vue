<template>
  <div id="app">
    <Sidebar :collapsed="collapsed" @toggleSidebar="toggleSidebar" />
    <router-view></router-view>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import Sidebar from './components/Sidebar.vue';

  export default {
    name: 'App',
    components: {
      Sidebar,
    },
    setup() {
      const collapsed = ref(false);

      const toggleSidebar = () => {
        collapsed.value = !collapsed.value;
      };

      return {
        collapsed,
        toggleSidebar,
      };
    },
  };
</script>

<style>
  #app {
    display: flex;
  }
</style>
