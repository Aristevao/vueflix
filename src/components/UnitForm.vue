<template>
  <div v-if="visible" class="entity-form-modal" @click="handleBackgroundClick">
    <div class="entity-form" @click.stop>
      <span class="close-button" @click="close">&times;</span>
      <h2>{{ localUnit.id ? 'Editar' : 'Adicionar' }} Fazenda</h2>
      <form @submitForm.prevent="submitForm">
        <div class="modal-body">
          <div class="mb-3">
            <label for="name" class="form-label">Nome</label>
            <input type="text" v-model="localUnit.name" id="name" class="form-control" required maxlength="100" />
          </div>

          <div class="mb-3">
            <label for="description" class="form-label">Descrição</label>
            <textarea v-model="localUnit.description" id="description" class="form-control" maxlength="500"></textarea>
          </div>

          <div class="mb-3">
            <label for="street" class="form-label">Rua</label>
            <input type="text" v-model="localUnit.address.street" id="street" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="number" class="form-label">Número</label>
            <input type="text" v-model="localUnit.address.number" id="number" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="district" class="form-label">Bairro</label>
            <input type="text" v-model="localUnit.address.district" id="district" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="complement" class="form-label">Complemento</label>
            <input type="text" v-model="localUnit.address.complement" id="complement" class="form-control" />
          </div>

          <div class="mb-3">
            <label for="zipcode" class="form-label">CEP</label>
            <input type="text" v-model="localUnit.address.zipcode" id="zipcode" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="city" class="form-label">Cidade</label>
            <input type="text" v-model="localUnit.address.city" id="city" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="state" class="form-label">Estado</label>
            <input type="text" v-model="localUnit.address.state" id="state" class="form-control" required />
          </div>

          <div class="mb-3">
            <label ref="fileLabel" for="fileInput" class="btn btn-light">{{ fileLabelText }}</label>
            <input ref="fileInput" type="file" id="fileInput" class="file-input" @change="updateFileLabel" />
          </div>

          <div v-if="base64Picture || localUnit.picture" class="image-preview text-center">
            <img :src="'data:image/png;base64,' + (base64Picture || localUnit.picture)" alt="Pré-visualização"
              class="img-fluid rounded" />
          </div>
        </div>

        <div class="button-group">
          <CustomButton type="red" class="delete-button" v-if="localUnit.id" @click="deleteUnit(localUnit.id)">
            Deletar
          </CustomButton>
          <div class="right-buttons">
            <CustomButton type="secondary" @click="cancelForm">Cancelar</CustomButton>
            <CustomButton type="primary" class="save-button" @click="submitForm">Salvar</CustomButton>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import apiClient from '../store/apiClient'
  import CustomButton from './CustomButton.vue'

  export default {
    props: {
      unit: {
        type: Object,
        default: null
      }
    },
    components: {
      CustomButton
    },
    data() {
      return {
        visible: false,
        localUnit: this.getInitialUnit(),
        file: null,
        base64Picture: '',
        fileLabelText: 'Selecionar Foto' // Texto inicial do botão de upload
      }
    },
    watch: {
      unit: {
        immediate: true,
        handler(newVal) {
          this.localUnit = newVal ? { ...this.getInitialUnit(), ...newVal } : this.getInitialUnit()
        }
      }
    },
    mounted() {
      const fileInput = this.$refs.fileInput;
      const fileLabel = this.$refs.fileLabel;

      if (fileInput) {
        fileInput.addEventListener("change", () => {
          const fileName = fileInput.files[0]?.name || "Nenhum arquivo escolhido";
          fileLabel.textContent = fileName;
        });
      }
    },
    methods: {
      getInitialUnit() {
        return {
          name: '',
          description: '',
          address: {
            street: '',
            number: '',
            district: '',
            complement: '',
            zipcode: '',
            city: '',
            state: ''
          },
          picture: null
        }
      },
      open() {
        this.visible = true
        document.addEventListener('keydown', this.handleKeydown)

        // Redefine o rótulo do botão de arquivo e a imagem de pré-visualização ao abrir o formulário
        this.fileLabelText = this.localUnit.picture ? 'Imagem Carregada' : 'Selecionar Foto';
        this.base64Picture = ''; // Limpa a imagem base64 temporária, mantendo a original da unidade, se houver
      },
      close() {
        this.visible = false
        this.$emit('close')
      },
      handleBackgroundClick(event) {
        if (event.target === event.currentTarget) {
          this.close()
        }
      },
      handleKeydown(event) {
        if (event.key === 'Escape') {
          this.close()
        } else if (event.key === 'Enter') {
          this.submitForm()
        }
      },
      // Atualiza o texto do botão e a imagem ao selecionar o arquivo
      updateFileLabel(event) {
        const fileName = event.target.files[0]?.name || 'Nenhum arquivo escolhido';
        this.fileLabelText = fileName;
        this.handleFileUpload(event);
      },
      // Manipula o upload da imagem e converte para base64
      handleFileUpload(event) {
        const file = event.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = () => {
            this.base64Picture = reader.result.split(',')[1] // Converte para base64 e remove o prefixo
          }
          reader.readAsDataURL(file)
        }
      },
      async submitForm() {
        const formData = new FormData()
        formData.append('name', this.localUnit.name)
        formData.append('description', this.localUnit.description)
        formData.append('address.street', this.localUnit.address.street)
        formData.append('address.number', this.localUnit.address.number)
        formData.append('address.district', this.localUnit.address.district)
        formData.append('address.complement', this.localUnit.address.complement)
        formData.append('address.zipcode', this.localUnit.address.zipcode)
        formData.append('address.city', this.localUnit.address.city)
        formData.append('address.state', this.localUnit.address.state)

        // Adiciona a imagem base64, se estiver disponível
        if (this.base64Picture) {
          formData.append('picture', this.base64Picture)
        }

        const url = this.localUnit.id ? `/unit/${this.localUnit.id}` : '/unit'
        const method = this.localUnit.id ? 'put' : 'post'

        try {
          const response = await apiClient({
            method,
            url,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          this.$emit('unit-created', response.data)
          this.close()
        } catch (error) {
          console.error('Error saving unit:', error)
        }
      },
      async deleteUnit(unitId) {
        try {
          await apiClient.delete(`/unit/${unitId}`)
          this.$emit('unit-deleted', unitId)
          this.close()
        } catch (error) {
          console.error('Error deleting unit:', error)
        }
      },
      cancelForm() {
        this.localUnit = this.unit ? { ...this.getInitialUnit(), ...this.unit } : this.getInitialUnit();
        this.base64Picture = ''; // Limpa a imagem temporária

        this.close()
      }
    }
  }
</script>

<style scoped>
  @import "@/assets/form-styles.css";

  .file-input {
    display: none;
  }

  .image-preview {
    margin-top: 15px;
    text-align: center;
  }

  .image-preview img {
    max-width: 100%;
    max-height: 200px;
    object-fit: cover;
    border-radius: 8px;
  }
</style>
