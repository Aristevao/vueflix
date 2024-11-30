<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card p-4 shadow" style="width: 100%; max-width: 500px;">
      <!-- Ícone e Texto de Marketing -->
      <div class="marketing-section text-center mb-4">
        <img src="@\assets\logo.png" alt="Logo" class="icon" />
        <p class="marketing-text">Conecte-se com facilidade e aproveite todos os benefícios do nosso sistema!</p>
      </div>

      <h2 v-if="!isCreatingAccount" class="text-center">Login</h2>
      <h3 v-if="isCreatingAccount" class="text-center">Criar Conta</h3>

      <!-- Login Form -->
      <form v-if="!isCreatingAccount" @submit.prevent="login">
        <div class="form-group mb-3">
          <label for="email">E-mail:</label>
          <input type="email" id="email" v-model="email" required class="form-control" />
        </div>

        <div class="form-group mb-3">
          <label for="password">Senha:</label>
          <input type="password" id="password" v-model="password" required class="form-control" />
        </div>

        <button type="submit" class="btn btn-success w-100 mb-3">Login</button>
      </form>

      <!-- Create Account Form -->
      <form v-if="isCreatingAccount" @submit.prevent="createAccount">
        <div class="form-group mb-3">
          <label for="name">Nome</label>
          <input type="text" id="name" v-model="newUser.name" required maxlength="80" class="form-control" />
          <small v-if="validationErrors.name" class="text-danger">{{ validationErrors.name }}</small>
        </div>

        <div class="form-group mb-3">
          <label for="newEmail">E-mail</label>
          <input type="email" id="newEmail" v-model="newUser.email" required maxlength="320" class="form-control" />
          <small v-if="validationErrors.email" class="text-danger">{{ validationErrors.email }}</small>
        </div>

        <div class="form-group mb-3">
          <label for="phone">Telefone</label>
          <input type="tel" id="phone" v-model="formattedPhone" @input="applyPhoneMask" maxlength="16"
            class="form-control" />
          <small v-if="validationErrors.phone" class="text-danger">{{ validationErrors.phone }}</small>
        </div>

        <div class="form-group mb-3">
          <label for="birthdate">Data de nascimento</label>
          <input type="date" id="birthdate" v-model="newUser.birthdate" :max="today" class="form-control" />
        </div>

        <div class="form-group mb-3">
          <label for="newPassword">Senha</label>
          <input type="password" id="newPassword" v-model="newUser.password" required class="form-control" />
        </div>

        <div class="form-group mb-3">
          <label>Escolha uma foto predefinida</label>
          <div class="d-flex justify-content-around">
            <div v-for="(image, index) in presetImages" :key="index" class="text-center">
              <input type="radio" :id="'preset-' + index" :value="image.base64" v-model="newUser.picture" />
              <label :for="'preset-' + index">
                <img :src="image.src" :alt="image.label" class="rounded-circle img-thumbnail" width="64" height="64" />
              </label>
            </div>
          </div>
        </div>

        <div class="form-group mb-3">
          <label for="upload-picture">Ou escolha uma foto própria</label>
          <input type="file" id="upload-picture" @change="handleFileUpload" accept="image/*" class="form-control" />
        </div>

        <div class="mb-3 text-center" v-if="newUser.picture">
          <img :src="'data:image/png;base64,' + newUser.picture" alt="Selected Profile Picture"
            class="rounded-circle img-thumbnail" width="64" height="64" />
        </div>

        <div class="form-check mb-3">
          <input type="checkbox" id="acceptedPrivacyPolicy" v-model="newUser.acceptedPrivacyPolicy"
            class="form-check-input" />
          <label for="acceptedPrivacyPolicy" class="form-check-label">
            Li e concordo com a
            <a href="https://drive.google.com/file/d/10l5TX2mPbcODZOpJKUoYDwSiVrbj3hQa/view?usp=drive_link"
              target="_blank">política de privacidade</a>
          </label>
          <small v-if="validationErrors.acceptedPrivacyPolicy" class="text-danger d-block">{{
            validationErrors.acceptedPrivacyPolicy }}</small>
        </div>

        <button type="submit" class="btn btn-success w-100 mb-3">Criar Conta</button>
      </form>

      <!-- Actions -->
      <div class="d-flex justify-content-between">
        <button @click="recoverPassword" v-if="!isCreatingAccount" class="btn btn-link">Recuperar Senha</button>
        <button @click="toggleForm" class="btn btn-link">{{ isCreatingAccount ? 'Voltar ao Login' : 'Criar Conta'
          }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { inject, ref } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import { jwtDecode } from 'jwt-decode'
  import avatar1 from '@/assets/avatar-1.png'
  import avatar2 from '@/assets/avatar-2.png'
  import avatar3 from '@/assets/avatar-3.png'
  import avatar4 from '@/assets/avatar-4.png'
  import avatar5 from '@/assets/avatar-5.png'
  import avatar6 from '@/assets/avatar-6.png'

  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })

  const router = useRouter()
  const username = inject('username')

  const isCreatingAccount = ref(false)
  const email = ref('')
  const password = ref('')
  const newUser = ref({
    name: '',
    email: '',
    phone: '',
    birthdate: '1990-01-01',
    picture: '',
    password: '',
    acceptedPrivacyPolicy: true
  })
  const formattedPhone = ref('')
  const validationErrors = ref({})
  const imagePreview = ref('')

  const presetImages = [
    { label: 'Default User 1', src: avatar1, base64: '' },
    { label: 'Default User 2', src: avatar2, base64: '' },
    { label: 'Default User 3', src: avatar3, base64: '' },
    { label: 'Default User 4', src: avatar4, base64: '' },
    { label: 'Default User 5', src: avatar5, base64: '' },
    { label: 'Default User 6', src: avatar6, base64: '' }
  ]

  presetImages.forEach((image) => {
    fetch(image.src)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          image.base64 = reader.result.split(',')[1]
        }
        reader.readAsDataURL(blob)
      })
  })

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/digital-pec/authenticate', {
        username: email.value,
        password: password.value
      })

      const token = response.headers['authorization']
      if (token) {
        localStorage.setItem('authToken', token)

        const decoded = jwtDecode(token)
        localStorage.setItem('name', decoded.name)

        username.value = decoded.name

        router.push({ name: 'Home' })
      } else {
        console.error('Authorization token not found in headers')
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const createAccount = async () => {
    if (validateCreateAccountForm()) {
      try {
        newUser.value.phone = unformatPhone(formattedPhone.value)
        await axios.post('http://localhost:8080/api/digital-pec/user', newUser.value)
        alert('Conta criada com sucesso!')
        toggleForm()
      } catch (error) {
        console.error('Falha na criação da conta:', error)
      }
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        imagePreview.value = reader.result
        newUser.value.picture = reader.result.split(',')[1]
      }
      reader.readAsDataURL(file)
    }
  }

  const validateCreateAccountForm = () => {
    validationErrors.value = {}

    if (!newUser.value.name || newUser.value.name.length > 80) {
      validationErrors.value.name = 'O nome é obrigatório e deve ter no máximo 80 caracteres.'
    }
    if (
      !newUser.value.email ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newUser.value.email) ||
      newUser.value.email.length > 320
    ) {
      validationErrors.value.email = 'O e-mail é obrigatório e deve ter no máximo 320 caracteres.'
    }
    if (newUser.value.phone && newUser.value.phone.length > 12) {
      validationErrors.value.phone = 'Telefone deve ter no máximo 12 dígitos.'
    }
    if (!newUser.value.acceptedPrivacyPolicy) {
      validationErrors.value.acceptedPrivacyPolicy = ' É necessário aceitar a política de privacidade.'
    }

    return Object.keys(validationErrors.value).length === 0
  }

  const applyPhoneMask = () => {
    let rawPhone = unformatPhone(formattedPhone.value)
    if (rawPhone.length > 12) {
      rawPhone = rawPhone.slice(0, 12)
    }
    formattedPhone.value = formatPhone(rawPhone)
  }

  const formatPhone = (phone) => {
    if (!phone) return ''
    if (phone.length <= 2) return `(${phone}`
    if (phone.length <= 7) return `(${phone.slice(0, 2)}) ${phone.slice(2)}`
    if (phone.length === 11)
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 3)} ${phone.slice(3, 7)}-${phone.slice(7, 11)}`
    if (phone.length === 12)
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 3)} ${phone.slice(3, 8)}-${phone.slice(8, 12)}`
    return phone
  }

  const unformatPhone = (phone) => {
    return phone.replace(/\D/g, '')
  }

  const toggleForm = () => {
    isCreatingAccount.value = !isCreatingAccount.value
  }

  const recoverPassword = () => {
    alert('Para recuperar sua senha, entre em contato com o administrador do sistema.')
  }
</script>

<style scoped>
  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card {
    width: 100%;
    max-width: 500px;
    border-radius: 10px;
  }

  .marketing-section {
    text-align: center;
    margin-bottom: 10px;
  }

  .icon {
    width: 130px;
    height: 130px;
    margin-bottom: 10px;
  }

  .marketing-text {
    font-size: 18px;
    color: #070707;
    font-weight: bold;
    margin-bottom: 0;
  }

  h2,
  h3 {
    color: #333;
  }

  .form-control {
    margin-bottom: 15px;
  }

  .btn {
    font-size: 16px;
    padding: 12px 0;
  }

  .btn-link {
    text-decoration: none;
  }

  .btn-primary {
    background-color: #007bff;
    border: none;
  }

  .btn-success {
    background-color: #28a745;
    border: none;
  }

  .form-check-label {
    font-size: 14px;
  }

  .form-check-input {
    margin-top: 0.3rem;
  }
</style>
