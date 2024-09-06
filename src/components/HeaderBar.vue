<template>
  <header class="app-header">
    <div class="left">
      <div class="logo">
        <img src="@/assets/paw.png" alt="Logo" class="logo-icon" />
        <span class="app-name">DigitalPec</span>
      </div>
    </div>
    <div class="right">
      <div class="user-info">
        <span class="username">{{ username }}</span>
        <img :src="userPicture" alt="User" class="user-picture" />
      </div>
    </div>
  </header>
</template>

<script>
  import { inject } from 'vue'

  export default {
    name: 'HeaderBar',
    props: {
      userPicture: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const username = inject('username')
      return {
        username,
        userPicture: props.userPicture
      }
    }
  }
</script>

<style scoped>
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    padding: 10px 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    font-family: sans-serif;
  }

  .left {
    display: flex;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    color: #333;
  }

  .logo-icon {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }

  .app-name {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .right {
    display: flex;
    align-items: center;
  }

  .user-info {
    display: flex;
    align-items: center;
  }

  .username {
    margin-right: 10px;
    font-weight: bold;
  }

  .user-picture {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
</style>
