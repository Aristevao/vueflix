<template>
  <transition name="modal">
    <div v-if="isVisible" class="animalVaccine-form-modal" @click="handleBackgroundClick">
      <div class="animalVaccine-form" @click.stop>
        <span class="close-button" @click="close">&times;</span>
        <h2>{{ formData.id ? 'Edit Vaccine Application' : 'Create New Vaccine Application' }}</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="animal">Animal ID:</label>
            <input v-model="formData.animal.id" type="number" required />
          </div>

          <div class="form-group">
            <label for="vaccine">Vaccine ID:</label>
            <input v-model="formData.vaccine.id" type="number" required />
          </div>

          <div class="form-group">
            <label for="completed">Completed:</label>
            <input v-model="formData.completed" type="checkbox" />
          </div>

          <div class="form-group">
            <label for="applicationDate">Application Date:</label>
            <input v-model="formData.applicationDate" type="date" required />
          </div>

          <div class="form-group">
            <label for="nextApplicationDates">Next Application Dates:</label>
            <div v-for="(date, index) in formData.nextApplicationDates" :key="index" class="date-group">
              <input v-model="formData.nextApplicationDates[index]" type="date" />
              <button type="button" @click="removeNextApplicationDate(index)">Remove</button>
            </div>
            <button type="button" @click="addNextApplicationDate">Add Next Application Date</button>
          </div>

          <div class="button-group">
            <button class="delete-button" v-if="deleteButtonIsVisible" type="button"
              @click="deleteAnimalVaccine(formData.id)">Delete</button>
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
  import axios from 'axios';

  export default {
    props: {
      animalVaccineData: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        isVisible: false,
        deleteButtonIsVisible: false,
        formData: {
          id: null,
          animal: {
            id: null,
          },
          vaccine: {
            id: null,
          },
          completed: false,
          applicationDate: '',
          nextApplicationDates: [''],
        },
      };
    },
    watch: {
      animalVaccineData: {
        immediate: true,
        handler(newValue) {
          if (newValue && Object.keys(newValue).length > 0) {
            this.formData = {
              id: newValue.id || null,
              animal: {
                id: newValue.animal.id || null,
              },
              vaccine: {
                id: newValue.vaccine.id || null,
              },
              completed: newValue.completed || false,
              applicationDate: newValue.applicationDate || '',
              nextApplicationDates: newValue.nextApplicationDates ? newValue.nextApplicationDates : [''],
            };
          }
        },
      },
    },
    methods: {
      open(animalVaccine) {
        this.isVisible = true;
        document.addEventListener('keydown', this.handleKeydown);

        if (animalVaccine) {
          this.deleteButtonIsVisible = true;
          this.formData = {
            id: animalVaccine.id,
            animal: {
              id: animalVaccine.animal.id,
            },
            vaccine: {
              id: animalVaccine.vaccine.id,
            },
            completed: animalVaccine.completed,
            applicationDate: animalVaccine.applicationDate,
            nextApplicationDates: animalVaccine.nextApplicationDates || [''],
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
      submitForm() {
        const payload = {
          animal: {
            id: this.formData.animal.id,
          },
          vaccine: {
            id: this.formData.vaccine.id,
          },
          completed: this.formData.completed,
          applicationDate: this.formData.applicationDate,
          nextApplicationDates: this.formData.nextApplicationDates,
        };

        const url = this.formData.id
          ? `http://localhost:8080/api/digital-pec/animal/vaccine/${this.formData.id}`
          : 'http://localhost:8080/api/digital-pec/animal/vaccine';
        const method = this.formData.id ? 'put' : 'post';

        axios({
          method,
          url,
          data: payload,
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            this.$emit('animalVaccine-created', response.data);
            this.close();
          })
          .catch(error => {
            console.error('Error creating or updating animalVaccine:', error);
          });
      },
      deleteAnimalVaccine(animalVaccineId) {
        axios.delete(`http://localhost:8080/api/digital-pec/animal/vaccine/${animalVaccineId}`)
          .then(() => {
            this.$emit('animalVaccine-deleted', animalVaccineId);
            this.close();
          })
          .catch(error => {
            console.error('Error deleting animalVaccine:', error);
          });
      },
      cancelForm() {
        this.close();
      },
      resetForm() {
        this.formData = {
          id: null,
          animal: {
            id: null,
          },
          vaccine: {
            id: null,
          },
          completed: false,
          applicationDate: '',
          nextApplicationDates: [''],
        };
      },
      addNextApplicationDate() {
        this.formData.nextApplicationDates.push('');
      },
      removeNextApplicationDate(index) {
        this.formData.nextApplicationDates.splice(index, 1);
      }
    },
  };
</script>

<style scoped>
  .animalVaccine-form-modal {
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

  .animalVaccine-form {
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
