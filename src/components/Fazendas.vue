<template>
  <div class="fazendas">
    <h1>Fazendas</h1>
    <div class="fazendas-list">
      <div v-for="fazenda in fazendas" :key="fazenda.id" class="fazenda-card" @click="openModal(fazenda.id)">
        <div class="fazenda-image-container">
          <img :src="fazenda.picture || defaultImage" class="fazenda-image" />
          <div class="animal-count">
            <img src='@/assets/animal-white.png' alt="animal icon" />
            <span>{{ fazenda.animalCount || '0' }} Animais</span>
          </div>
        </div>
        <div class="fazenda-info">
          <span>{{ fazenda.address.city }} - {{ fazenda.address.state }}</span>
          <h3>{{ fazenda.name }}</h3>
          <p>{{ fazenda.description }}</p>
        </div>
      </div>
    </div>
    <UnitModal ref="unitModal" :unit="selectedUnit" @close="selectedUnit = null" @save="saveUnit" />
  </div>
</template>

<script>
  import axios from 'axios';
  import UnitModal from './UnitModal.vue';

  export default {
    components: {
      UnitModal,
    },
    data() {
      return {
        fazendas: [],
        selectedUnit: null,
        defaultImage: 'https://via.placeholder.com/400',
      };
    },
    mounted() {
      this.fetchFazendas();
    },
    methods: {
      fetchFazendas() {
        axios.get('http://localhost:8080/api/digital-pec/unit')
          .then(response => {
            this.fazendas = response.data.content;
            this.fetchAnimalCounts();
          })
          .catch(error => {
            console.error('Error fetching fazendas:', error);
          });
      },
      fetchAnimalCounts() {
        this.fazendas.forEach(fazenda => {
          axios.get(`http://localhost:8080/api/digital-pec/animal/unit/${fazenda.id}`)
            .then(response => {
              fazenda.animalCount = response.data;
            })
            .catch(error => {
              console.error('Error fetching animal count:', error);
            });
        });
      },
      openModal(id) {
        axios.get(`http://localhost:8080/api/digital-pec/unit/${id}`)
          .then(response => {
            this.selectedUnit = response.data;
            this.$refs.unitModal.open();
          })
          .catch(error => {
            console.error('Error fetching unit details:', error);
          });
      },
      saveUnit(editedUnit) {
        axios.put(`http://localhost:8080/api/digital-pec/unit/${editedUnit.id}`, editedUnit)
          .then(response => {
            const index = this.fazendas.findIndex(fazenda => fazenda.id === editedUnit.id);
            if (index !== -1) {
              this.$set(this.fazendas, index, editedUnit);
            }
            this.selectedUnit = null;
          })
          .catch(error => {
            console.error('Error saving unit:', error);
          });
      },
    },
  };
</script>

<style scoped>
  .fazendas {
    padding: 20px;
  }

  .fazendas-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .fazenda-card {
    width: 30%;
    border: 1px solid #ddd;
    border-radius: 17px;
    overflow: hidden;
    cursor: pointer;
  }

  .fazenda-image-container {
    position: relative;
  }

  .fazenda-image {
    width: 100%;
    height: auto;
  }

  .animal-count {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
  }

  .animal-count img {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }

  .fazenda-info {
    padding: 10px;
  }

  .fazenda-info h3 {
    margin: 5px 0;
  }
</style>
