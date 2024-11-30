<template>
  <transition name="modal">
    <div v-if="isVisible" class="entity-form-modal" @click="handleBackgroundClick">
      <div class="entity-form" @click.stop>
        <span class="close-button" @click="close">&times;</span>
        <h2>{{ formData.id ? 'Editar Vacina' : 'Criar Nova Vacina' }}</h2>
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input v-model="formData.name" maxlength="80" required class="form-control" id="name" />
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Descrição</label>
              <textarea v-model="formData.description" maxlength="500" class="form-control" id="description"></textarea>
            </div>

            <div class="mb-3">
              <label for="species" class="form-label">Categorias</label>
              <br>
              <div v-for="(specie, index) in formData.species" :key="index" class="mb-2">
                <div class="d-flex align-items-center">
                  <input v-model="specie.name" placeholder="Digite o nome da categoria" class="form-control me-2" />
                  <button type="button" @click="removeSpecie(index)" class="btn btn btn-light btn-sm p-0"
                    style="width: 20px; height: 20px; font-size: 16px; line-height: 16px;">&times;</button>
                </div>
              </div>
              <button type="button" @click="addSpecie" class="btn btn-light btn-sm">Adicionar</button>
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
