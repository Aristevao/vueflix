<template>
  <div>
    <div class="header">
      <div class="title">Aplicações</div>
      <div class="button-group">
        <CustomButton @click="toggleFilters" type="secondary" class="toggle-filters-button">
          {{ showFilters ? 'Esconder Filtros' : 'Exibir Filtros' }}
        </CustomButton>
        <CustomButton @click="openAnimalVaccineForm" type="primary" class="toggle-filters-button">Adicionar Novo
        </CustomButton>
      </div>
    </div>

    <div v-if="showFilters">
      <div class="filters">
        <div class="filter-item">
          <input v-model="filters.animalName" placeholder="Nome do animal" class="filter-input" />
        </div>
        <div class="filter-item">
          <input v-model="filters.vaccineName" placeholder="Nome da vacina" class="filter-input" />
        </div>
        <div class="filter-item">
          <input v-model="filters.completed" type="checkbox" class="filter-checkbox" /> Completa
        </div>
      </div>
      <div class="filter-buttons">
        <CustomButton @click="clearFilters" type="secondary">Limpar Filtros</CustomButton>
        <CustomButton @click="fetchVaccines" type="primary">Aplicar Filtros</CustomButton>
      </div>
    </div>

    <AnimalVaccineForm ref="animalVaccineForm" @animalVaccine-created="handleAnimalVaccineCreated"
      @animalVaccine-deleted="handleAnimalVaccineDeleted" />

    <table class="animalVaccine-table">
      <thead>
        <tr>
          <th class="name-column">Animal</th>
          <th class="vaccine-column">Vacina</th>
          <th class="date-column">Data de Aplicação</th>
          <th class="next-date-column">Próximas Aplicações</th>
          <th class="completed-column">Completo</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="animalVaccine in animalVaccines" :key="animalVaccine.id"
          @click="openVaccineDetails(animalVaccine.id)" @mouseover="showEllipsis(animalVaccine.id)"
          @mouseleave="hideEllipsis(animalVaccine.id)">
          <td class="name-column">{{ animalVaccine.animal.name }}</td>
          <td class="vaccine-column">{{ animalVaccine.vaccine.name }}</td>
          <td class="date-column">{{ formatDate(animalVaccine.applicationDate) }}</td>
          <td class="next-date-column">
            {{ formatNextApplicationDates(animalVaccine.nextApplicationDates) }}
          </td>
          <td class="completed-column">
            <span :class="{ 'completed-icon': animalVaccine.completed, 'incomplete-icon': !animalVaccine.completed }">
              <i class="fa" :class="animalVaccine.completed ? 'fa-check-circle' : 'fa-times-circle'"></i>
              {{ animalVaccine.completed ? 'Sim' : 'Não' }}
            </span>
          </td>
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
  import AnimalVaccineForm from './AnimalVaccineForm.vue'

  export default defineComponent({
    name: 'AnimalVaccineList',
    components: {
      Pagination,
      CustomButton,
      AnimalVaccineForm
    },
    data() {
      return {
        animalVaccines: [],
        currentPage: 1,
        totalPages: 0,
        filters: {
          animalName: '',
          vaccineName: '',
          completed: null
        },
        showFilters: false,
        showAnimalVaccineForm: false
      }
    },
    mounted() {
      this.fetchVaccines()
    },
    methods: {
      async fetchVaccines() {
        try {
          const response = await apiClient.get('/animal/vaccine', {
            params: {
              page: this.currentPage - 1,
              size: 10,
              sort: 'applicationDate,asc',
              animalName: this.filters.animalName,
              vaccineName: this.filters.vaccineName,
              completed: this.filters.completed
            }
          })
          this.animalVaccines = response.data.content
          this.totalPages = response.data.totalPages
        } catch (error) {
          console.error('Error fetching vaccines:', error)
        }
      },

      async openVaccineDetails(animalVaccineId) {
        try {
          const response = await apiClient.get(`/animal/vaccine/${animalVaccineId}`)
          this.$refs.animalVaccineForm.open(response.data)
        } catch (error) {
          console.error('Error fetching animalVaccine details:', error)
        }
      },

      async deleteVaccine(animalVaccineId) {
        try {
          await apiClient.delete(`/animal/vaccine/${animalVaccineId}`)
          this.animalVaccines = this.animalVaccines.filter(
            (animalVaccine) => animalVaccine.id !== animalVaccineId
          )
        } catch (error) {
          console.error('Error deleting animalVaccine:', error)
        }
      },
      handlePageChange(newPage) {
        this.currentPage = newPage
        this.fetchVaccines()
      },
      clearFilters() {
        this.filters.animalName = ''
        this.filters.vaccineName = ''
        this.filters.completed = false
        this.fetchVaccines()
      },
      toggleFilters() {
        this.showFilters = !this.showFilters
      },
      openAnimalVaccineForm() {
        this.$refs.animalVaccineForm.open()
      },
      handleAnimalVaccineCreated() {
        this.fetchVaccines()
      },
      handleAnimalVaccineDeleted() {
        this.fetchVaccines()
      },
      showEllipsis(animalVaccineId) {
        this.animalVaccines = this.animalVaccines.map((animalVaccine) =>
          animalVaccine.id === animalVaccineId
            ? { ...animalVaccine, showEllipsis: true }
            : animalVaccine
        )
      },
      hideEllipsis(animalVaccineId) {
        this.animalVaccines = this.animalVaccines.map((animalVaccine) =>
          animalVaccine.id === animalVaccineId
            ? { ...animalVaccine, showEllipsis: false, showOptions: false }
            : animalVaccine
        )
      },
      toggleOptions(animalVaccineId) {
        this.animalVaccines = this.animalVaccines.map((animalVaccine) =>
          animalVaccine.id === animalVaccineId
            ? { ...animalVaccine, showOptions: !animalVaccine.showOptions }
            : animalVaccine
        )
      },
      formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
      },
      formatNextApplicationDates(dates) {
        return dates.map((date) => this.formatDate(date)).join(', ')
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

  .filter-checkbox {
    margin-left: 10px;
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

  .animalVaccine-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0px 0;
    font-family: sans-serif;
  }

  .animalVaccine-table th,
  .animalVaccine-table td {
    padding: 10px;
    text-align: left;
  }

  .animalVaccine-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .name-column {
    width: 120px;
  }

  .vaccine-column {
    width: 120px;
  }

  .date-column {
    width: 125px;
  }

  .next-date-column {
    width: 200px;
  }

  .completed-column {
    width: 80px;
    text-align: center;
  }

  .completed-icon {
    color: green;
  }

  .incomplete-icon {
    color: red;
  }
</style>
