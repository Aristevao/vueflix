<template>
  <div>
    <div>
      <h1>Notificacoes</h1>
    </div>
    <div>
      <h2 class="container-name" id="nome-container" v-on:click="changeValue(true)">Não Lida</h2> 
      <h2 class="container-name" id="nome-container2" v-on:click="changeValue(false)">Lidas</h2>
    </div>
    <div class="container" v-if="notRead">
      <div v-for="notification in notifications" :key="notification.date" class="partitions">
        <div v-if="!notification.isRead">
          <h3 style="margin-left: 10px; display: inline;">{{notification.title}}<span class="close" v-on:click="notification.isRead = true">X</span>
            <span class="date">{{dateManipulation(notification.createdAt)}}</span>
          </h3>
          <p class="info">{{ notification.message }}</p>
        </div>
      </div>
    </div>
  <div v-if="!notRead">
    <div class="container" v-for="notification in notifications " :key="notification.date">
      <div v-if= "notification.isRead" class="partitions">
      <h3 style="margin-left: 10px; display: inline;">{{notification.title}}<span class="date">{{dateManipulation(notification.createdAt)}}</span></h3>
      <p class="info">{{notification.message}}</p>
      </div>
    </div>
  </div>

  <!-- Pagination component -->
  <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="handlePageChange" />
</template>
  
  <script>
  import { defineComponent } from 'vue';
  import axios from 'axios';
  import Pagination from './Pagination.vue';

  const cirilo =
  {
     id: 0,
     isRead: false,
     title: "Mensagem para maria Joaquina",
     message: "Eu te odeio maria Joaquina",
     date: "Agosto 19",
  }
  export default {
    name: 'Notificacoes',
    data()
    {
      
      return{
        notifications: [],
        notRead: true,
      };
    },
    mounted() {
      this.fetchNotifications();
    },
    methods:
    {
      async fetchNotifications() {
        try {
          const response = await axios.get('http://localhost:8080/api/digital-pec/notification', {
            params: {
              page: this.currentPage - 1,
              size: 10,
              sort: 'id,desc'
            }
          });
          this.notifications = response.data.content;
          this.totalPages = response.data.totalPages;
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
</script>

<style scoped>

.container-name
{
  font-weight: normal;
  display: inline-block;
  padding-bottom: 10px;
  margin-left: 10px;
  margin-bottom: 0;
}
#nome-container
{
  border-bottom: 3px solid rgb(255, 0, 0);
}
#nome-container2
{
  border-bottom: 0;
  position: relative;
  left: 15px;
}

.container
{
  border: 1px solid black;
  max-width: 100%;
  height: 500px;
  /*background-color: rgb(72, 72, 72);*/
  border-radius: 10px;

  }

  .partitions {
    margin: 10px 5px 10px 5px;
    border-radius: 10px;
    background-color: rgb(151, 149, 149);
  }

  .info {
    margin-left: 10px;
    margin-right: 30px;
    text-align: justify;
  }

  .date {
    float: right;
    margin-right: 25px;
  }

  .close {
    float: right;
    margin-right: 5px;
    padding: 0px 5px 0px 5px;
    padding: 5;
    border-radius: 100%;
  }

  .close:hover {
    background-color: rgb(168, 166, 166);
    font-weight: bold;
    cursor: pointer;
  }

  .container-name:hover {
    cursor: pointer;
    color: red;
  }

</style>