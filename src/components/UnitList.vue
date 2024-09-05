<template>
  <div>
    <div class="header">
      <div class="title">Animais</div>
      <button @click="openUnitModal" class="add-new-button">
        Add New
      </button>
    </div>
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
    <UnitModal ref="unitModal" :unit="selectedUnit" @close="selectedUnit = null"
      @unit-created="fetchFazendasAfterAction" @unit-deleted="fetchFazendasAfterAction" />
  </div>
</template>

<script>
  import apiClient from '../store/apiClient';
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
          const response = await apiClient.get('/unit');
          this.fazendas = response.data.content;
          this.fetchAnimalCounts();
        } catch (error) {
          console.error('Error fetching units:', error);
        }
      },
      async fetchAnimalCounts() {
        const animalCountPromises = this.fazendas.map(async (fazenda) => {
          try {
            const response = await apiClient.get(`/animal/unit/${fazenda.id}`);
            fazenda.animalCount = response.data;
          } catch (error) {
            console.error(`Error fetching animal count for unit ${fazenda.id}:`, error);
          }
        });

        await Promise.all(animalCountPromises);
      },
      async openModal(id) {
        try {
          const response = await apiClient.get(`/unit/${id}`);
          this.selectedUnit = response.data;
          this.$refs.unitModal.open();
        } catch (error) {
          console.error('Error fetching unit details:', error);
        }
      },
      openUnitModal() {
        this.selectedUnit = null;
        this.$refs.unitModal.open();
      },
      fetchFazendasAfterAction() {
        this.fetchFazendas();
      }
    },
  };
</script>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .title {
    font-family: sans-serif;
    font-size: 24px;
    font-weight: bold;
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
