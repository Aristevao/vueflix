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
  }

  button {
    margin: 0 5px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
