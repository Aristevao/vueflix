<template>
  <div>
    <div class="header">
      <div class="title">Notifications</div>
      <div class="button-group">
        <CustomButton @click="toggleFilters" type="secondary" class="toggle-filters-button">
          {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
        </CustomButton>
        <CustomButton @click="markAllAsRead" type="primary" class="mark-all-read-button">
          Mark All as Read
        </CustomButton>
      </div>
    </div>

    <div v-if="showFilters">
      <div class="filters">
        <div class="filter-item">
          <select v-model="filterStatus" class="filter-input">
            <option value="">All</option>
            <option value="true">Read</option>
            <option value="false">Unread</option>
          </select>
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
          <th class="read-column">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="notification in notifications" :key="notification.id" :class="{ unread: !notification.isRead }"
          @click="openNotificationModal(notification)">
          <td class="title-column">{{ notification.title }}</td>
          <td class="message-column">
            <div class="message-text">
              {{ truncateMessage(notification.message) }}
            </div>
          </td>
          <td class="date-column">{{ formatDate(notification.createdAt) }}</td>
          <td class="read-column">
            <span @click.stop="markAsRead(notification.id)">
              <i class="fa fa-check-circle"
                :class="{ 'read-icon': notification.isRead, 'unread-icon': !notification.isRead }"></i>
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="handlePageChange" />

    <NotificationModal v-if="showModal" :notification="selectedNotification" @close="showModal = false" />
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import apiClient from '../store/apiClient'
  import Pagination from './Pagination.vue'
  import CustomButton from './CustomButton.vue'
  import NotificationModal from './NotificationModal.vue'

  export default defineComponent({
    name: 'NotificationList',
    components: {
      Pagination,
      CustomButton,
      NotificationModal
    },
    data() {
      return {
        notifications: [],
        currentPage: 1,
        totalPages: 0,
        filterStatus: '',
        showFilters: false,
        showModal: false,
        selectedNotification: null
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
              sort: 'createdAt,desc',
              isRead: this.filterStatus
            }
          })
          this.notifications = response.data.content
          this.totalPages = response.data.totalPages
        } catch (error) {
          console.error('Error fetching notifications:', error)
        }
      },
      async markAsRead(notificationId) {
        try {
          await apiClient.patch(`/notification/${notificationId}/markAsRead`)
          this.notifications = this.notifications.map(notification =>
            notification.id === notificationId ? { ...notification, isRead: true } : notification
          )
        } catch (error) {
          console.error('Error marking notification as read:', error)
        }
      },
      async markAllAsRead() {
        try {
          await apiClient.patch('/notification/markAllAsRead')
          this.notifications = this.notifications.map(notification => ({ ...notification, isRead: true }))
        } catch (error) {
          console.error('Error marking all notifications as read:', error)
        }
      },
      formatDate(date) {
        return new Date(date).toLocaleString('pt-BR', { timeZone: 'UTC', hour12: false })
      },
      truncateMessage(message) {
        return message.length > 100 ? `${message.substring(0, 100)}...` : message
      },
      openNotificationModal(notification) {
        this.selectedNotification = notification
        this.showModal = true
        if (!notification.isRead) {
          this.markAsRead(notification.id)
        }
        document.addEventListener('keydown', this.handleKeydown)
      },
      clearFilters() {
        this.filterStatus = ''
        this.fetchNotifications()
      },
      handlePageChange(newPage) {
        this.currentPage = newPage
        this.fetchNotifications()
      },
      toggleFilters() {
        this.showFilters = !this.showFilters
      },
      handleBackgroundClick(event) {
        if (event.target === event.currentTarget) {
          this.showModal = false
        }
      },
      handleKeydown(event) {
        if (event.key === 'Escape' || event.key === 'Enter') {
          this.showModal = false
        }
      }
    }
  })
</script>

<style scoped>
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
    gap: 15px;
  }

  .toggle-filters-button {
    margin-bottom: 10px;
  }

  .mark-all-read-button {
    margin-bottom: 10px;
  }

  .filters {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: left;
  }

  .filter-item {
    display: flex;
    align-items: center;
  }

  .filter-input {
    width: 100%;
    max-width: 150px;
    padding: 5px;
    box-sizing: border-box;
  }

  .filter-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  .notification-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0px 0;
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

  .notification-table .message-column .message-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .notification-table .unread {
    font-weight: bold;
  }

  .read-icon {
    color: green;
  }

  .unread-icon {
    color: red;
  }

  .notification-table .date-column {
    width: 150px;
  }
</style>
