<template>
  <transition name="modal">
    <div class="animal-form-modal" v-if="isVisible">
      <div class="animal-form">
        <h2>Create New Animal</h2>
        <form @submit.prevent="submitForm">
          <!-- Form fields for animal creation -->
          <label>Name:</label>
          <input v-model="formData.name" required />

          <label>Identification:</label>
          <input v-model="formData.identification" required />

          <label>Specie:</label>
          <input v-model="formData.specie" required />

          <label>Breed:</label>
          <input v-model="formData.breed" required />

          <label>Sex:</label>
          <input v-model="formData.sex" required />

          <label>Birthdate:</label>
          <input v-model="formData.birthdate" required />

          <label>Registration Date:</label>
          <input v-model="formData.registrationDate" required />

          <label>Description:</label>
          <input v-model="formData.description" required />

          <label>Fazenda:</label>
          <input v-model="formData.unit" required />

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
  export default {
    data() {
      return {
        isVisible: true, // TODO: Default = false. True exige 2 clicks pra abrir a modal
        formData: {
          name: '',
          identification: '',
          specie: '',
          breed: '',
          sex: '',
          birthdate: '',
          registrationDate: '',
          description: '',
          unit: '',
        }
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
      submitForm() {
        // Logic to submit form and create new animal
        this.$emit('animal-created', this.formData);
        this.close();
      },
      cancelForm() {
        this.close();
      },
      resetForm() {
        this.formData.name = '';
        this.formData.identification = '';
        this.formData.specie = '';
        this.formData.breed = '';
        this.formData.sex = '';
        this.formData.birthdate = '';
        this.formData.registrationDate = '';
        this.formData.description = '';
        this.formData.unit = '';
      }
    }
  };
</script>

<style scoped>

  /* Add scoped styles for AnimalForm.vue */
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

  /* Modal transition */
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s;
  }

  .modal-enter,
  .modal-leave-to {
    opacity: 0;
  }
</style>