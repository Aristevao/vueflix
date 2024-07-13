<template>
  <transition name="modal">
    <div class="animal-form-modal" v-if="isVisible">
      <div class="animal-form">
        <h2>Create New Animal</h2>
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <label>Name:</label>
          <input v-model="formData.name" maxlength="80" />

          <label>Identification:</label>
          <input v-model="formData.identification" required maxlength="80" />

          <label>Specie:</label>
          <input v-model="formData.specie" maxlength="80" />

          <label>Breed:</label>
          <input v-model="formData.breed" maxlength="80" />

          <label>Sex:</label>
          <select v-model="formData.sex">
            <option>MALE</option>
            <option>FEMALE</option>
          </select>

          <label>Birthdate:</label>
          <input type="date" v-model="formData.birthdate" />

          <label>Registration Date:</label>
          <input type="date" v-model="formData.registrationDate" />

          <label>Description:</label>
          <textarea v-model="formData.description" maxlength="500"></textarea>

          <label>Unit ID:</label>
          <input type="number" v-model="formData.unitId" required />

          <label>Picture:</label>
          <input type="file" @change="handleFileUpload" />

          <div class="button-group">
            <button type="submit">Create Animal</button>
            <button type="button" @click="cancelForm">Cancel</button>
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
      isVisible: true,// TODO: Default = false. True exige 2 clicks pra abrir a modal
      formData: {
        name: '',
        identification: '',
        specie: '',
        breed: '',
        sex: '',
        birthdate: '',
        registrationDate: '',
        description: '',
        unitId: '',
        picture: null,
      },
    };
  },
  methods: {
    open() {
      this.isVisible = true;
    },
    close() {
      this.isVisible = false;
      this.resetForm();
    },
    handleFileUpload(event) {
      this.formData.picture = event.target.files[0];
    },
    submitForm() {
      const formData = new FormData();
      formData.append('name', this.formData.name);
      formData.append('identification', this.formData.identification);
      formData.append('specie', this.formData.specie);
      formData.append('breed', this.formData.breed);
      formData.append('sex', this.formData.sex);
      formData.append('birthdate', this.formData.birthdate);
      formData.append('registrationDate', this.formData.registrationDate);
      formData.append('description', this.formData.description);
      formData.append('unit.id', this.formData.unitId);
      if (this.formData.picture) {
        formData.append('picture', this.formData.picture);
      }

      axios.post('http://localhost:8080/api/digital-pec/animal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        this.$emit('animal-created', response.data);
        this.close();
      })
      .catch(error => {
        console.error('Error creating animal:', error);
      });
    },
    cancelForm() {
      this.close();
    },
    resetForm() {
      this.formData = {
        name: '',
        identification: '',
        specie: '',
        breed: '',
        sex: '',
        birthdate: '',
        registrationDate: '',
        description: '',
        unitId: '',
        picture: null,
      };
    },
  },
};
</script>

<style scoped>
.animal-form-modal {
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

.animal-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
}

.button-group {
  margin-top: 20px;
  text-align: right;
}

.button-group button {
  margin-left: 10px;
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
