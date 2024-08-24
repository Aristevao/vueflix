<template>
  <transition name="modal">
    <div v-if="isVisible" class="vaccine-form-modal" @click="handleBackgroundClick">
      <div class="vaccine-form" @click.stop>
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
            <div v-for="(specie, index) in formData.species" :key="index" class="species-group">
              <input v-model="specie.name" placeholder="Enter species name" />
              <button type="button" @click="removeSpecie(index)">Remove</button>
            </div>
            <button type="button" @click="addSpecie">Add Species</button>
          </div>

          <div class="button-group">
            <button class="delete-button" v-if="deleteButtonIsVisible" type="button"
              @click="deleteVaccine(formData.id)">Delete</button>
            <div class="right-buttons">
              <button type="submit">Save</button>
              <button type="button" @click="cancelForm">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
  import apiClient from '../store/apiClient';

  export default {
    props: {
      vaccineData: {
        type: Object,
        default: () => ({}),
      },
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
        },
      };
    },
    watch: {
      vaccineData: {
        immediate: true,
        handler(newValue) {
          if (newValue && Object.keys(newValue).length > 0) {
            this.formData = {
              id: newValue.id || null,
              name: newValue.name || '',
              species: newValue.species ? newValue.species.map(s => ({ name: s.name })) : [{ name: '' }],
              description: newValue.description || ''
            };
          }
        },
      },
    },
    methods: {
      open(vaccine) {
        this.isVisible = true;
        document.addEventListener('keydown', this.handleKeydown);

        if (vaccine) {
          this.deleteButtonIsVisible = true;

          this.formData = {
            id: vaccine.id,
            name: vaccine.name,
            species: vaccine.species ? vaccine.species.map(s => ({ name: s.name })) : [{ name: '' }],
            description: vaccine.description
          };
        } else {
          this.resetForm();
        }
      },
      close() {
        this.isVisible = false;
        this.deleteButtonIsVisible = false;
        this.resetForm();
        document.removeEventListener('keydown', this.handleKeydown);
      },
      handleBackgroundClick(event) {
        if (event.target === event.currentTarget) {
          this.close();
        }
      },
      handleKeydown(event) {
        if (event.key === 'Escape') {
          this.close();
        } else if (event.key === 'Enter') {
          this.submitForm();
        }
      },
      handleFileUpload(event) {
        this.formData.picture = event.target.files[0];
      },
      async submitForm() {
        const payload = {
          name: this.formData.name,
          description: this.formData.description,
          species: this.formData.species.map(specie => ({ name: specie.name }))
        };

        const url = this.formData.id
          ? `/vaccine/${this.formData.id}`
          : '/vaccine';
        const method = this.formData.id ? 'put' : 'post';

        try {
          const response = await apiClient({
            method,
            url,
            data: payload,
            headers: {
              'Content-Type': 'application/json',
            },
          });
          this.$emit('vaccine-created', response.data);
          this.close();
        } catch (error) {
          console.error('Error creating vaccine:', error);
        }
      },

      async deleteVaccine(vaccineId) {
        try {
          await apiClient.delete(`/vaccine/${vaccineId}`);
          this.$emit('vaccine-deleted', vaccineId);
          this.close();
        } catch (error) {
          console.error('Error deleting vaccine:', error);
        }
      },
      cancelForm() {
        this.close();
      },
      resetForm() {
        this.formData = {
          id: null,
          name: '',
          species: [{ name: '' }],
          description: ''
        };
      },
      addSpecie() {
        this.formData.species.push({ name: '' });
      },
      removeSpecie(index) {
        this.formData.species.splice(index, 1);
      }
    },
  };
</script>

<style scoped>
  .vaccine-form-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .vaccine-form {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    width: 100%;
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 5px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .species-group {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .species-group input {
    flex: 1;
    margin-right: 10px;
  }

  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .right-buttons button {
    margin-left: 10px;
  }

  .delete-button {
    margin-right: auto;
  }

  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s;
  }

  .modal-enter,
  .modal-leave-to {
    opacity: 0;
  }
</style>
