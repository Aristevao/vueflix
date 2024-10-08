<template>
  <div>
    <div class="header">
      <div class="title">Animais</div>
      <div class="button-group">
        <CustomButton @click="toggleFilters" type="secondary" class="toggle-filters-button">
          {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
        </CustomButton>
        <CustomButton @click="openAnimalForm" type="primary" class="toggle-filters-button">Add New</CustomButton>
      </div>
    </div>

    <div v-if="showFilters">
      <div class="filters">
        <div class="filter-item">
          <input v-model="filters.identification" placeholder="ID" class="filter-input" />
        </div>
        <div class="filter-item">
          <input v-model="filters.name" placeholder="Name" class="filter-input" />
        </div>
        <div class="filter-item">
          <input v-model="filters.specie" placeholder="Species" class="filter-input" />
        </div>
        <div class="filter-item">
          <input v-model="filters.breed" placeholder="Breed" class="filter-input" />
        </div>
        <div class="filter-item">
          <select v-model="filters.sex" class="filter-input">
            <option value="">Sex</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
        <div class="filter-item">
          <input v-model="filters.birthdate" placeholder="Age" class="filter-input" />
        </div>
        <div class="filter-item">
          <input v-model="filters.registrationDate" placeholder="Registration Date" class="filter-input" />
        </div>
      </div>
      <div class="filter-buttons">
        <CustomButton @click="clearFilters" type="secondary">Clear Filters</CustomButton>
        <CustomButton @click="fetchAnimals" type="primary">Apply Filters</CustomButton>
      </div>
    </div>

    <AnimalForm ref="animalForm" @animal-created="handleAnimalCreated" @animal-deleted="handleAnimalDeleted" />

    <table class="animal-table">
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
      <tbody>
        <tr v-for="animal in animals" :key="animal.id" @click="openAnimalDetails(animal.id)"
          @mouseover="showEllipsis(animal.id)" @mouseleave="hideEllipsis(animal.id)">
          <td class="image-column">
            <img :src="getAnimalImage(animal)" alt="Animal Image" width="50" height="50" />
          </td>
          <td class="identification-column">{{ formatIdentification(animal.identification) }}</td>
          <td class="name-column">{{ animal.name }}</td>
          <td class="specie-column">{{ animal.specie }}</td>
          <td class="breed-column">{{ animal.breed }}</td>
          <td class="sex-column">{{ animal.sex }}</td>
          <td class="age-column">{{ calculateAge(animal.birthdate) }}</td>
          <td class="registration-date-column">{{ animal.registrationDate }}</td>
        </tr>
      </tbody>
    </table>

    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="handlePageChange" />
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import apiClient from '../store/apiClient'
  import Pagination from './Pagination.vue'
  import CustomButton from './CustomButton.vue'
  import AnimalForm from './AnimalForm.vue'
  import defaultAnimalImage from '@/assets/default-animal.png'

  export default defineComponent({
    name: 'AnimalList',
    components: {
      Pagination,
      CustomButton,
      AnimalForm
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
        showAnimalForm: false
      }
    },
    mounted() {
      this.fetchAnimals()
    },
    methods: {
      async fetchAnimals() {
        try {
          const response = await apiClient.get('/animal', {
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
          })
          this.animals = response.data.content
          this.totalPages = response.data.totalPages
        } catch (error) {
          console.error('Failed to fetch animals:', error)
        }
      },
      getAnimalImage(animal) {
        return animal.picture ? `data:image/png;base64,${animal.picture}` : defaultAnimalImage
      },
      formatIdentification(identification) {
        if (!isNaN(identification)) {
          return identification.toString().padStart(4, '0')
        }
        return identification
      },
      handlePageChange(newPage) {
        this.currentPage = newPage
        this.fetchAnimals()
      },
      calculateAge(birthdate) {
        const birthDate = new Date(birthdate)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDifference = today.getMonth() - birthDate.getMonth()
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        return `${age} year${age !== 1 ? 's' : ''}`
      },
      clearFilters() {
        this.filters.identification = ''
        this.filters.name = ''
        this.filters.specie = ''
        this.filters.breed = ''
        this.filters.sex = ''
        this.filters.birthdate = ''
        this.filters.registrationDate = ''
        this.fetchAnimals()
      },
      toggleFilters() {
        this.showFilters = !this.showFilters
      },
      openAnimalForm() {
        this.$refs.animalForm.open()
      },
      handleAnimalCreated() {
        this.fetchAnimals()
      },
      handleAnimalDeleted() {
        this.fetchAnimals()
      },
      openAnimalDetails(animalId) {
        apiClient
          .get(`/animal/${animalId}`)
          .then((response) => {
            this.$refs.animalForm.open(response.data)
          })
          .catch((error) => {
            console.error('Error fetching animal details:', error)
          })
      },
      deleteAnimal(animalId) {
        apiClient
          .delete(`/animal/${animalId}`)
          .then(() => {
            this.animals = this.animals.filter((animal) => animal.id !== animalId)
          })
          .catch((error) => {
            console.error('Error deleting animal:', error)
          })
      },
      showEllipsis(animalId) {
        this.animals = this.animals.map((animal) =>
          animal.id === animalId ? { ...animal, showEllipsis: true } : animal
        )
      },
      hideEllipsis(animalId) {
        this.animals = this.animals.map((animal) =>
          animal.id === animalId ? { ...animal, showEllipsis: false, showOptions: false } : animal
        )
      },
      toggleOptions(animalId) {
        this.animals = this.animals.map((animal) =>
          animal.id === animalId ? { ...animal, showOptions: !animal.showOptions } : animal
        )
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
    gap: 4px;
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
