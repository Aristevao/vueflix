<template>
  <div>
    <div class="header">
      <div class="title">Vacinas</div>
      <div class="button-group">
        <CustomButton @click="toggleFilters" type="secondary" class="toggle-filters-button">
          {{ showFilters ? 'Esconder Filtros' : 'Exibir Filtros' }}
        </CustomButton>
        <CustomButton @click="openVaccineForm" type="primary" class="toggle-filters-button">Adicionar Novo</CustomButton>
      </div>
    </div>

    <div v-if="showFilters">
      <div class="filters">
        <div class="filter-item">
          <input v-model="filters.name" placeholder="Name" class="filter-input" />
        </div>
        <div class="filter-item">
          <input v-model="filters.description" placeholder="Descrição" class="filter-input" />
        </div>
      </div>
      <div class="filter-buttons">
        <CustomButton @click="clearFilters" type="secondary">Limpar Filtros</CustomButton>
        <CustomButton @click="fetchVaccines" type="primary">Aplicar Filtros</CustomButton>
      </div>
    </div>

    <VaccineForm ref="vaccineForm" @vaccine-created="handleVaccineCreated" @vaccine-deleted="handleVaccineDeleted" />

    <table class="vaccine-table">
      <thead>
        <tr>
          <th class="name-column">Nome</th>
          <th class="species-column">Categorias</th>
          <th class="description-column">Descrição</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vaccine in vaccines" :key="vaccine.id" @click="openVaccineDetails(vaccine.id)"
          @mouseover="showEllipsis(vaccine.id)" @mouseleave="hideEllipsis(vaccine.id)">
          <td class="name-column">{{ vaccine.name }}</td>
          <td class="species-column">{{ vaccine.species.map((s) => s.name).join(', ') }}</td>
          <td class="description-column">{{ vaccine.description }}</td>
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
  import VaccineForm from './VaccineForm.vue'

  export default defineComponent({
    name: 'VaccineList',
    components: {
      Pagination,
      CustomButton,
      VaccineForm
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
        showVaccineForm: false
      }
    },
    mounted() {
      this.fetchVaccines()
    },
    methods: {
      async fetchVaccines() {
        try {
          const response = await apiClient.get('/vaccine', {
            params: {
              page: this.currentPage - 1,
              size: 10,
              sort: 'name,asc',
              name: this.filters.name,
              species: this.filters.species,
              description: this.filters.description
            }
          })
          this.vaccines = response.data.content
          this.totalPages = response.data.totalPages
        } catch (error) {
          console.error('Error fetching vaccines:', error)
        }
      },

      async openVaccineDetails(vaccineId) {
        try {
          const response = await apiClient.get(`/vaccine/${vaccineId}`)
          this.$refs.vaccineForm.open(response.data)
        } catch (error) {
          console.error('Error fetching vaccine details:', error)
        }
      },
      async deleteVaccine(vaccineId) {
        try {
          await apiClient.delete(`/vaccine/${vaccineId}`)
          this.vaccines = this.vaccines.filter((vaccine) => vaccine.id !== vaccineId)
        } catch (error) {
          console.error('Error deleting vaccine:', error)
        }
      },
      handlePageChange(newPage) {
        this.currentPage = newPage
        this.fetchVaccines()
      },
      calculateDescription(birthdate) {
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
        this.filters.species = ''
        this.filters.description = ''
        this.filters.sex = ''
        this.filters.birthdate = ''
        this.filters.registrationDate = ''
        this.fetchVaccines()
      },
      toggleFilters() {
        this.showFilters = !this.showFilters
      },
      openVaccineForm() {
        this.$refs.vaccineForm.open()
      },
      handleVaccineCreated() {
        this.fetchVaccines()
      },
      handleVaccineDeleted() {
        this.fetchVaccines()
      },
      showEllipsis(vaccineId) {
        this.vaccines = this.vaccines.map((vaccine) =>
          vaccine.id === vaccineId ? { ...vaccine, showEllipsis: true } : vaccine
        )
      },
      hideEllipsis(vaccineId) {
        this.vaccines = this.vaccines.map((vaccine) =>
          vaccine.id === vaccineId ? { ...vaccine, showEllipsis: false, showOptions: false } : vaccine
        )
      },
      toggleOptions(vaccineId) {
        this.vaccines = this.vaccines.map((vaccine) =>
          vaccine.id === vaccineId ? { ...vaccine, showOptions: !vaccine.showOptions } : vaccine
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
