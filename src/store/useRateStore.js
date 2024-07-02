import { create } from 'zustand'

export default create(set => ({
  rateID: '',
  setRateID: id => set({ rateID: id }),
  shippingSpeed: '',
  setShippingSpeed: speed => set({ shippingSpeed: speed })
}))
