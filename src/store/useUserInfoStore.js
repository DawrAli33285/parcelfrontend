import { create } from 'zustand'

export default create(set => ({
  userInfo: null,
  setUserInfo: userInfo => set({ userInfo }),
  logout: () => set({ userInfo: null })
}))
