<template>
  <div>
    <div class="header">
      <div class="title">Notifications</div>
      <div class="button-group">
        <CustomButton @click="toggleFilters" type="secondary" class="toggle-filters-button">
          {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
        </CustomButton>
        <CustomButton @click="markAllAsRead" type="primary" class="mark-all-read-button">Mark All as Read</CustomButton>
      </div>
    </div>

    <div v-if="showFilters">
      <div class="filters">
        <div class="filter-item">
          <label><input type="radio" v-model="filters.isRead" :value="false">Unread</label>
        </div>
        <div class="filter-item">
          <label><input type="radio" v-model="filters.isRead" :value="true">Read</label>
        </div>
      </div>
      <div class="filter-buttons">
        <CustomButton @click="clearFilters" type="secondary">Clear Filters</CustomButton>
        <CustomButton @click="fetchNotifications" type="primary">Apply Filters</CustomButton>
      </div>
    </div>

    <table class="notification-table">
      <thead>
        <tr>
          <th class="title-column">Title</th>
          <th class="message-column">Message</th>
          <th class="date-column">Date</th>
          <th class="action-column">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="notification in notifications" :key="notification.id" :class="{ unread: !notification.isRead }"
          @click="openNotificationModal(notification)">
          <td class="title-column">{{ notification.title }}</td>
          <td class="message-column">{{ truncateMessage(notification.message) }}</td>
          <td class="date-column">{{ formatDate(notification.createdAt) }}</td>
          <td class="action-column">
            <i v-if="!notification.isRead" class="fa fa-check mark-read-icon" @click.stop="markAsRead(notification.id)"
              title="Mark as Read"></i>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="handlePageChange" />

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>{{ selectedNotification.title }}</h3>
        <p>{{ selectedNotification.message }}</p>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import apiClient from '../store/apiClient'
  import Pagination from './Pagination.vue'
  import CustomButton from './CustomButton.vue'

  export default defineComponent({
    name: 'NotificationList',
    components: {
      Pagination,
      CustomButton,
    },
    data() {
      return {
        notifications: [],
        currentPage: 1,
        totalPages: 0,
        filters: {
          isRead: '',
        },
        showFilters: false,
        showModal: false,
        selectedNotification: null,
      }
    },
    mounted() {
      this.fetchNotifications()
    },
    methods: {
      async fetchNotifications() {
        try {
          const response = await apiClient.get('/notification', {
            params: {
              page: this.currentPage - 1,
              size: 10,
              isRead: this.filters.isRead,
            },
          })
          this.notifications = response.data.content
          this.totalPages = response.data.totalPages
        } catch (error) {
          console.error('Error fetching notifications:', error)
        }
      },
      async markAsRead(notificationId) {
        try {
          await apiClient.post(`/notification/${notificationId}/markAsRead`)
          this.fetchNotifications()
        } catch (error) {
          console.error('Error marking notification as read:', error)
        }
      },
      async markAllAsRead() {
        try {
          await apiClient.post('/notification/markAllAsRead')
          this.fetchNotifications()
        } catch (error) {
          console.error('Error marking all notifications as read:', error)
        }
      },
      handlePageChange(newPage) {
        this.currentPage = newPage
        this.fetchNotifications()
      },
      formatDate(dateString) {
        const date = new Date(dateString)
        const day = date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        const time = date.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
        return `${day} ${time}`
      },
      clearFilters() {
        this.filters.isRead = ''
        this.fetchNotifications()
      },
      toggleFilters() {
        this.showFilters = !this.showFilters
      },
      truncateMessage(message) {
        return message.length > 45 ? message.substring(0, 45) + '...' : message
      },
      openNotificationModal(notification) {
        this.selectedNotification = notification
        this.showModal = true
      },
      closeModal() {
        this.showModal = false
        this.selectedNotification = null
      },
    },
  })
</script>

<style scoped>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .title {
    font-family: sans-serif;
    font-size: 24px;
    font-weight: bold;
  }

  .button-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .filters {
    margin-bottom: 10px;
    display: flex;
    gap: 10px;
  }

  .filter-item {
    display: flex;
    align-items: center;
  }

  .filter-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  .notification-table {
    width: 100%;
    border-collapse: collapse;
    font-family: sans-serif;
  }

  .notification-table th,
  .notification-table td {
    padding: 10px;
    text-align: left;
  }

  .notification-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .title-column {
    width: 30%;
  }

  .message-column {
    width: 40%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .date-column {
    width: 20%;
  }

  .action-column {
    width: 10%;
    text-align: center;
  }

  .mark-read-icon {
    color: #4caf50;
    cursor: pointer;
    font-size: 1.2rem;
  }

  .mark-read-icon:hover {
    color: #388e3c;
  }

  .unread {
    font-weight: bold;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 80%;
    max-width: 600px;
  }

  .modal-content button {
    margin-top: 10px;
  }
</style>
