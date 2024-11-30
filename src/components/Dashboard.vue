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
        <div class="card text-center" @click="toggleForecast">
          <div class="card-body">
            <h5 class="card-title">Clima</h5>
            <p v-if="loadingWeather" class="card-text">Carregando...</p>
            <p v-else-if="errorWeather" class="card-text text-danger">Erro ao carregar clima</p>
            <p v-else>
              {{ weather.description }}<br />
              <strong>{{ weather.temperature }}°C</strong>
            </p>
            <!-- Exibição da previsão quando o estado 'showForecast' for verdadeiro -->
            <div v-if="showForecast" v-for="(forecast, index) in weather.forecast" :key="index">
              <p><strong>{{ forecast.date }}:</strong></p>
              <p>Max: {{ forecast.maxTemperature }}°C</p>
              <p>Min: {{ forecast.minTemperature }}°C</p>
              <p>Precipitação: {{ forecast.precipitation }} mm</p>
            </div>
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
            <div v-if="loadingChart">Carregando gráfico...</div>
            <div v-else-if="errorChart" class="text-danger">Erro ao carregar gráfico</div>
            <canvas v-show="!loadingChart && !errorChart" id="pieChart"></canvas>
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
  import axios from "axios";

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
      const cowsInCorral = ref(10);

      // Estados para o gráfico
      const loadingChart = ref(true);
      const errorChart = ref(false);
      let chartInstance = null; // Instância do gráfico

      const animalCategories = ref({
        Boi: 20,
        Vaca: 15,
        Bezerro: 18,
      });

      const weather = ref({
        description: "",
        temperature: null,
        forecast: [], // Previsão para os próximos 3 dias
      });
      const loadingWeather = ref(true);
      const errorWeather = ref(false);

      // Estado para controlar a exibição da previsão
      const showForecast = ref(false);

      // Função para buscar o clima
      const fetchWeather = async () => {
        try {
          const latitude = -22.35694;
          const longitude = -47.38416;

          // API gratuita Open-Meteo com previsão para os próximos 3 dias
          const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=America/Sao_Paulo`;

          const response = await axios.get(apiUrl);
          const currentWeather = response.data.current_weather;
          const forecast = response.data.daily;

          // Atualizar os dados do clima
          weather.value.description = "Temperatura atual";
          weather.value.temperature = Math.round(currentWeather.temperature);

          // Agora mapeamos os dados corretamente, sem usar 'timezone'
          // Vamos adicionar manualmente as datas para cada previsão
          weather.value.forecast = forecast.temperature_2m_max.slice(0, 3).map((_, index) => ({
            date: forecast.timezone, // Data está agora disponível na chave 'timezone'
            maxTemperature: Math.round(forecast.temperature_2m_max[index]), // Temperatura máxima
            minTemperature: Math.round(forecast.temperature_2m_min[index]), // Temperatura mínima
            precipitation: forecast.precipitation_sum[index] || 0, // Precipitação
          }));

          loadingWeather.value = false;
        } catch (err) {
          console.error("Erro ao buscar dados de clima:", err);
          errorWeather.value = true;
          loadingWeather.value = false;
        }
      };

      // Função para alternar a exibição da previsão
      const toggleForecast = () => {
        showForecast.value = !showForecast.value;
      };

      // Função para buscar dados de espécies
      const fetchAnimalCategories = async () => {
        try {
          const response = await apiClient.get("/animal/count/specie");
          animalCategories.value = response.data;
          loadingChart.value = false;
        } catch (err) {
          console.error("Erro ao buscar categorias de animais:", err);
          errorChart.value = true;
          loadingChart.value = false;
        }
      };

      // Função para inicializar o gráfico
      const initializeChart = () => {
        const ctx = document.getElementById("pieChart").getContext("2d");
        const labels = Object.keys(animalCategories.value);
        const data = Object.values(animalCategories.value);

        if (chartInstance) {
          chartInstance.destroy(); // Destroi o gráfico anterior antes de recriar
        }

        chartInstance = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels,
            datasets: [
              {
                data,
                backgroundColor: [
                  "#007bff",
                  "#28a745",
                  "#ffc107",
                  "#dc3545",
                  "#6f42c1",
                  "#17a2b8",
                  "#fd7e14",
                  "#20c997",
                ],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          },
        });
      };

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

      onMounted(async () => {
        await fetchAnimalCategories();
        if (!errorChart.value) {
          initializeChart();
        }
        fetchWeather();
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

      // Recria o gráfico toda vez que os dados forem atualizados
      // watch(animalCategories, () => {
      //   if (!loadingChart.value && !errorChart.value) {
      //     initializeChart();
      //   }
      // });

      return {
        animals,
        loadingAnimals,
        errorAnimals,
        farms,
        loadingFarms,
        errorFarms,
        cowsInCorral,
        animalCategories,
        loadingChart,
        errorChart,
        weather,
        loadingWeather,
        errorWeather,
        showForecast,
        toggleForecast,
      };
    },
  };
</script>
