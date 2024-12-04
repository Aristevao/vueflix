<template>
  <transition name="modal">
    <div v-if="isVisible" class="entity-form-modal" @click="handleBackgroundClick">
      <div class="entity-form" @click.stop>
        <span class="close-button" @click="close">&times;</span>
        <h2>{{ formData.id ? 'Editar Aplicação' : 'Criar Nova Aplicação' }}</h2>
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="animal" class="form-label">Animal</label>
              <select v-model="formData.animalId" id="animal" class="form-select" :disabled="formData.id !== null"
                required>
                <option v-for="animal in animals" :key="animal.id" :value="animal.id">
                  {{ animal.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="vaccine" class="form-label">Vacina</label>
              <select v-model="formData.vaccineId" id="vaccine" class="form-select" :disabled="formData.id !== null"
                required>
                <option v-for="vaccine in vaccines" :key="vaccine.id" :value="vaccine.id">
                  {{ vaccine.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="completed" class="form-label">Completo</label>
              <input type="checkbox" v-model="formData.completed" id="completed" class="form-check-input" />
            </div>

            <div class="mb-3">
              <label for="applicationDate" class="form-label">Data de Aplicação</label>
              <input type="date" v-model="formData.applicationDate" id="applicationDate" class="form-control"
                :max="today" />
            </div>

            <div class="mb-3">
              <label for="nextApplicationDates" class="form-label">Próximas Aplicações</label>
              <br>
              <div v-for="(date, index) in formData.nextApplicationDates" :key="index" class="mb-2">
                <div class="d-flex align-items-center">
                  <input type="date" v-model="formData.nextApplicationDates[index]" :min="today"
                    class="form-control me-2" />
                  <button type="button" @click="removeNextApplicationDate(index)" class="btn btn btn-light btn-sm p-0"
                    style="width: 20px; height: 20px; font-size: 16px; line-height: 16px;">&times;</button>
                </div>
              </div>
              <button type="button" @click="addNextApplicationDate" class="btn btn-light btn-sm">Adicionar</button>
            </div>
          </div>

          <div class="button-group">
            <CustomButton type="red" class="delete-button" v-if="deleteButtonIsVisible"
              @click="deleteVaccine(formData.id)">
              Remover
            </CustomButton>
            <div class="right-buttons">
              <CustomButton type="secondary" @click="cancelForm">Cancelar</CustomButton>
              <CustomButton type="primary" class="save-button" @click="submitForm">Salvar</CustomButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
  import apiClient from '../store/apiClient'
  import CustomButton from './CustomButton.vue'

  export default {
    components: {
      CustomButton
    },
    data() {
      return {
        isVisible: false,
        deleteButtonIsVisible: false,
        animals: [],
        vaccines: [],
        today: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }),
        formData: {
          id: null,
          animalId: null,
          vaccineId: null,
          completed: false,
          applicationDate: null,
          nextApplicationDates: []
        }
      }
    },
    methods: {
      open(animalVaccine) {
        this.isVisible = true
        document.addEventListener('keydown', this.handleKeydown)

        if (animalVaccine) {
          this.deleteButtonIsVisible = true

          this.formData = {
            id: animalVaccine.id,
            animalId: animalVaccine.animal.id,
            vaccineId: animalVaccine.vaccine.id,
            completed: animalVaccine.completed || false,
            applicationDate: animalVaccine.applicationDate || null,
            nextApplicationDates: animalVaccine.nextApplicationDates || []
          }
        } else {
          this.resetForm()
        }

        this.fetchAnimals()
        this.fetchVaccines()
      },
      close() {
        this.isVisible = false
        this.deleteButtonIsVisible = false
        this.resetForm()
        document.removeEventListener('keydown', this.handleKeydown)
      },
      async fetchAnimals() {
        try {
          const response = await apiClient.get('animal/list')
          this.animals = response.data
        } catch (error) {
          console.error('Error fetching animals:', error)
        }
      },

      async fetchVaccines() {
        try {
          const response = await apiClient.get('vaccine/list')
          this.vaccines = response.data
        } catch (error) {
          console.error('Error fetching vaccines:', error)
        }
      },

      handleBackgroundClick(event) {
        if (event.target === event.currentTarget) {
          this.close()
        }
      },

      handleKeydown(event) {
        if (event.key === 'Escape') {
          this.close()
        } else if (event.key === 'Enter') {
          this.submitForm()
        }
      },

      async submitForm() {
        const payload = {
          animal: { id: this.formData.animalId },
          vaccine: { id: this.formData.vaccineId },
          completed: this.formData.completed,
          applicationDate: this.formData.applicationDate,
          nextApplicationDates: this.formData.nextApplicationDates
        }

        const url = this.formData.id ? `animal/vaccine/${this.formData.id}` : 'animal/vaccine'
        const method = this.formData.id ? 'put' : 'post'

        try {
          const response = await apiClient({
            method,
            url,
            data: payload,
            headers: {
              'Content-Type': 'application/json'
            }
          })
          this.$emit('animalVaccine-created', response.data)
          this.close()
        } catch (error) {
          console.error('Error saving animalVaccine:', error)
        }
      },

      async deleteVaccine(animalVaccineId) {
        try {
          await apiClient.delete(`animal/vaccine/${animalVaccineId}`)
          this.$emit('animalVaccine-deleted', animalVaccineId)
          this.close()
        } catch (error) {
          console.error('Error deleting vaccine:', error)
        }
      },
      cancelForm() {
        this.close()
      },
      resetForm() {
        this.formData = {
          id: null,
          animalId: null,
          vaccineId: null,
          completed: false,
          applicationDate: null,
          nextApplicationDates: []
        }
      },
      addNextApplicationDate() {
        this.formData.nextApplicationDates.push(null)
      },
      removeNextApplicationDate(index) {
        this.formData.nextApplicationDates.splice(index, 1)
      }
    }
  }
</script>

<style scoped>
  @import "@/assets/form-styles.css";

  .form-completed {
    display: block;
    margin-bottom: 15px;
    font-weight: bold;
  }
</style>
