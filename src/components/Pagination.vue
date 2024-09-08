<template>
  <div class="pagination">
    <button @click="goToPage(1)" :disabled="currentPage === 1">
      <i class="fa fa-angle-double-left"></i>
    </button>
    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
      <i class="fa fa-angle-left"></i>
    </button>
    <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{ active: currentPage === page }">
      {{ page }}
    </button>
    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
      <i class="fa fa-angle-right"></i>
    </button>
    <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">
      <i class="fa fa-angle-double-right"></i>
    </button>
  </div>
</template>

<script>
  export default {
    name: "Pagination",
    props: {
      currentPage: Number,
      totalPages: Number,
    },
    methods: {
      goToPage(pageNumber) {
        this.$emit("page-change", pageNumber);
      },
    },
  };
</script>

<style scoped>
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 10px;
  }

  button {
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    background-color: #f1f1f1;
    color: #333;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s, color 0.2s;
  }

  button:hover:not(:disabled) {
    background-color: #ddd;
  }

  button:disabled {
    color: #999;
    cursor: not-allowed;
  }

  button.active {
    background-color: #2c974b;
    color: white;
    font-weight: bold;
  }
</style>
