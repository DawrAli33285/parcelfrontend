import PropTypes from 'prop-types'
import { useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../lib/api'
import useRateStore from '../../store/useRateStore'
import OrderStepTransition from './OrderStepTransition'

function OrderStep4() {
  const [loading, setLoading] = useState(false)
  const rateID = useRateStore(state => state.rateID)
  const shippingSpeed = useRateStore(state => state.shippingSpeed)

  async function handlePayment(gateway) {
    if (loading) return
    if (!rateID) return toast.error('Rate ID not found!')

    try {
      setLoading(true)
      const { data } = await api.post(`/checkout/${gateway}`, {
        rateID,
        shippingSpeed
      })
      localStorage.removeItem('order')
      toast.success('Invoice created successfully! redirecting...')
      window.location.href = data.redirectURL
    } catch (error) {
      console.error(error)
      toast.error('Payment failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OrderStepTransition>
      <h2 className='text-[22px] font-normal text-neutral-800 mb-[16px]'>
        4. Make the payment
      </h2>
      <div className='flex flex-col gap-4 pb-16'>
        {/* add cryptomus black background themed button */}
        <button
          onClick={() => handlePayment('cryptomus')}
          className='bg-[#1E1E1E] text-white px-4 py-2 rounded-md hover:bg-[#3C3C3C] transition-colors duration-200'
        >
          Pay with Cryptomus
        </button>

        <button
          onClick={() => handlePayment('stripe')}
          className='bg-[#6772E5] text-white px-4 py-2 rounded-md hover:bg-[#8296FF] transition-colors duration-200'
        >
          Pay with Stripe
        </button>
      </div>
    </OrderStepTransition>
  )
}
OrderStep4.propTypes = {
  order: PropTypes.object,
  setOrder: PropTypes.func
}

export default OrderStep4
