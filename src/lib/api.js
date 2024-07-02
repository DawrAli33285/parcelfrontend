import axios from 'axios'
import { getTokenFromCookie } from './utils'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || '/api/v1'
})

api.interceptors.request.use(
  config => {
    const token = getTokenFromCookie()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

if (import.meta.env?.VERCEL !== 1) {
  api.interceptors.request.use(config => {
    console.log('Request:')
    console.log(config.url, config.data)
    return config
  })

  api.interceptors.response.use(config => {
    console.log('Response:')
    console.log(config.url, config.data)
    return config
  })
}

export default api
