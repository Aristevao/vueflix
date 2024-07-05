<template>
  <div>
    <h1 class="title">Animais</h1>
    <table class="animal-table">
      <!-- Table header -->
      <thead>
        <tr>
          <th class="image-column"></th>
          <th class="id-column">ID</th>
          <th class="name-column">Name</th>
          <th class="species-column">Species</th>
          <th class="race-column">Race</th>
          <th class="sex-column">Sex</th>
          <th class="age-column">Age</th>
          <th class="registration-date-column">Registration Date</th>
        </tr>
      </thead>
      <!-- Table body -->
      <tbody>
        <tr v-for="animal in mockAnimals" :key="animal.id">
          <td class="image-column">
            <img :src="animal.imageUrl" alt="Animal Image" width="50" height="50" />
          </td>
          <td class="id-column">{{ animal.id }}</td>
          <td class="name-column">{{ animal.name }}</td>
          <td class="species-column">{{ animal.species }}</td>
          <td class="race-column">{{ animal.race }}</td>
          <td class="sex-column">{{ animal.sex }}</td>
          <td class="age-column">{{ animal.age }}</td>
          <td class="registration-date-column">{{ animal.registrationDate }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination component -->
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="handlePageChange" />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import Pagination from './Pagination.vue'; // Import your Pagination component

  export default defineComponent({
    name: 'Animais',
    components: {
      Pagination, // Register the Pagination component
    },
    data() {
      return {
        mockAnimals: [
          {
            id: 135242,
            name: 'Lysimachos Lakshmi',
            species: 'Gado bovino',
            race: 'Lã',
            sex: 'Macho',
            age: '1 mês',
            registrationDate: '10/07/2023',
            imageUrl: 'http://loremflickr.com/640/480/animals',
          },
          {
            id: 135242,
            name: 'Lysimachos Lakshmi',
            species: 'Gado bovino',
            race: 'Lã',
            sex: 'Macho',
            age: '1 mês',
            registrationDate: '10/07/2023',
            imageUrl: 'http://loremflickr.com/640/480/animals',
          },
          {
            id: 135242,
            name: 'Lysimachos Lakshmi',
            species: 'Gado bovino',
            race: 'Lã',
            sex: 'Macho',
            age: '1 mês',
            registrationDate: '10/07/2023',
            imageUrl: 'http://loremflickr.com/640/480/animals',
          },
          {
            id: 135242,
            name: 'Lysimachos Lakshmi',
            species: 'Gado bovino',
            race: 'Lã',
            sex: 'Macho',
            age: '1 mês',
            registrationDate: '10/07/2023',
            imageUrl: 'http://loremflickr.com/640/480/animals',
          },
          {
            id: 135242,
            name: 'Lysimachos Lakshmi',
            species: 'Gado bovino',
            race: 'Lã',
            sex: 'Macho',
            age: '1 mês',
            registrationDate: '10/07/2023',
            imageUrl: 'http://loremflickr.com/640/480/animals',
          },
        ],
        currentPage: 1, // Initialize with the current page
        totalPages: 10, // Replace with the actual total number of pages
      };
    },
    methods: {
      handlePageChange(newPage) {
        // Handle page change logic (e.g., fetch data for the new page)
        this.currentPage = newPage;
      },
    },
  });
</script>

<style scoped>
  .title {
    font-family: sans-serif;
  }

  .animal-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0px 0;
    font-family: sans-serif;
  }

  .animal-table th,
  .animal-table td {
    padding: 10px;
    text-align: left;
  }

  .animal-table th {
    /* background-color: #f2f2f2; */
  }

  .animal-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .animal-table img {
    border-radius: 17%;
  }

  .image-column {
    width: 50px;
    text-align: center;
  }

  .id-column {
    width: 50px;
  }

  .name-column {
    width: 120px;
  }

  .species-column {
    width: 100px;
  }

  .race-column {
    width: 80px;
  }

  .sex-column {
    width: 50px;
  }

  .age-column {
    width: 80px;
  }

  .registration-date-column {
    width: 150px;
  }
</style>
