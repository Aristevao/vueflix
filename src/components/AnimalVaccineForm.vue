<template>
  <transition name="modal">
    <div v-if="isVisible" class="animalVaccine-form-modal" @click="handleBackgroundClick">
      <div class="animalVaccine-form" @click.stop>
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
  import axios from 'axios';

  export default {
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
        },
      };
    },
    methods: {
      open(animalVaccine) {
        this.isVisible = true;
        document.addEventListener('keydown', this.handleKeydown);

        if (animalVaccine) {
          this.deleteButtonIsVisible = true;

          this.formData = {
            id: animalVaccine.id,
            animalId: animalVaccine.animal.id,
            vaccineId: animalVaccine.vaccine.id,
            completed: animalVaccine.completed || false,
            applicationDate: animalVaccine.applicationDate || null,
            nextApplicationDates: animalVaccine.nextApplicationDates || []
          };
        } else {
          this.resetForm();
        }

        this.fetchAnimals();
        this.fetchVaccines();
      },
      close() {
        this.isVisible = false;
        this.deleteButtonIsVisible = false;
        this.resetForm();
        document.removeEventListener('keydown', this.handleKeydown);
      },
      fetchAnimals() {
        axios.get('http://localhost:8080/api/digital-pec/animal/list')
          .then(response => {
            this.animals = response.data;
          })
          .catch(error => {
            console.error('Error fetching animals:', error);
          });
      },
      fetchVaccines() {
        axios.get('http://localhost:8080/api/digital-pec/vaccine/list')
          .then(response => {
            this.vaccines = response.data;
          })
          .catch(error => {
            console.error('Error fetching vaccines:', error);
          });
      },
      submitForm() {
        const payload = {
          animal: { id: this.formData.animalId },
          vaccine: { id: this.formData.vaccineId },
          completed: this.formData.completed,
          applicationDate: this.formData.applicationDate,
          nextApplicationDates: this.formData.nextApplicationDates
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
            console.error('Error saving animalVaccine:', error);
          });
      },
      deleteVaccine(animalVaccineId) {
        axios.delete(`http://localhost:8080/api/digital-pec/animal/vaccine/${animalVaccineId}`)
          .then(() => {
            this.$emit('animalVaccine-deleted', animalVaccineId);
            this.close();
          })
          .catch(error => {
            console.error('Error deleting vaccine:', error);
          });
      },
      cancelForm() {
        this.close();
      },
      resetForm() {
        this.formData = {
          id: null,
          animalId: null,
          vaccineId: null,
          completed: false,
          applicationDate: null,
          nextApplicationDates: []
        };
      },
      addNextApplicationDate() {
        this.formData.nextApplicationDates.push(null);
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

  .form-completed {
    display: block;
    margin-bottom: 15px;
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
