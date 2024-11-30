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

            <!-- Loading state -->
            <p v-if="loadingWeather" class="card-text">Carregando...</p>

            <!-- Error state -->
            <p v-else-if="errorWeather" class="card-text text-danger">Erro ao carregar clima</p>

            <!-- Weather information -->
            <p v-else>
              <!-- Weather Icon -->
              <i :class="getWeatherIconFromCode(weather.currentWeatherCode)" class="weather-icon"></i>
              {{ weather.description }}<br />
              <strong>{{ weather.temperature }}°C</strong>
            </p>

            <!-- Weather Forecast -->
            <div v-if="showForecast" v-for="(forecast, index) in weather.forecast" :key="index">
              <p> <strong>{{ forecast.dayOfWeek }} | {{ forecast.date }}:</strong> </p>
              <i :class="forecast.icon" class="weather-icon"></i>{{ forecast.description }}
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
        icon: "",
        temperature: null,
        currentWeatherCode: null,
        forecast: [],
      });
      const loadingWeather = ref(true);
      const errorWeather = ref(false);
      const showForecast = ref(false);

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

      // Função para obter o nome do dia da semana
      const getDayOfWeek = (dateStr) => {
        const daysOfWeek = [
          "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
          "Quinta-feira", "Sexta-feira", "Sábado"
        ];
        const date = new Date(dateStr);
        return daysOfWeek[date.getDay()];
      };

      function formatDate(inputDate) {
        // Ensure the input is in the format "yyyy-MM-dd"
        const parts = inputDate.split("-");
        if (parts.length !== 3) {
          throw new Error("Invalid date format. Expected format: yyyy-MM-dd");
        }

        const [year, month, day] = parts;

        // Return the formatted date as "dd-MM"
        return `${day}-${month}`;
      }

      // Function to get the weather icon class based on weather code
      const getWeatherIconFromCode = (weathercode) => {
        const weatherIcons = {
          0: "fas fa-sun", // Clear sky
          1: "fas fa-cloud-sun", // Partly cloudy
          2: "fas fa-cloud-sun", // Partly cloudy
          3: "fas fa-cloud", // Overcast
          45: "fas fa-smog", // Fog
          48: "fas fa-smog", // Fog
          51: "fas fa-cloud-rain", // Light drizzle
          53: "fas fa-cloud-showers-heavy", // Moderate drizzle
          55: "fas fa-cloud-showers-heavy", // Heavy drizzle
          61: "fas fa-cloud-rain", // Light rain
          63: "fas fa-cloud-showers-heavy", // Moderate rain
          65: "fas fa-cloud-showers-heavy", // Heavy rain
          66: "fas fa-snowflake", // Light freezing rain
          67: "fas fa-snowflake", // Heavy freezing rain
          71: "fas fa-snowflake", // Light snow
          73: "fas fa-snowflake", // Moderate snow
          75: "fas fa-snowflake", // Heavy snow
          80: "fas fa-cloud-showers-heavy", // Light rain showers
          81: "fas fa-cloud-showers-heavy", // Moderate rain showers
          82: "fas fa-cloud-showers-heavy", // Heavy rain showers
          95: "fas fa-bolt", // Thunderstorm
          96: "fas fa-cloud-bolt", // Thunderstorm with light hail
          99: "fas fa-cloud-bolt", // Thunderstorm with heavy hail
        };

        return weatherIcons[weathercode] || "fas fa-question-circle"; // Default icon for unknown codes
      };


      const getWeatherDescriptionFromCode = (weathercode) => {
        const weatherDescriptions = {
          0: "Céu limpo",
          1: "Parcialmente nublado",
          2: "Parcialmente nublado",
          3: "Encoberto",
          45: "Neblina",
          48: "Neblina",
          51: "Garoa leve",
          53: "Garoa moderada",
          55: "Garoa intensa",
          61: "Chuva leve",
          63: "Chuva moderada",
          65: "Chuva intensa",
          66: "Chuva congelante leve",
          67: "Chuva congelante intensa",
          71: "Neve leve",
          73: "Neve moderada",
          75: "Neve intensa",
          80: "Pancadas de chuva leve",
          81: "Pancadas de chuva moderada",
          82: "Pancadas de chuva forte",
          95: "Tempestade",
          96: "Tempestade com granizo leve",
          99: "Tempestade com granizo forte",
        };

        return weatherDescriptions[weathercode] || "Condição desconhecida";
      };

      const fetchWeather = async () => {
        try {
          const latitude = -22.35694;
          const longitude = -47.38416;

          const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=America/Sao_Paulo`;

          const response = await axios.get(apiUrl);

          const currentWeather = response.data.current_weather;
          const forecast = response.data.daily;

          if (!currentWeather || currentWeather.weathercode === undefined) {
            throw new Error("Current weather data is missing!");
          }

          weather.value.description = getWeatherDescriptionFromCode(currentWeather.weathercode);
          weather.value.icon = getWeatherIconFromCode(currentWeather.weathercode);
          weather.value.temperature = Math.round(currentWeather.temperature);
          weather.value.currentWeatherCode = currentWeather.weathercode;

          weather.value.forecast = forecast.time.slice(1, 4).map((dateStr, index) => ({
            dayOfWeek: new Date(dateStr).toLocaleDateString("pt-BR", { weekday: "long" }),
            date: formatDate(dateStr),
            maxTemperature: Math.round(forecast.temperature_2m_max[index]),
            minTemperature: Math.round(forecast.temperature_2m_min[index]),
            precipitation: forecast.precipitation_sum[index] || 0,
            description: getWeatherDescriptionFromCode(forecast.weathercode[index]),
            icon: getWeatherIconFromCode(forecast.weathercode[index]),
          }));

          console.log(weather.value.forecast);

          loadingWeather.value = false;
        } catch (error) {
          console.error(error);
          errorWeather.value = true;
          loadingWeather.value = false;
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
        getWeatherIconFromCode,
        toggleForecast,
      };
    },
  };
</script>

<style scoped>
  .weather-icon {
    font-size: 1.5rem;
    margin-right: 8px;
    color: #007bff;
    /* Example: Blue for all weather icons */
  }

  .card .weather-icon {
    font-size: 1.6rem;
    /* Larger icons for the main card */
  }
</style>