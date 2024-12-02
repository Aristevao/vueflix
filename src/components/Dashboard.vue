<template>
  <div class="container mt-4">
    <!-- Row 1: Cards superiores -->
    <div class="row">
      <!-- Card: Quantidade de Animais -->
      <div class="col-md-3">
        <div class="card text-center" @click="redirectToAnimalsList">
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
        <div class="card text-center" @click="redirectToUnitList">
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
              <i :class="getWeatherIconFromCode(weather.currentWeatherCode)" class="weather-icon"></i>
              {{ weather.description }}<br />
              <strong>{{ weather.temperature }}°C</strong>
            </p>
            <div v-if="showForecast" v-for="(forecast, index) in weather.forecast" :key="index">
              <p><strong>{{ forecast.dayOfWeek }} | {{ forecast.date }}:</strong></p>
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
        <div class="card h-100">
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
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title text-center">Quantidade por Categoria</h5>
            <div v-if="loadingChart">Carregando gráfico...</div>
            <div v-else-if="errorChart" class="text-danger">Erro ao carregar gráfico</div>
            <canvas v-show="!loadingChart && !errorChart" id="pieChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Card: Lista de Notificações -->
      <div class="col-md-3">
        <div class="card h-100" @click="redirectToNotificationList">
          <div class="card-body">
            <h5 class="card-title text-center">
              <span class="position-relative">
                <i class="bi bi-bell-fill me-2"></i>
                <!-- Bolinha vermelha (badge) condicional -->
                <span v-if="notifications.length > 0" class="notification-badge"></span>
              </span>
              Notificações
            </h5>
            <div class="notification-list">
              <ul class="list-group">
                <li v-if="loadingNotifications" class="list-group-item text-center">
                  Carregando notificações...
                </li>
                <li v-else-if="errorNotifications" class="list-group-item text-danger text-center">
                  Erro ao carregar notificações
                </li>

                <li v-else-if="notifications.length === 0" class="list-group-item text-center">
                  Não há notificações no momento.
                </li>

                <li v-else v-for="notification in notifications" :key="notification.id" class="list-group-item"
                  :title="notification.message">
                  <strong>{{ notification.title }}</strong>
                  <p class="message-truncated">
                    {{ truncateMessage(notification.message) }}
                  </p>
                  <small class="text-muted d-block">
                    Recebido em: {{ formatNotificationDate(notification.createdAt) }}
                  </small>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <!-- Card: Gráfico de Evolução -->
      <div class="col-md-12">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title text-center">Evolução de Animais</h5>
            <div class="d-flex justify-content-end mb-3">
              <select v-model="selectedView" @change="fetchData" class="form-select w-25">
                <option value="entries">Entradas Mensais</option>
                <option value="evolution">Evolução Acumulada</option>
              </select>
            </div>
            <div v-if="loadingChart">Carregando gráfico...</div>
            <div v-else-if="errorChart" class="text-danger">Erro ao carregar gráfico</div>
            <canvas v-show="!loadingChart && !errorChart" id="evolutionChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import Chart from "chart.js/auto";
  import apiClient from '../store/apiClient'
  import axios from "axios";
  import { useRouter } from 'vue-router'

  export default {
    setup() {
      const router = useRouter()

      // Estados para Animais
      const animals = ref(0);
      const loadingAnimals = ref(true);
      const errorAnimals = ref(false);

      const redirectToAnimalsList = () => {
        router.push({ name: 'Animals' })
      };

      // Estados para Fazendas
      const farms = ref(0);
      const loadingFarms = ref(true);
      const errorFarms = ref(false);

      const redirectToUnitList = () => {
        router.push({ name: 'Units' })
      };

      const redirectToNotificationList = () => {
        router.push({ name: 'Notifications' })
      };

      const notifications = ref([]);
      const loadingNotifications = ref(true);
      const errorNotifications = ref(false);

      const fetchNotifications = async () => {
        try {
          loadingNotifications.value = true;
          errorNotifications.value = false;
          const response = await apiClient.get("/notification?isRead=false");
          notifications.value = response.data.content;
        } catch (error) {
          console.error("Erro ao carregar notificações:", error);
          errorNotifications.value = true;
        } finally {
          loadingNotifications.value = false;
        }
      };

      // Formatar a data (removido "async")
      const formatNotificationDate = (dateString) => {
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        return new Date(dateString).toLocaleDateString("pt-BR", options);
      };

      // Truncar mensagem (removido "async")
      const truncateMessage = (message, maxLength = 60) => {
        return message.length > maxLength
          ? message.slice(0, maxLength) + "..."
          : message;
      };

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
          const data = response.data;
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

      const animalsEvolutionLoadingChart = ref(true);
      const animalsEvolutionErrorChart = ref(false);
      const selectedView = ref("entries"); // View selecionada: 'entries' ou 'evolution'
      let animalsEvolutionChartInstance = null;

      const fetchData = async () => {
        animalsEvolutionLoadingChart.value = true;
        animalsEvolutionErrorChart.value = false;

        try {
          const response = await apiClient.get(
            `/dashboard/${selectedView.value === "entries" ? "animal-entries" : "animal-evolution"
            }`,
          );

          updateChart(response.data);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
          animalsEvolutionErrorChart.value = true;
        } finally {
          animalsEvolutionLoadingChart.value = false;
        }
      };

      const updateChart = (data) => {
        const ctx = document.getElementById("evolutionChart").getContext("2d");

        const months = data.map((d) => d.month);
        const total = data.map((d) => d.total);

        // Extrair espécies dinamicamente
        const species = Array.from(
          new Set(
            data.flatMap((d) =>
              Object.keys(d).filter((key) => key !== "month" && key !== "total")
            )
          )
        );

        const datasets = [
          {
            label: "Total de Animais",
            data: total,
            borderColor: "#007bff",
            fill: false,
          },
          ...species.map((specie) => ({
            label: specie,
            data: data.map((d) => d[specie] || 0),
            borderColor: generateRandomColor(),
            fill: false,
          })),
        ];

        if (animalsEvolutionChartInstance) animalsEvolutionChartInstance.destroy();

        animalsEvolutionChartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: months,
            datasets,
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                position: "top",
              },
            },
          },
        });
      };

      const generateRandomColor = () =>
        `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Gera cores aleatórias

      // Set interval to fetch data every 10 seconds
      let corralDataInterval;

      onMounted(async () => {
        await fetchAnimalCategories();
        if (!errorChart.value) {
          initializeChart();
        }
        fetchWeather();
        fetchAnimalCount();
        fetchFarmCount();
        fetchNotifications();

        fetchCorralStatus(); // Initial fetch when mounted
        corralDataInterval = setInterval(() => {
          fetchCorralStatus(); // Fetch every 10 seconds
        }, 30000);

        await fetchVaccinationData();
        if (!errorVaccinationChart.value) {
          initializeVaccinationChart();
        }
        fetchData();

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
      onBeforeUnmount(() => {
        // Clear the interval when the component is destroyed
        clearInterval(corralDataInterval);
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
        redirectToAnimalsList,
        redirectToUnitList,
        corralStatus,
        loadingCorral,
        errorCorral,
        loadingVaccinationChart,
        errorVaccinationChart,
        animalsEvolutionLoadingChart,
        animalsEvolutionErrorChart,
        selectedView,
        fetchData,
        notifications,
        loadingNotifications,
        errorNotifications,
        truncateMessage,
        formatNotificationDate,
        redirectToNotificationList,
      };
    },
  };
</script>

<style scoped>
  .weather-icon {
    font-size: 1.5rem;
    margin-right: 8px;
    color: #007bff;
    /* Blue for all weather icons */
  }

  .card .weather-icon {
    font-size: 1.6rem;
    /* Larger icons for the main card */
  }

  .vacas-card {
    min-height: 131.19px;
    /* Reduced minimum height */
    max-height: 133.19px;
    /* Optional: max height limit */
  }

  .h-100 {
    height: 100%;
  }

  .notification-list {
    max-height: 300px;
    /* Define altura fixa */
    overflow-y: auto;
    /* Adiciona barra de rolagem interna */
  }

  .list-group-item {
    font-size: 0.85rem;
    /* Reduz tamanho da fonte */
    padding: 0.5rem 0.75rem;
  }

  .message-truncated {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    padding: 0;
  }

  .notification-badge {
    position: absolute;
    top: -2px;
    right: 3px;
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
    border: 1px solid white;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  }
</style>