<template>
    <div>
      <h1>Notificacoes</h1>
    </div>
     <!--Mensagens nao lidas-->
    <div>
      <h2 class="container-name" v-on:click="notRead = true">Não Lida</h2> 
      <h2 class="container-name" style="position: relative; left: 15px" v-on:click="notRead = false">Lidas</h2>
    </div>
    <div class="container" v-if="notRead">
      <div v-for="notification in notifications" :key="notification.date" class="partitions">
        <div v-if="!notification.isRead">
          <h3 style="margin-left: 10px; display: inline;">{{notification.title}}<span class="close" v-on:click="notification.isRead = true">X</span>
            <span class="date">{{notification.date}}</span>
          </h3>
          <p class="info">{{notification.message}}</p>
        </div>
      </div>
    </div>
  <div v-if="!notRead">
    <div class="container" v-for="notification in notifications " :key="notification.date">
      <div v-if= "notification.isRead" class="partitions">
      <h3 style="margin-left: 10px; display: inline;">{{notification.title}}<span class="date">{{notification.date}}</span></h3>
      <p class="info">{{notification.message}}</p>
      </div>
    </div>
  </div>
</template>
  
  <script>
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
        notifications: [cirilo],
        notRead: true,
      };
    },
    methods:
    {
      /*fetchNotifications() {
        axios.get("api")
          .then(response => {
            this.notifications = response.data.content
          })
          .catch(error => {
            console.error('Error fetching notifications:', error)
          });
      }*/
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
  border-bottom: 3px solid rgb(255, 0, 0);
  margin-bottom: 0;
}
.container
{
  border: 1px solid black;
  max-width: 100%;
  height: 500px;
  /*background-color: rgb(72, 72, 72);*/
  border-radius: 10px;

}

.partitions
{
  margin: 10px 5px 10px 5px;
  border-radius: 10px;
  background-color: rgb(151, 149, 149);
}

.info
{
  margin-left: 10px;
  margin-right: 30px;
  text-align: justify;
}

.date
{
  float:right;
  margin-right: 25px;
}

.close
{
  float:right;
  margin-right: 5px;
  padding: 0px 5px 0px 5px;
  padding: 5;
  border-radius: 100%;
}
.close:hover{
  background-color: rgb(168, 166, 166);
  font-weight: bold;
  cursor: pointer;
}

.container-name:hover
{
  cursor: pointer;
  color:red;
}

</style>
  