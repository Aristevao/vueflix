import axios from 'axios'

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/digital-pec', // Your API base URL
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers['Authorization'] = token // Attach the token to the Authorization header
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default apiClient
