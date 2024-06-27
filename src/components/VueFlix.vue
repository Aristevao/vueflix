<script setup>

const filmes = 

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
        <!-- <div class="adicionar-filme">
          <input type="text" autocomplete="off" placeholder="Nome do Filme" />
          <input type="text" autocomplete="off" placeholder="URL da Imagem" />
          <input type="text" autocomplete="off" placeholder="Ano de Lançamento" />
          <input type="text" autocomplete="off" placeholder="Gênero" />
          <div class="acoes">
            <button class="botao ativo">Salvar</button>
            <button class="botao danger ativo">Cancelar</button>
          </div>
        </div> -->
        <button class="botao ativo">Adicionar Filme</button>
      </div>
    </div>

    <div class="filmes">
      <div class="filme">
        <div class="capa-container">
          <div class="acoes-filme">
            <button class="botao">Gostei</button>
            <button class="botao danger">Não Gostei</button>
            <button class="botao danger">Excluir</button>
          </div>
          <img
            class="capa"
            src="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/eqNdWOXUuTWefYMycWz7dVE0Irv.jpg"
            alt=""
          />
        </div>
        <div class="nome">Vue.js: The Documentary</div>
        <div class="info">24/02/2020 - Documentário</div>
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
