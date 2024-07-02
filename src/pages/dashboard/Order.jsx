import { AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import DashboardTransition from '../../components/DashboardTransition'
import DashboardWrapper from '../../components/DashboardWrapper'
import RecentOrders from '../../components/RecentOrders.jsx'
import useRateStore from '../../store/useRateStore.js'

function Order({ title }) {
  const step = Number(window.location.pathname.split('-').pop())
  const navigate = useNavigate()
  const rateID = useRateStore(state => state.rateID)

  // store order in local storage
  const [order, setOrder] = useState(
    JSON.parse(localStorage.getItem('order')) || {}
  )

  useEffect(() => {
    localStorage.setItem('order', JSON.stringify(order))
  }, [order])

  const paginate = newDirection => {
    if (newDirection === 1) {
      if (step === 1) {
        if (!order?.receiver?.address) {
          return toast.error('Please select a receiver address')
        }
        if (!order.receiver?.country) {
          return toast.error('Please select receiver country')
        }
        if (!order.receiver?.zipCode) {
          return toast.error('Please enter receiver zip code')
        }
        if (!order.receiver?.city) {
          return toast.error('Please enter receiver city')
        }
        if (!order.receiver?.state) {
          return toast.error('Please enter receiver state')
        }
      } else if (step === 2) {
        if (!order.sender?.address) {
          return toast.error('Please select a sender address')
        }
        if (
          order.sender?.address &&
          order.sender?.address === order.receiver?.address
        ) {
          return toast.error('Sender and receiver address cannot be the same')
        }
        if (!order.sender?.name) {
          return toast.error('Please enter sender name')
        }
        if (!order.sender?.country) {
          return toast.error('Please select sender country')
        }
        if (!order.sender?.zipCode) {
          return toast.error('Please enter sender zip code')
        }
        if (!order.sender?.city) {
          return toast.error('Please enter sender city')
        }
        if (!order.sender?.state) {
          return toast.error('Please enter sender state')
        }
      }
    }

    if (step + newDirection >= 4 && !rateID && newDirection === 1) {
      return toast.error('Please generate rate before proceeding')
    }

    if (step + newDirection >= 0 && step + newDirection <= 5) {
      navigate(`/dashboard/order/step-${step + newDirection}`)
    }
  }

  return (
    <DashboardWrapper title={title}>
      <DashboardTransition>
        <div className='lg:absolute lg:inset-0 lg:overflow-y-auto no-scrollbar'>
          <div className='w-full bg-white rounded-lg pt-[15px] pb-[20px] px-[34px] flex flex-col justify-between h-[105%] md:h-auto mb-[12px]'>
            {/* Transition HERE */}
            <AnimatePresence initial={false} mode='wait'>
              {/* {currentStep} */}
              <Outlet context={[order, setOrder]} />
            </AnimatePresence>
            <div className='flex items-center gap-[30px] flex-col mt-8 mb-5'>
              {step <= 3 && (
                <div className='flex flex-col md:flex-row justify-center gap-[18px]'>
                  {step > 1 && (
                    <button
                      className='bg-white border border-solid px-[14px] border-grey-border h-[40px] w-[154px] rounded-lg text-grey-text flex items-center hover:bg-grey-hover active:bg-white'
                      onClick={() => paginate(-1)}
                    >
                      {/* <!-- arrow to left --> */}
                      <svg
                        className='w-[12px]'
                        xmlns='http://www.w3.org/2000/svg'
                        width='11'
                        height='8'
                        viewBox='0 0 11 8'
                        fill='none'
                      >
                        <path
                          d='M10.0205 4.62967C10.2967 4.62967 10.5205 4.40581 10.5205 4.12967C10.5205 3.85353 10.2967 3.62967 10.0205 3.62967L10.0205 4.62967ZM0.943468 3.77612C0.748206 3.97138 0.748206 4.28796 0.943468 4.48322L4.12545 7.6652C4.32071 7.86046 4.63729 7.86046 4.83256 7.6652C5.02782 7.46994 5.02782 7.15336 4.83256 6.9581L2.00413 4.12967L4.83256 1.30124C5.02782 1.10598 5.02782 0.789397 4.83256 0.594135C4.63729 0.398873 4.32071 0.398873 4.12545 0.594135L0.943468 3.77612ZM10.0205 3.62967L1.29702 3.62967L1.29702 4.62967L10.0205 4.62967L10.0205 3.62967Z'
                          fill='currentColor'
                        />
                      </svg>
                      <span className='flex-grow text-center'>
                        Previous Step
                      </span>
                    </button>
                  )}
                  <button
                    className='bg-orange border border-solid px-[14px] border-orange h-[40px] w-[154px] rounded-lg text-white flex items-center hover:bg-orange-hover hover:border-orange-hover active:bg-orange active:border-orange'
                    onClick={() => paginate(1)}
                  >
                    <span className='flex-grow text-center'>Next Step</span>
                    {/* <!-- arrow to right --> */}
                    <svg
                      className='w-[9px]'
                      xmlns='http://www.w3.org/2000/svg'
                      width='10'
                      height='8'
                      viewBox='0 0 10 8'
                      fill='none'
                    >
                      <path
                        d='M0.616211 3.62967C0.340069 3.62967 0.116211 3.85353 0.116211 4.12967C0.116211 4.40581 0.340069 4.62967 0.616211 4.62967V3.62967ZM9.69325 4.48322C9.88851 4.28796 9.88851 3.97138 9.69325 3.77612L6.51127 0.594135C6.31601 0.398873 5.99942 0.398873 5.80416 0.594135C5.6089 0.789397 5.6089 1.10598 5.80416 1.30124L8.63259 4.12967L5.80416 6.9581C5.6089 7.15336 5.6089 7.46994 5.80416 7.6652C5.99942 7.86047 6.31601 7.86047 6.51127 7.6652L9.69325 4.48322ZM0.616211 4.62967H9.3397V3.62967H0.616211V4.62967Z'
                        fill='currentColor'
                      />
                    </svg>
                  </button>
                </div>
              )}

              <div className='flex items-center w-full relative mx-auto max-w-[620px]'>
                <div
                  className='h-[12px] w-[12px] bg-orange rounded-full z-50 absolute transition-all duration-1000'
                  style={{
                    left: `${25 * (step - 1)}%`,
                    transform: `translateX(-${3 * (step - 1)}px)`
                  }}
                ></div>
                <div className='h-[12px] w-[12px] bg-grey-border rounded-full'></div>
                <div className='flex-1 h-px bg-grey-border'></div>

                <div className='h-[12px] w-[12px] bg-grey-border rounded-full'></div>

                <div className='flex-1 h-px bg-grey-border'></div>

                <div className='h-[12px] w-[12px] bg-grey-border rounded-full'></div>

                <div className='flex-1 h-px bg-grey-border'></div>

                <div className='h-[12px] w-[12px] bg-grey-border rounded-full'></div>

                <div className='flex-1 h-px bg-grey-border'></div>

                <div className='h-[12px] w-[12px] bg-grey-border rounded-full'></div>
              </div>
            </div>
          </div>
          <RecentOrders />
        </div>
      </DashboardTransition>
    </DashboardWrapper>
  )
}

Order.propTypes = {
  title: PropTypes.string
}

export default Order
