<template>
  <div class="fazendas">
    <h1>Fazendas</h1>
    <div class="fazendas-list">
      <div v-for="fazenda in fazendas" :key="fazenda.id" class="fazenda-card" @click="openUnitModal(fazenda)">
        <div class="fazenda-image-container">
          <img :src="fazenda.picture || defaultImage" class="fazenda-image" />
          <div class="animal-count">
            <img src="@/assets/animal-white.png" alt="animal icon" />
            <span>{{ fazenda.animalCount !== undefined ? fazenda.animalCount : 'N/A' }} Animais</span>
          </div>
        </div>
        <div class="fazenda-info">
          <span>{{ fazenda.address.city }} - {{ fazenda.address.state }}</span>
          <h3>{{ fazenda.name }}</h3>
          <p>{{ fazenda.description }}</p>
        </div>
      </div>
    </div>
    <UnitModal :unit="selectedUnit" v-if="selectedUnit" @close="selectedUnit = null" ref="unitModal" />
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
      async fetchFazendas() {
        try {
          const unitResponse = await axios.get('http://localhost:8080/api/digital-pec/unit');
          const units = unitResponse.data.content;

          // Fetch animal counts for each unit
          const fetchAnimalCountPromises = units.map(unit =>
            axios.get(`http://localhost:8080/api/digital-pec/animal/unit/${unit.id}`)
              .then(response => ({
                ...unit,
                animalCount: response.data
              }))
              .catch(error => {
                console.error(`Error fetching animal count for unit ${unit.id}:`, error);
                return {
                  ...unit,
                  animalCount: 'N/A'
                };
              })
          );

          this.fazendas = await Promise.all(fetchAnimalCountPromises);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
      openUnitModal(unit) {
        this.selectedUnit = unit;
        this.$nextTick(() => {
          this.$refs.unitModal.open();
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
    border-radius: 10px;
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
