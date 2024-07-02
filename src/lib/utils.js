import Cookies from 'js-cookie'
import useUserInfoStore from '../store/useUserInfoStore'
import api from './api'
import { COOKIE_NAME, GOOGLE_LOGIN_URL } from './config'

export function getTokenFromCookie() {
  return Cookies.get(COOKIE_NAME)
}

export function setTokenToCookie(token) {
  Cookies.set(COOKIE_NAME, token, { expires: 7 })
}

export function handleGoogleLogin() {
  window.location.href = GOOGLE_LOGIN_URL
}

export async function initUserSession() {
  const res = await api.get('/info/me')
  const setUserInfo = useUserInfoStore.getState().setUserInfo
  setUserInfo(res.data)
  return res?.data || null
}

export function logoutUser() {
  Cookies.remove(COOKIE_NAME)
  useUserInfoStore.getState().logout()
}

export function formatDate(date) {
  const d = new Date(date)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatUTCTime(data) {
  const date = new Date(data)
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  return `${hours}:${minutes} UTC`
}
