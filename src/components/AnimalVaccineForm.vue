<template>
  <transition name="modal">
    <div v-if="isVisible" class="entity-form-modal" @click="handleBackgroundClick">
      <div class="entity-form" @click.stop>
        <span class="close-button" @click="close">&times;</span>
        <h2>{{ formData.id ? 'Edit Vaccine' : 'Create New Vaccine' }}</h2>
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <div class="form-group">
            <label>Animal:</label>
            <select v-model="formData.animalId" required>
              <option v-for="animal in animals" :key="animal.id" :value="animal.id">
                {{ animal.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Vaccine:</label>
            <select v-model="formData.vaccineId" required>
              <option v-for="vaccine in vaccines" :key="vaccine.id" :value="vaccine.id">
                {{ vaccine.name }}
              </option>
            </select>
          </div>

          <div class="form-completed">
            <label>Completed:</label>
            <input type="checkbox" v-model="formData.completed" />
          </div>

          <div class="form-group">
            <label>Application Date:</label>
            <input type="date" v-model="formData.applicationDate" />
          </div>

          <div class="form-group">
            <label>Next Application Dates:</label>
            <div v-for="(date, index) in formData.nextApplicationDates" :key="index">
              <input type="date" v-model="formData.nextApplicationDates[index]" />
              <button type="button" @click="removeNextApplicationDate(index)">Remove</button>
            </div>
            <button type="button" @click="addNextApplicationDate">Add Next Application Date</button>
          </div>

          <div class="button-group">
            <CustomButton type="red" class="delete-button" v-if="deleteButtonIsVisible"
              @click="deleteVaccine(formData.id)">
              Delete
            </CustomButton>
            <div class="right-buttons">
              <CustomButton type="secondary" @click="cancelForm">Cancel</CustomButton>
              <CustomButton type="primary" class="save-button" @click="submitForm">Save</CustomButton>
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
