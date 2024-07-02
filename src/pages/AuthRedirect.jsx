import { useEffect } from 'react'
import api from '../lib/api'
import { setTokenToCookie } from '../lib/utils'

export default function AuthRedirect() {
  useEffect(() => {
    if (window.location.search) {
      api.get('/google/login' + window.location.search).then(res => {
        setTokenToCookie(res.data.token)
        window.location.href = '/'
      })
    }
  }, [])
  return <>Redirecting...</>
}
