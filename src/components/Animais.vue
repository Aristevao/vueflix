<template>
  <div>
    <!-- Title and toggle button container -->
    <div class="header">
      <div class="title">Animais</div>
      <CustomButton @click="toggleFilters" type="primary" class="toggle-filters-button">
        {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
      </CustomButton>
      <button @click="openAnimalForm" class="add-new-button">
        Add New
      </button>
    </div>

    <!-- Filter inputs -->
    <div v-if="showFilters">
      <div class="filters">
        <div class="filter-item">
          <input v-model="filters.identification" placeholder="Filter by ID" class="filter-input" />
        </div>
        <div class="filter-item">
          <input v-model="filters.name" placeholder="Filter by Name" class="filter-input" />
        </div>
        <div class="filter-item">
          <input v-model="filters.specie" placeholder="Filter by Species" class="filter-input" />
        </div>
        <div class="filter-item">
          <input v-model="filters.breed" placeholder="Filter by Breed" class="filter-input" />
        </div>
        <div class="filter-item">
          <select v-model="filters.sex" class="filter-input">
            <option value="">Filter by Sex</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
        <div class="filter-item">
          <input v-model="filters.birthdate" placeholder="Filter by Age" class="filter-input" />
        </div>
        <div class="filter-item">
          <input v-model="filters.registrationDate" placeholder="Filter by Registration Date" class="filter-input" />
        </div>
      </div>
      <div class="filter-buttons">
        <CustomButton @click="clearFilters" type="secondary">Clear Filters</CustomButton>
        <CustomButton @click="fetchAnimals" type="primary">Apply Filters</CustomButton>
      </div>
    </div>

    <!-- AnimalForm component -->
    <AnimalForm ref="animalForm" @animal-created="handleAnimalCreated" />

    <!-- Table and pagination components -->
    <table class="animal-table">
      <!-- Table header -->
      <thead>
        <tr>
          <th class="image-column"></th>
          <th class="identification-column">ID</th>
          <th class="name-column">Name</th>
          <th class="specie-column">Specie</th>
          <th class="breed-column">Breed</th>
          <th class="sex-column">Sex</th>
          <th class="age-column">Age</th>
          <th class="registration-date-column">Registration Date</th>
        </tr>
      </thead>
      <!-- Table body -->
      <tbody>
        <tr v-for="animal in animals" :key="animal.id">
          <td class="image-column">
            <img :src="animal.imageUrl || 'http://loremflickr.com/640/480/animals'" alt="Animal Image" width="50"
              height="50" />
          </td>
          <td class="identification-column">{{ animal.identification }}</td>
          <td class="name-column">{{ animal.name }}</td>
          <td class="specie-column">{{ animal.specie }}</td>
          <td class="breed-column">{{ animal.breed }}</td>
          <td class="sex-column">{{ animal.sex }}</td>
          <td class="age-column">{{ calculateAge(animal.birthdate) }}</td>
          <td class="registration-date-column">{{ animal.registrationDate }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination component -->
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="handlePageChange" />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import axios from 'axios';
  import Pagination from './Pagination.vue';
  import CustomButton from './CustomButton.vue';
  import AnimalForm from './AnimalForm.vue';

  export default defineComponent({
    name: 'Animais',
    components: {
      Pagination,
      CustomButton,
      AnimalForm,
    },
    data() {
      return {
        animals: [],
        currentPage: 1,
        totalPages: 0,
        filters: {
          identification: '',
          name: '',
          specie: '',
          breed: '',
          sex: '',
          birthdate: '',
          registrationDate: ''
        },
        showFilters: false,
        showAnimalForm: false,
      };
    },
    mounted() {
      this.fetchAnimals(); // Fetch data when the component is mounted
    },
    methods: {
      async fetchAnimals() {
        try {
          const response = await axios.get('http://localhost:8080/api/digital-pec/animal', {
            params: {
              page: this.currentPage - 1,
              size: 10,
              sort: 'id,desc',
              identification: this.filters.identification,
              name: this.filters.name,
              specie: this.filters.specie,
              breed: this.filters.breed,
              sex: this.filters.sex,
              birthdate: this.filters.birthdate,
              registrationDate: this.filters.registrationDate
            }
          });
          this.animals = response.data.content;
          this.totalPages = response.data.totalPages;
        } catch (error) {
          console.error(error);
        }
      },
      handlePageChange(newPage) {
        this.currentPage = newPage;
        this.fetchAnimals(); // Fetch data for the new page
      },
      calculateAge(birthdate) {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return `${age} year${age !== 1 ? 's' : ''}`;
      },
      clearFilters() {
        this.filters.identification = '';
        this.filters.name = '';
        this.filters.specie = '';
        this.filters.breed = '';
        this.filters.sex = '';
        this.filters.birthdate = '';
        this.filters.registrationDate = '';
        this.fetchAnimals();
      },
      toggleFilters() {
        this.showFilters = !this.showFilters; // Toggle filter visibility
      },
      openAnimalForm() {
        this.$refs.animalForm.open();
      },
      handleAnimalCreated() {
        this.fetchAnimals();
      },
    },
  });
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

  .toggle-filters-button {
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

  .animal-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0px 0;
    font-family: sans-serif;
  }

  .animal-table th,
  .animal-table td {
    padding: 10px;
    text-align: left;
  }

  .animal-table th {
    /* background-color: #f2f2f2; */
  }

  .animal-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .animal-table img {
    border-radius: 17%;
  }

  .image-column {
    width: 50px;
    text-align: center;
  }

  .identification-column {
    width: 50px;
  }

  .name-column {
    width: 120px;
  }

  .specie-column {
    width: 100px;
  }

  .breed-column {
    width: 80px;
  }

  .sex-column {
    width: 50px;
  }

  .age-column {
    width: 80px;
  }

  .registration-date-column {
    width: 150px;
  }
</style>
