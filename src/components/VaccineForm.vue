<template>
  <transition name="modal">
    <div v-if="isVisible" class="entity-form-modal" @click="handleBackgroundClick">
      <div class="entity-form" @click.stop>
        <span class="close-button" @click="close">&times;</span>
        <h2>{{ formData.id ? 'Edit Vaccine' : 'Create New Vaccine' }}</h2>
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <div class="form-group">
            <label>Name:</label>
            <input v-model="formData.name" maxlength="80" required />
          </div>

          <div class="form-group">
            <label>Description:</label>
            <textarea v-model="formData.description" maxlength="500"></textarea>
          </div>

          <div class="form-group">
            <label>Species:</label>
            <div v-for="(specie, index) in formData.species" :key="index" class="right-side-action-button">
              <input v-model="specie.name" placeholder="Enter species name" />
              <button type="button" @click="removeSpecie(index)">Remove</button>
            </div>
            <button type="button" @click="addSpecie">Add Species</button>
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
    props: {
      vaccineData: {
        type: Object,
        default: () => ({})
      }
    },
    components: {
      CustomButton
    },
    data() {
      return {
        isVisible: false,
        deleteButtonIsVisible: false,
        units: [],
        formData: {
          id: null,
          name: '',
          species: [{ name: '' }],
          description: ''
        }
      }
    },
    watch: {
      vaccineData: {
        immediate: true,
        handler(newValue) {
          if (newValue && Object.keys(newValue).length > 0) {
            this.formData = {
              id: newValue.id || null,
              name: newValue.name || '',
              species: newValue.species
                ? newValue.species.map((s) => ({ name: s.name }))
                : [{ name: '' }],
              description: newValue.description || ''
            }
          }
        }
      }
    },
    methods: {
      open(vaccine) {
        this.isVisible = true
        document.addEventListener('keydown', this.handleKeydown)

        if (vaccine) {
          this.deleteButtonIsVisible = true

          this.formData = {
            id: vaccine.id,
            name: vaccine.name,
            species: vaccine.species
              ? vaccine.species.map((s) => ({ name: s.name }))
              : [{ name: '' }],
            description: vaccine.description
          }
        } else {
          this.resetForm()
        }
      },
      close() {
        this.isVisible = false
        this.deleteButtonIsVisible = false
        this.resetForm()
        document.removeEventListener('keydown', this.handleKeydown)
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
      handleFileUpload(event) {
        this.formData.picture = event.target.files[0]
      },
      async submitForm() {
        const payload = {
          name: this.formData.name,
          description: this.formData.description,
          species: this.formData.species.map((specie) => ({ name: specie.name }))
        }

        const url = this.formData.id ? `/vaccine/${this.formData.id}` : '/vaccine'
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
          this.$emit('vaccine-created', response.data)
          this.close()
        } catch (error) {
          console.error('Error creating vaccine:', error)
        }
      },
      async deleteVaccine(vaccineId) {
        try {
          await apiClient.delete(`/vaccine/${vaccineId}`)
          this.$emit('vaccine-deleted', vaccineId)
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
          name: '',
          species: [{ name: '' }],
          description: ''
        }
      },
      addSpecie() {
        this.formData.species.push({ name: '' })
      },
      removeSpecie(index) {
        this.formData.species.splice(index, 1)
      }
    }
  }
</script>

<style scoped>
  @import "@/assets/form-styles.css";
</style>
