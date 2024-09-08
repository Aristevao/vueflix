<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h2>{{ localUnit.id ? 'Edit' : 'Add' }} Unit</h2>
      <form @submitForm.prevent="submitForm">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" v-model="localUnit.name" id="name" required maxlength="100" />
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea v-model="localUnit.description" id="description" maxlength="500"></textarea>
        </div>
        <div class="form-group">
          <label for="street">Street</label>
          <input type="text" v-model="localUnit.address.street" id="street" required />
        </div>
        <div class="form-group">
          <label for="number">Number</label>
          <input type="text" v-model="localUnit.address.number" id="number" required />
        </div>
        <div class="form-group">
          <label for="district">District</label>
          <input type="text" v-model="localUnit.address.district" id="district" required />
        </div>
        <div class="form-group">
          <label for="complement">Complement</label>
          <input type="text" v-model="localUnit.address.complement" id="complement" />
        </div>
        <div class="form-group">
          <label for="zipcode">Zipcode</label>
          <input type="text" v-model="localUnit.address.zipcode" id="zipcode" required />
        </div>
        <div class="form-group">
          <label for="city">City</label>
          <input type="text" v-model="localUnit.address.city" id="city" required />
        </div>
        <div class="form-group">
          <label for="state">State</label>
          <input type="text" v-model="localUnit.address.state" id="state" required />
        </div>
        <div class="form-group">
          <label for="picture">Picture</label>
          <input type="file" @change="handleFileUpload" id="picture" />
        </div>

        <div class="button-group">
          <CustomButton type="red" class="delete-button" v-if="localUnit.id" @click="deleteUnit(localUnit.id)">
            Delete
          </CustomButton>
          <div class="right-buttons">
            <CustomButton type="secondary" @click="cancelForm">Cancel</CustomButton>
            <CustomButton type="primary" class="save-button" @click="submitForm">Save</CustomButton>
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
        file: null
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
      },
      close() {
        this.visible = false
        this.$emit('close')
      },
      handleFileUpload(event) {
        this.file = event.target.files[0]
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
        if (this.file) {
          formData.append('picture', this.file)
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
        this.close()
      }
    }
  }
</script>

<style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    width: 100%;
    position: relative;
  }

  .close {
    position: absolute;
    top: 5px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .button-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }

  .right-buttons {
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  .right-buttons button {
    margin-left: 10px;
  }

  .delete-button {
    margin-right: 10px;
  }

  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s;
  }

  .modal-enter,
  .modal-leave-to {
    opacity: 0;
  }
</style>
