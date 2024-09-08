<template>
  <div class="pagination">
    <button @click="goToPage(1)" :disabled="currentPage === 1">First</button>
    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">Last</button>
  </div>
</template>

<script>
  export default {
    name: 'Pagination',
    props: {
      currentPage: Number,
      totalPages: Number
    },
    methods: {
      goToPage(pageNumber) {
        this.$emit('page-change', pageNumber)
      }
    }
  }
</script>

<style scoped>
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 10px;
  }

  button {
    margin: 0 5px;
    padding: 8px 12px;
    border: 1px solid #007bff;
    border-radius: 4px;
    background-color: #ffffff;
    color: #007bff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  }

  button:hover:not(:disabled) {
    background-color: #007bff;
    color: #ffffff;
    border-color: #0056b3;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #cccccc;
    background-color: #e9ecef;
    color: #6c757d;
  }
</style>
