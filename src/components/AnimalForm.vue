<template>
  <transition name="modal">
    <div v-if="isVisible" class="entity-form-modal" @click="handleBackgroundClick">
      <div class="entity-form" @click.stop>
        <span class="close-button" @click="close">&times;</span>
        <h2>{{ formData.id ? 'Editar Animal' : 'Criar Novo Animal' }}</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label>Nome</label>
            <input v-model="formData.name" maxlength="80" />
          </div>

          <div class="form-group">
            <label>Identificador</label>
            <input v-model="formData.identification" required maxlength="80" />
          </div>

          <div class="form-group">
            <label>Categoria</label>
            <input v-model="formData.specie" maxlength="80" />
          </div>

          <div class="form-group">
            <label>Raça</label>
            <input v-model="formData.breed" maxlength="80" />
          </div>

          <div class="form-group">
            <label>Sexo</label>
            <select v-model="formData.sex">
              <option>Macho</option>
              <option>Fêmea</option>
            </select>
          </div>

          <div class="form-group">
            <label>Data de Nascimento</label>
            <input type="date" v-model="formData.birthdate" :max="today" />
          </div>

          <div class="form-group">
            <label>Data de Registro</label>
            <input type="date" v-model="formData.registrationDate" :max="today" />
          </div>

          <div class="form-group">
            <label>Descrição</label>
            <textarea v-model="formData.description" maxlength="500"></textarea>
          </div>

          <div class="form-group">
            <label>Fazenda</label>
            <select v-model="formData.unitId" required>
              <option v-for="unit in units" :key="unit.id" :value="unit.id">
                {{ unit.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="picture">Foto</label>
            <input type="file" @change="handleFileUpload" id="picture" />
          </div>

          <div class="button-group">
            <CustomButton type="red" class="delete-button" v-if="deleteButtonIsVisible"
              @click="deleteAnimal(formData.id)">
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
  import apiClient from '../store/apiClient';
  import CustomButton from './CustomButton.vue';

  export default {
    props: {
      animalData: {
        type: Object,
        default: () => ({}),
      },
    },
    components: {
      CustomButton,
    },
    data() {
      return {
        isVisible: false,
        deleteButtonIsVisible: false,
        units: [],
        today: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }),
        formData: {
          id: null,
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
        base64Picture: '',
      };
    },
    watch: {
      animalData: {
        immediate: true,
        handler(newValue) {
          if (newValue && Object.keys(newValue).length > 0) {
            this.formData = {
              id: newValue.id || null,
              name: newValue.name || '',
              identification: newValue.identification || '',
              specie: newValue.specie || '',
              breed: newValue.breed || '',
              sex: newValue.sex || '',
              birthdate: newValue.birthdate || '',
              registrationDate: newValue.registrationDate || '',
              description: newValue.description || '',
              unitId: newValue.unit ? newValue.unit.id : '',
              picture: null,
            };
          }
        },
      },
    },
    methods: {
      open(animal) {
        this.isVisible = true;
        this.fetchUnits();
        document.addEventListener('keydown', this.handleKeydown);

        if (animal) {
          this.deleteButtonIsVisible = true;

          this.formData = {
            id: animal.id,
            name: animal.name,
            identification: animal.identification,
            specie: animal.specie,
            breed: animal.breed,
            sex: animal.sex,
            birthdate: animal.birthdate,
            registrationDate: animal.registrationDate,
            description: animal.description,
            unitId: animal.unit.id,
            picture: animal.picture,
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
      fetchUnits() {
        apiClient
          .get('/unit/list')
          .then((response) => {
            this.units = response.data;
          })
          .catch((error) => {
            console.error('Error fetching units:', error);
          });
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            this.base64Picture = reader.result.split(',')[1]; // Convert to base64 and remove prefix
          };
          reader.readAsDataURL(file);
        }
      },
      async submitForm() {
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

        if (this.base64Picture) {
          formData.append('picture', this.base64Picture);
        }

        const url = this.formData.id ? `/animal/${this.formData.id}` : '/animal';
        const method = this.formData.id ? 'put' : 'post';

        try {
          const response = await apiClient({
            method,
            url,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          this.$emit('animal-created', response.data);
          this.close();
        } catch (error) {
          console.error('Error creating animal:', error);
        }
      },
      async deleteAnimal(animalId) {
        try {
          await apiClient.delete(`/animal/${animalId}`);
          this.$emit('animal-deleted', animalId);
          this.close();
        } catch (error) {
          console.error('Error deleting animal:', error);
        }
      },
      cancelForm() {
        this.close();
      },
      resetForm() {
        this.formData = {
          id: null,
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
        this.base64Picture = '';
      },
    },
  };
</script>

<style scoped>
  @import "@/assets/form-styles.css";
</style>
