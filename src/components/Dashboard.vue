<template>
  <div class="container mt-4">
    <!-- Row 1: Cards superiores -->
    <div class="row">
      <!-- Card: Quantidade de Animais -->
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Animais</h5>
            <p v-if="loadingAnimals" class="card-text">Carregando...</p>
            <p v-else-if="errorAnimals" class="card-text text-danger">Erro ao carregar</p>
            <p v-else class="card-text display-4">{{ animals }}</p>
          </div>
        </div>
      </div>

      <!-- Card: Quantidade de Fazendas -->
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Fazendas</h5>
            <p v-if="loadingFarms" class="card-text">Carregando...</p>
            <p v-else-if="errorFarms" class="card-text text-danger">Erro ao carregar</p>
            <p v-else class="card-text display-4">{{ farms }}</p>
          </div>
        </div>
      </div>

      <!-- Card: Informação Climática -->
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Clima</h5>
            <p class="card-text">{{ weather.description }}</p>
            <p class="card-text">{{ weather.temperature }}°C</p>
          </div>
        </div>
      </div>

      <!-- Card: Vacas no Curral -->
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Vacas no Curral</h5>
            <p class="card-text display-4">{{ cowsInCorral }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 2: Gráfico de Rosca -->
    <div class="row mt-4">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title text-center">Quantidade por Categoria</h5>
            <canvas id="pieChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import apiClient from '../store/apiClient'

export default {
  setup() {
    // Estados para Animais
    const animals = ref(0);
    const loadingAnimals = ref(true);
    const errorAnimals = ref(false);

    // Estados para Fazendas
    const farms = ref(0);
    const loadingFarms = ref(true);
    const errorFarms = ref(false);

    // Outros estados
    const weather = ref({ description: "Ensolarado", temperature: 28 });
    const cowsInCorral = ref(10);

    const animalCategories = ref({
      Boi: 20,
      Vaca: 15,
      Bezerro: 18,
    });

    // Função para buscar contagem de Animais
    const fetchAnimalCount = async () => {
      try {
        const response = await apiClient.get("/animal/count");
        animals.value = response.data;
        loadingAnimals.value = false;
      } catch (err) {
        console.error("Erro ao buscar quantidade de animais:", err);
        errorAnimals.value = true;
        loadingAnimals.value = false;
      }
    };

    // Função para buscar contagem de Fazendas
    const fetchFarmCount = async () => {
      try {
        const response = await apiClient.get("/unit/count");
        farms.value = response.data;
        loadingFarms.value = false;
      } catch (err) {
        console.error("Erro ao buscar quantidade de fazendas:", err);
        errorFarms.value = true;
        loadingFarms.value = false;
      }
    };

    onMounted(() => {
      fetchAnimalCount();
      fetchFarmCount();

      // Gráfico de rosca
      const ctx = document.getElementById("pieChart").getContext("2d");
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: Object.keys(animalCategories.value),
          datasets: [
            {
              data: Object.values(animalCategories.value),
              backgroundColor: ["#007bff", "#28a745", "#ffc107"],
            },
          ],
        },
      });
    });

    return {
      animals,
      loadingAnimals,
      errorAnimals,
      farms,
      loadingFarms,
      errorFarms,
      weather,
      cowsInCorral,
      animalCategories,
    };
  },
};
</script>
