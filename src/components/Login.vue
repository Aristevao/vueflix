<template>
  <div class="login-container">
    <h2 v-if="!isCreatingAccount">Login</h2>
    <h3 v-if="isCreatingAccount">Create Account</h3>

    <!-- Login Form -->
    <form v-if="!isCreatingAccount" @submit.prevent="login">
      <div class="form-group">
        <label for="email">E-mail:</label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <button type="submit">Login</button>
    </form>

    <!-- Create Account Form -->
    <form v-if="isCreatingAccount" @submit.prevent="createAccount">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="newUser.name" required maxlength="80" />
        <small v-if="validationErrors.name">{{ validationErrors.name }}</small>
      </div>

      <div class="form-group">
        <label for="newEmail">E-mail:</label>
        <input type="email" id="newEmail" v-model="newUser.email" required maxlength="320" />
        <small v-if="validationErrors.email">{{ validationErrors.email }}</small>
      </div>

      <div class="form-group">
        <label for="phone">Phone:</label>
        <input type="tel" id="phone" v-model="formattedPhone" @input="applyPhoneMask" maxlength="16" />
        <small v-if="validationErrors.phone">{{ validationErrors.phone }}</small>
      </div>

      <div class="form-group">
        <label for="birthdate">Birthdate:</label>
        <input type="date" id="birthdate" v-model="newUser.birthdate" :max="today" />
      </div>

      <div class="form-group">
        <label for="newPassword">Password:</label>
        <input type="password" id="newPassword" v-model="newUser.password" required />
      </div>

      <div class="form-group">
        <label>Choose a Preset Profile Picture:</label>
        <div class="preset-images">
          <div v-for="(image, index) in presetImages" :key="index" class="preset-image-container">
            <input type="radio" :id="'preset-' + index" :value="image.base64" v-model="newUser.picture" />
            <label :for="'preset-' + index">
              <img :src="image.src" :alt="image.label" class="preset-image" />
            </label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="upload-picture">Or Upload Your Own Profile Picture:</label>
        <input type="file" id="upload-picture" @change="handleFileUpload" accept="image/*" />
      </div>

      <div class="preview" v-if="newUser.picture">
        <img :src="'data:image/png;base64,' + newUser.picture" alt="Selected Profile Picture"
          class="profile-picture-preview" />
      </div>

      <button type="submit">Create Account</button>
    </form>

    <!-- Actions -->
    <div class="actions">
      <button @click="recoverPassword" v-if="!isCreatingAccount">Recover Password</button>
      <button @click="toggleForm">
        {{ isCreatingAccount ? 'Back to Login' : 'Create an Account' }}
      </button>
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

  // Reactive states
  const isCreatingAccount = ref(false)
  const email = ref('')
  const password = ref('')
  const newUser = ref({
    name: '',
    email: '',
    phone: '',
    birthdate: '1990-01-01',
    picture: '',
    password: ''
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
        alert('Account created successfully!')
        toggleForm()
      } catch (error) {
        console.error('Account creation failed:', error)
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
      validationErrors.value.name = 'Name is required and must be at most 80 characters.'
    }
    if (
      !newUser.value.email ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newUser.value.email) ||
      newUser.value.email.length > 320
    ) {
      validationErrors.value.email = 'Valid email is required and must be at most 320 characters.'
    }
    if (newUser.value.phone && newUser.value.phone.length > 12) {
      validationErrors.value.phone = 'Phone number must be at most 12 digits.'
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
    alert('Recover Password clicked')
  }
</script>

<style scoped>
  .login-container {
    width: 300px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .actions {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
  }

  button {
    padding: 8px 12px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    border-radius: 4px;
  }

  button:hover {
    background-color: #0056b3;
  }

  small {
    color: red;
  }

  .preset-images {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* Three columns per row */
    gap: 10px;
    /* Space between images */
    margin-bottom: 15px;
  }

  .preset-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .preset-image {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid #ddd;
    margin-top: 5px;
  }

  .profile-picture-preview {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ddd;
  }
</style>
