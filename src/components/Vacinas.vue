<template>
  <div>
    <!-- Title and toggle button container -->
    <div class="header">
      <div class="title">Vaccines</div>
      <CustomButton @click="toggleFilters" type="primary" class="toggle-filters-button">
        {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
      </CustomButton>
      <button @click="openVaccineForm" class="add-new-button">
        Add New
      </button>
    </div>

    <!-- Filter inputs -->
    <div v-if="showFilters">
      <div class="filters">
        <div class="filter-item">
          <input v-model="filters.name" placeholder="Filter by Name" class="filter-input" />
        </div>
        <div class="filter-item">
          <input v-model="filters.species" placeholder="Filter by Species" class="filter-input" />
        </div>
        <div class="filter-item">
          <input v-model="filters.description" placeholder="Filter by Description" class="filter-input" />
        </div>
      </div>
      <div class="filter-buttons">
        <CustomButton @click="clearFilters" type="secondary">Clear Filters</CustomButton>
        <CustomButton @click="fetchVaccines" type="primary">Apply Filters</CustomButton>
      </div>
    </div>

    <!-- VaccineForm component -->
    <VaccineForm ref="vaccineForm" @vaccine-created="handleVaccineCreated" @vaccine-deleted="handleVaccineDeleted" />

    <!-- Table and pagination components -->
    <table class="vaccine-table">
      <!-- Table header -->
      <thead>
        <tr>
          <th class="name-column">Name</th>
          <th class="species-column">Species</th>
          <th class="description-column">Description</th>
        </tr>
      </thead>
      <!-- Table body -->
      <tbody>
        <tr v-for="vaccine in vaccines" :key="vaccine.id" @click="openVaccineDetails(vaccine.id)"
          @mouseover="showEllipsis(vaccine.id)" @mouseleave="hideEllipsis(vaccine.id)">
          <td class="name-column">{{ vaccine.name }}</td>
          <td class="species-column">{{ vaccine.species.map(s => s.name).join(', ') }}</td>
          <td class="description-column">{{ vaccine.description }}</td>
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
  import VaccineForm from './VaccineForm.vue';

  export default defineComponent({
    name: 'Vacinas',
    components: {
      Pagination,
      CustomButton,
      VaccineForm,
    },
    data() {
      return {
        vaccines: [],
        currentPage: 1,
        totalPages: 0,
        filters: {
          name: '',
          species: '',
          description: ''
        },
        showFilters: false,
        showVaccineForm: false,
      };
    },
    mounted() {
      this.fetchVaccines();
    },
    methods: {
      async fetchVaccines() {
        try {
          const response = await axios.get('http://localhost:8080/api/digital-pec/vaccine', {
            params: {
              page: this.currentPage - 1,
              size: 10,
              sort: 'name,asc',
              name: this.filters.name,
              species: this.filters.species,
              description: this.filters.description
            }
          });
          this.vaccines = response.data.content;
          this.totalPages = response.data.totalPages;
        } catch (error) {
          console.error(error);
        }
      },
      handlePageChange(newPage) {
        this.currentPage = newPage;
        this.fetchVaccines(); // Fetch data for the new page
      },
      calculateDescription(birthdate) {
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
        this.filters.species = '';
        this.filters.description = '';
        this.filters.sex = '';
        this.filters.birthdate = '';
        this.filters.registrationDate = '';
        this.fetchVaccines();
      },
      toggleFilters() {
        this.showFilters = !this.showFilters; // Toggle filter visibility
      },
      openVaccineForm() {
        this.$refs.vaccineForm.open();
      },
      handleVaccineCreated() {
        this.fetchVaccines();
      },
      handleVaccineDeleted() {
        this.fetchVaccines();
      },
      openVaccineDetails(vaccineId) {
        axios.get(`http://localhost:8080/api/digital-pec/vaccine/${vaccineId}`)
          .then(response => {
            this.$refs.vaccineForm.open(response.data);
          })
          .catch(error => {
            console.error('Error fetching vaccine details:', error);
          });
      },
      deleteVaccine(vaccineId) {
        axios.delete(`http://localhost:8080/api/digital-pec/vaccine/${vaccineId}`)
          .then(() => {
            this.vaccines = this.vaccines.filter(vaccine => vaccine.id !== vaccineId);
          })
          .catch(error => {
            console.error('Error deleting vaccine:', error);
          });
      },
      showEllipsis(vaccineId) {
        this.vaccines = this.vaccines.map(vaccine => vaccine.id === vaccineId ? { ...vaccine, showEllipsis: true } : vaccine);
      },
      hideEllipsis(vaccineId) {
        this.vaccines = this.vaccines.map(vaccine => vaccine.id === vaccineId ? { ...vaccine, showEllipsis: false, showOptions: false } : vaccine);
      },
      toggleOptions(vaccineId) {
        this.vaccines = this.vaccines.map(vaccine => vaccine.id === vaccineId ? { ...vaccine, showOptions: !vaccine.showOptions } : vaccine);
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

  .button-group {
    margin-top: 20px;
    text-align: right;
  }

  .button-group button {
    margin-left: 10px;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    padding: 10px;
    position: relative;
  }

  .ellipsis {
    cursor: pointer;
    float: right;
    /* width: 150px; */
  }

  .options {
    display: flex;
    gap: 10px;
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .options button {
    background: none;
    border: none;
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }

  .vaccine-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0px 0;
    font-family: sans-serif;
  }

  .vaccine-table th,
  .vaccine-table td {
    padding: 10px;
    text-align: left;
  }

  .vaccine-table th {
    /* background-color: #f2f2f2; */
  }

  .vaccine-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .vaccine-table img {
    border-radius: 17%;
  }

  .imdescription-column {
    width: 50px;
    text-align: center;
  }

  .identification-column {
    width: 50px;
  }

  .name-column {
    width: 120px;
  }

  .species-column {
    width: 100px;
  }

  .breed-column {
    width: 80px;
  }

  .sex-column {
    width: 50px;
  }

  .description-column {
    width: 80px;
  }

  .registration-date-column {
    width: 150px;
  }
</style>
