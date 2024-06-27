<script setup>
  import { ref } from 'vue';


  const filmes = ref([
    {
      nome: 'Vue.js: The Documentary',
      lancamento: '24/02/2020',
      genero: 'Documentário',
      imagem: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/eqNdWOXUuTWefYMycWz7dVE0Irv.jpg'
    },
    {
      nome: 'Vue.js: The Documentary',
      lancamento: '24/02/2020',
      genero: 'Documentário',
      imagem: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/eqNdWOXUuTWefYMycWz7dVE0Irv.jpg'
    },
    {
      nome: 'Vue.js: The Documentary',
      lancamento: '24/02/2020',
      genero: 'Documentário',
      imagem: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/eqNdWOXUuTWefYMycWz7dVE0Irv.jpg'
    },
    {
      nome: 'Vue.js: The Documentary',
      lancamento: '24/02/2020',
      genero: 'Documentário',
      imagem: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/eqNdWOXUuTWefYMycWz7dVE0Irv.jpg'
    }
  ]);

  const adicionandoFilme = ref(false);

  const nomeFilme = ref("")
  const lancamentoFilme = ref("")
  const generoFilme = ref("")
  const imagemFilme = ref("")

  const salvarFilme = () => {
    if (nomeFilme.value !== "") {
      filmes.value.push({
        nome: nomeFilme.value,
        lancamento: lancamentoFilme.value,
        genero: generoFilme.value,
        imagem: imagemFilme.value
      });

      fecharCriacaiDeFilme();
    }
  }

  const fecharCriacaiDeFilme = () => {
    nomeFilme.value = "";
    lancamentoFilme.value = "";
    generoFilme.value = "";
    imagemFilme.value = "";

    adicionandoFilme.value = false;
  }
</script>
<template>
  <div class="vueflix">
    <div class="acoes-usuario">
      <div class="filtros">
        <div class="titulo">Filtrar</div>
        <div class="opcoes-filtros">
          <button class="botao ativo">Todos</button>
          <button class="botao">Gostei</button>
          <button class="botao">Não Gostei</button>
        </div>
      </div>

      <div class="novo-filme">
        <div v-if="adicionandoFilme" class="adicionar-filme">
          <input v-model="nomeFilme" type="text" autocomplete="off" placeholder="Nome do Filme" />
          <input v-model="imagemFilme" type="text" autocomplete="off" placeholder="URL da Imagem" />
          <input v-model="lancamentoFilme" type="text" autocomplete="off" placeholder="Ano de Lançamento" />
          <input v-model="generoFilme" type="text" autocomplete="off" placeholder="Gênero" />
          <div class="acoes">
            <button class="botao ativo" @click="salvarFilme">Salvar</button>
            <button class="botao danger ativo" @click="fecharCriacaiDeFilme">Cancelar</button>
          </div>
        </div>
        <button v-else class="botao ativo" @click="adicionandoFilme = true">Adicionar Filme</button>
      </div>
    </div>

    <div class="filmes">
      <div v-for="filme in filmes" class="filme">
        <div class="capa-container">
          <div class="acoes-filme">
            <button class="botao">Gostei</button>
            <button class="botao danger">Não Gostei</button>
            <button class="botao danger">Excluir</button>
          </div>
          <img class="capa" :src="filme.imagem" alt="" />
        </div>
        <div class="nome">{{ filme.nome }}</div>
        <div class="info">{{ filme.lancamento }} - {{ filme.genero }}</div>
      </div>
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
        .capa-container {
          width: 200px;
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
