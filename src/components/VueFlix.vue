<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const movies = ref([
  // {
  //   imagem: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/eqNdWOXUuTWefYMycWz7dVE0Irv.jpg',
  //   nome: 'Vue.js: The Documentary',
  //   lancamento: '24/02/2020',
  //   genero: 'Documentário',
  //   like: true
  // },
])

const isAddingNew = ref(false)

const newName = ref('')
const newImageURL = ref('')
const newReleaseDate = ref('')
const newGenre = ref('')

const exitAddMode = () => {
  // reset inputs
  newImageURL.value = ''
  newName.value = ''
  newReleaseDate.value = ''
  newGenre.value = ''

  isAddingNew.value = false
}

const saveNewMovie = () => {
  // add movie to array
  movies.value.push({
    image: newImageURL.value,
    name: newName.value,
    releaseDate: newReleaseDate.value,
    genre: newGenre.value,
    like: undefined
  })

  exitAddMode()
}

const deleteMovie = (index) => {
  const text = `Confirma a exclusão do filme ${movies.value[index].name}`
  if (confirm(text) === true) {
    movies.value.splice(index, 1)
  }
}

const setLike = (index, liked) => {
  movies.value[index].like = liked
}

// todos | gostei | nao-gostei
const selectedFilter = ref('all')

const filteredMovies = computed(() => {
  switch (selectedFilter.value) {
    case 'liked':
      return movies.value.filter((item) => item.like === true)
    case 'disliked':
      return movies.value.filter((item) => item.like === false)
    default:
      return movies.value
  }
})

// Para evitar sobrescrever os dados do local storage
// para garantir que até quando mudamos o like
watch(
  () => movies,
  (novo, velho) => {
    if (velho !== undefined) {
      localStorage.setItem('vueflix', JSON.stringify(movies.value))
    }
  },
  { deep: true }
)

onMounted(() => {
  const dadosLocalStorage = localStorage.getItem('vueflix')
  if (dadosLocalStorage) {
    movies.value = JSON.parse(dadosLocalStorage)
  }
})
</script>
<template>
  <div class="vueflix">
    <div class="acoes-usuario">
      <div class="filtros">
        <div class="titulo">Filtrar</div>
        <div class="opcoes-filtros">
          <button
            class="botao"
            :class="{ ativo: selectedFilter === 'all' }"
            @click="selectedFilter = 'all'"
          >
            Todos
          </button>
          <button
            class="botao"
            :class="{ ativo: selectedFilter === 'liked' }"
            @click="selectedFilter = 'liked'"
          >
            Gostei
          </button>
          <button
            class="botao"
            :class="{ ativo: selectedFilter === 'disliked' }"
            @click="selectedFilter = 'disliked'"
          >
            Não Gostei
          </button>
        </div>
      </div>

      <div class="novo-filme">
        <div v-if="isAddingNew" class="adicionar-filme">
          <input type="text" autocomplete="off" placeholder="Nome do Filme" v-model="newName" />
          <input
            type="text"
            autocomplete="off"
            placeholder="URL da Imagem"
            v-model="newImageURL"
          />
          <input
            type="text"
            autocomplete="off"
            placeholder="Data de Lançamento"
            v-model="newReleaseDate"
          />
          <input type="text" autocomplete="off" placeholder="Gênero" v-model="newGenre" />
          <div class="acoes">
            <button class="botao ativo" @click="saveNewMovie">Salvar</button>
            <button class="botao danger ativo" @click="exitAddMode">Cancelar</button>
          </div>
        </div>
        <button v-else class="botao ativo" @click="isAddingNew = true">
          Adicionar Filme
        </button>
      </div>
    </div>

    <div class="filmes">
      <div v-for="(filme, index) in filteredMovies" class="filme">
        <div class="capa-container">
          <div class="acoes-filme">
            <button
              class="botao"
              :class="{ ativo: filme.like === true }"
              @click="setLike(index, true)"
            >
              Gostei
            </button>
            <button
              class="botao danger"
              :class="{ ativo: filme.like === false }"
              @click="setLike(index, false)"
            >
              Não Gostei
            </button>
            <button class="botao danger" @click="deleteMovie(index)">Excluir</button>
          </div>
          <img class="capa" :src="filme.imagem" :alt="filme.nome" />
        </div>
        <div class="nome">{{ filme.nome }}</div>
        <div class="info">{{ filme.lancamento }} - {{ filme.genero }}</div>
      </div>
      <p
        v-if="filteredMovies.length === 0"
        :style="{ flex: 1, textAlign: 'center', marginTop: '16px' }"
      >
        Nenhum Filme para exibir
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vueflix {
  padding: 16px;

  .acoes-usuario {
    display: flex;
    justify-content: space-between;
    align-items: end;
    margin: 30px 0;

    .adicionar-filme {
      display: flex;
    }
  }

  .filmes {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    min-height: 350px;

    .filme {
      width: 200px;
      .capa-container {
        width: 100%;
        height: auto;
        position: relative;
        .capa {
          width: 100%;
          height: 100%;
        }

        .acoes-filme {
          position: absolute;
          bottom: 0;
          padding-bottom: 12px;
          background-image: linear-gradient(to bottom, rgba(255, 0, 0, 0), rgb(0, 0, 0));
          display: none;
          flex-direction: column;
          width: 100%;
          height: 100%;
          justify-content: flex-end;
        }
      }

      .nome {
        font-weight: bold;
      }

      .info {
        font-size: 12px;
      }

      &:hover {
        .acoes-filme {
          display: flex;
        }
      }
    }
  }
}
</style>
