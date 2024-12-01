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
        <div class="card text-center h-100 vacas-card">
          <div class="card-body">
            <h5 class="card-title">Vacas no Curral</h5>
            <p v-if="loadingCorral" class="card-text">Carregando...</p>
            <p v-else-if="errorCorral" class="card-text text-danger">Erro ao carregar</p>
            <p v-else>
              <strong>Dentro:</strong> {{ corralStatus.totalInside }}<br />
              <strong>Fora:</strong> {{ corralStatus.totalOutside }}<br />
              <strong>Total:</strong> {{ corralStatus.animalsQuantity }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <!-- Card: Gráfico de Vacinação -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title text-center">Status de Vacinação</h5>
            <div v-if="loadingVaccinationChart">Carregando gráfico...</div>
            <div v-else-if="errorVaccinationChart" class="text-danger">Erro ao carregar gráfico</div>
            <canvas v-show="!loadingVaccinationChart && !errorVaccinationChart" id="vaccinationChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Card: Gráfico de Rosca -->
      <div class="col-md-3">
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

      const corralStatus = ref({
        totalOutside: 0,
        totalInside: 0,
        animalsQuantity: 0,
      });
      const loadingCorral = ref(true);
      const errorCorral = ref(false);

      const fetchCorralStatus = async () => {
        loadingCorral.value = true;
        errorCorral.value = false;

        try {
          const response = await apiClient.get("/animal/status");
          const data = await response.data;
          corralStatus.value = {
            totalOutside: data.totalOutside,
            totalInside: data.totalInside,
            animalsQuantity: data.animalsQuantity,
          };
        } catch (error) {
          console.error("Error fetching corral status:", error);
          errorCorral.value = true;
        } finally {
          loadingCorral.value = false;
        }
      };

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

      function getDayOfWeek(data) {
        const dayOfWeek = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

        const date = new Date(data);
        date.setDate(date.getDate() + 1);

        return dayOfWeek[date.getDay()];
      }

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
            dayOfWeek: getDayOfWeek(dateStr),
            date: formatDate(dateStr),
            maxTemperature: Math.round(forecast.temperature_2m_max[index]),
            minTemperature: Math.round(forecast.temperature_2m_min[index]),
            precipitation: forecast.precipitation_sum[index] || 0,
            description: getWeatherDescriptionFromCode(forecast.weathercode[index]),
            icon: getWeatherIconFromCode(forecast.weathercode[index]),
          }));

          loadingWeather.value = false;
        } catch (error) {
          console.error(error);
          errorWeather.value = true;
          loadingWeather.value = false;
        }
      };

      // Estados para o gráfico de vacinação
      const loadingVaccinationChart = ref(true);
      const errorVaccinationChart = ref(false);
      const vaccinationData = ref({ VacinasAtrasadas: 0, VacinasEmDia: 0 });
      let vaccinationChartInstance = null;

      // Função para buscar os dados de vacinação
      const fetchVaccinationData = async () => {
        try {
          const response = await apiClient.get("dashboard/vaccination-status"); // Endpoint para buscar os dados
          const rawData = response.data;

          // Inicialize os contadores
          const vaccinationSummary = { "Vacinas Em Dia": 0, "Vacinas Atrasadas": 0, "Vacinas Futuras": 0 };

          rawData.forEach((animal) => {
            animal.vaccineStatuses.forEach((vaccine) => {
              if (vaccine.isVaccinated) {
                // Contabilizar vacinas em dia
                vaccinationSummary["Vacinas Em Dia"]++;
              } else if (new Date(vaccine.nextVaccineDate) < new Date()) {
                // Contabilizar vacinas atrasadas
                vaccinationSummary["Vacinas Atrasadas"]++;
              } else {
                // Contabilizar vacinas futuras
                vaccinationSummary["Vacinas Futuras"]++;
              }
            });
          });

          // Atualize os dados para o gráfico
          vaccinationData.value = vaccinationSummary;
          loadingVaccinationChart.value = false;
        } catch (err) {
          console.error("Erro ao buscar status de vacinação:", err);
          errorVaccinationChart.value = true;
          loadingVaccinationChart.value = false;
        }
      };


      // Função para inicializar o gráfico de barras de vacinação com dados da API
      const initializeVaccinationChart = () => {
        const ctx = document.getElementById("vaccinationChart").getContext("2d");

        const labels = Object.keys(vaccinationData.value); // ["Vacinas Em Dia", "Vacinas Atrasadas", "Vacinas Futuras"]
        const data = Object.values(vaccinationData.value); // [x, y, z]

        if (vaccinationChartInstance) {
          vaccinationChartInstance.destroy(); // Destroi o gráfico anterior antes de recriar
        }

        vaccinationChartInstance = new Chart(ctx, {
          type: "bar", // Mudando para gráfico de barras
          data: {
            labels,
            datasets: [
              {
                label: 'Quantidade de Animais',
                data,
                backgroundColor: ["#28a745", "#dc3545", "#007bff"], // Verde, Vermelho e Azul
                borderColor: ["#28a745", "#dc3545", "#007bff"], // Cor da borda das barras
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true, // Começa o eixo Y do gráfico do zero
              },
            },
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    label += context.raw;
                    return label;
                  },
                },
              },
            },
          },
        });
      };

      onMounted(async () => {
        await fetchAnimalCategories();
        if (!errorChart.value) {
          initializeChart();
        }
        fetchWeather();
        fetchAnimalCount();
        fetchFarmCount();
        fetchCorralStatus();
        await fetchVaccinationData();
        if (!errorVaccinationChart.value) {
          initializeVaccinationChart();
        }

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
        animalCategories,
        loadingChart,
        errorChart,
        weather,
        loadingWeather,
        errorWeather,
        showForecast,
        getWeatherIconFromCode,
        toggleForecast,
        corralStatus,
        loadingCorral,
        errorCorral,
        loadingVaccinationChart,
        errorVaccinationChart,
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

  .vacas-card {
    min-height: 131.19px;
    /* Altura mínima reduzida */
    max-height: 133.19px;
    /* Opcional: limite máximo */
  }
</style>