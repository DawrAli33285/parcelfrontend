import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../lib/api.js'
import useRateStore from '../../store/useRateStore.js'
import Dropdown from '../dropdown/Dropdown.jsx'
import DropdownItem from '../dropdown/DropdownItem.jsx'
import OrderStepTransition from './OrderStepTransition'

function OrderStep3() {
  const [order, setOrder] = useOutletContext()
  const [isShowRate, setIsShowRate] = useState(false)

  const [deliveryDetail, setDeliveryDetail] = useState()
  const setRateID = useRateStore(state => state.setRateID)
  const shippingSpeed = useRateStore(state => state.shippingSpeed)
  const setShippingSpeed = useRateStore(state => state.setShippingSpeed)
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState([])

  async function EasyPostRatesAPI() {
    if (loading) return
    const payload = {
      sender: {
        name: order?.sender?.name,
        company: order?.sender?.company,
        phone: order?.sender?.phone,
        street1: order?.sender?.address,
        city: order?.sender?.city,
        state: order?.sender?.state,
        zip: order?.sender?.zipCode,
        country: order?.sender?.country
      },
      receiver: {
        street1: order?.receiver?.address,
        city: order?.receiver?.city,
        state: order?.receiver?.state,
        zip: order?.receiver?.zipCode,
        country: order?.receiver?.country
      },
      details: {
        carrier: 'USPS',
        units: order?.parcel?.units,
        weight: Number(order?.parcel?.weight) || 1,
        length: Number(order?.parcel?.length) || 1,
        width: Number(order?.parcel?.width) || 1,
        height: Number(order?.parcel?.height) || 1
      }
    }

    try {
      setLoading(true)
      const { data } = await api.post(`/rates/calculate`, payload)
      console.log("DAATA")
      console.log(data)
      setDeliveryDetail(data)
      setRateID(data.rateID)
      setServices(Object.keys(data.rates))
      setShippingSpeed(Object.keys(data.rates)[0])
      toast.success('Rate created successfully')
    } catch (error) {
      console.error(error)
      return toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <OrderStepTransition>
      <h2 className='text-[22px] font-normal text-neutral-800 mb-[16px]'>
        3. Select shipping rates
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-3 md:gap-[48px]'>
        <div className='col-span-1'>
          <form className='flex flex-col gap-[15px]'>
        
            <div className='grid grid-cols-2 gap-[16px]'>
              <div>
                <label className='text-xs font-bold block mb-[8px]'>
                  Weight
                </label>
                <input
                  type='number'
                  className='px-[12px] flex justify-between items-center w-full h-[40px] bg-input-bg focus:outline-none placeholder-input-text rounded-[8px] text-xs font-normal'
                  placeholder='1'
                  min={1}
                  value={order?.parcel?.weight || 1}
                  onChange={e => {
                    const weight = e.target.value
                    setOrder(prevOrder => ({
                      ...prevOrder,
                      parcel: {
                        ...prevOrder?.parcel,
                        weight
                      }
                    }))
                  }}
                />
              </div>
              <div>
                <label className='text-xs font-bold block mb-[8px]'>
                  Units
                </label>
                <div className='relative'>
                  <Dropdown
                    placeholder={'Oz'}
                    onChange={e => {
                      const units = e
                      setOrder(prevOrder => ({
                        ...prevOrder,
                        parcel: {
                          ...prevOrder?.parcel,
                          units
                        }
                      }))
                    }}
                    value={'oz'}
                  >
                    <DropdownItem value={'oz'}>Oz</DropdownItem>
                    <DropdownItem value={'kg'}>Kg</DropdownItem>
                    <DropdownItem value={'lb'}>Lb</DropdownItem>
                    <DropdownItem value={'gr'}>Gr</DropdownItem>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-3 gap-[14px]'>
              <div>
                <label className='text-xs font-bold block mb-[8px]'>
                  Length
                </label>
                <input
                  type='number'
                  className='px-[12px] flex justify-between items-center w-full h-[40px] bg-input-bg focus:outline-none placeholder-input-text rounded-[8px] text-xs font-normal'
                  placeholder='in'
                  value={order?.parcel?.length || 1}
                  min={1}
                  onChange={e => {
                    const length = e.target.value
                    setOrder(prevOrder => ({
                      ...prevOrder,
                      parcel: {
                        ...prevOrder?.parcel,
                        length
                      }
                    }))
                  }}
                />
              </div>
              <div>
                <label className='text-xs font-bold block mb-[8px]'>
                  Width
                </label>
                <input
                  type='number'
                  className='px-[12px] flex justify-between items-center w-full h-[40px] bg-input-bg focus:outline-none placeholder-input-text rounded-[8px] text-xs font-normal'
                  placeholder='in'
                  min={1}
                  value={order?.parcel?.width || 1}
                  onChange={e => {
                    const width = e.target.value
                    setOrder(prevOrder => ({
                      ...prevOrder,
                      parcel: {
                        ...prevOrder?.parcel,
                        width
                      }
                    }))
                  }}
                />
              </div>
              <div>
                <label className='text-xs font-bold block mb-[8px]'>
                  Height
                </label>
                <input
                  type='number'
                  className='px-[12px] flex justify-between items-center w-full h-[40px] bg-input-bg focus:outline-none placeholder-input-text rounded-[8px] text-xs font-normal'
                  placeholder='in'
                  min={1}
                  value={order?.parcel?.height || 1}
                  onChange={e => {
                    const height = e.target.value
                    setOrder(prevOrder => ({
                      ...prevOrder,
                      parcel: {
                        ...prevOrder?.parcel,
                        height
                      }
                    }))
                  }}
                />
              </div>
            </div>
            <div className='flex flex-col gap-[18px]'>
              {isShowRate && (
                <>
                  <label className='text-xs font-bold block'>
                    Select Shipping Speed
                  </label>
                  {services.map(service => (
                    <label
                      key={service}
                      htmlFor='radio-ups'
                      className='col-span-5 flex gap-[12px] items-center w-full h-[40px] bg-input-bg  text-[#C3C3C3] rounded-[8px] text-xs font-normal cursor-pointer'
                      onClick={() => setShippingSpeed(service)}
                    >
                      <input
                        type='radio'
                        value={service}
                        name='shipping-speed'
                        className='hidden peer'
                      />
                      <div
                        className={classNames(
                          'h-full w-full flex px-4 justify-between items-center rounded-lg text-[16px]',
                          {
                            'border border-solid border-orange text-orange':
                              shippingSpeed === service
                          }
                        )}
                      >
                        <span>
                          {service.charAt(0).toUpperCase() + service.slice(1)}:
                        </span>
                        <span
                          className={classNames('text-[16px] font-bold', {
                            'text-orange': shippingSpeed === service
                          })}
                        >
                          ${deliveryDetail?.rates[service]}
                        </span>
                      </div>
                    </label>
                  ))}
                </>
              )}
              <button
                className='w-2/3 h-[40px] bg-orange rounded-[8px] text-[16px] font-normal text-white border border-solid border-orange hover:border-orange-hover hover:bg-orange-hover active:bg-orange active:border-orange flex items-center justify-center cursor-pointer transition-colors duration-200 ease-in-out'
                onClick={async e => {
                  e.preventDefault()
                  await EasyPostRatesAPI()
                  setIsShowRate(true)
                }}
              >
                Calculate Rates
                {loading && (
                  <svg
                    className='animate-spin h-5 w-5 ml-[5px] text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.009 8.009 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                )}
              </button>
              {/* {isShowRate && (
                <div className='col-span-2 text-center grid content-center text-[16px] text-orange border border-solid border-orange rounded-lg'>
                  <p>
                    Rate:{' '}
                    <span className='font-bold'>${deliveryDetail?.rate}</span>
                  </p>
                </div>
              )} */}
            </div>
          </form>
        </div>
        <div className='col-span-2 mt-[20px] md:mt-[-50px] p-[35px] border border-input-bg border-solid rounded-[25px]'>
          <h3 className='text-[18px] font-bold mb-[10px text-neutral-800 mb-[24px]'>
            Your Order
          </h3>
          <div className='mb-[24px]'>
            <div className='grid grid-cols-3 text-neutral-800 text-[12px] font-bold mb-[12px]'>
              <span>Information</span>
              <span>Receiver</span>
              <span>Sender</span>
            </div>
            <div className='grid grid-cols-3 text-neutral-800 text-[12px] font-bold'>
              <div className='grid grid-cols-1 grid-rows-5 text-input-text font-semibold gap-[12px]'>
                <span>Country:</span>
                <span>Address:</span>
                <span>Zip Code:</span>
                <span>City:</span>
                <span>State:</span>
              </div>
              <div className='grid grid-cols-1 grid-rows-5 text-input-text font-normal gap-[12px]'>
                <span>{order?.receiver?.country}</span>
                <span>{order?.receiver?.address}</span>
                <span>{order?.receiver?.zipCode}</span>
                <span>{order?.receiver?.city}</span>
                <span>{order?.receiver?.state}</span>
              </div>
              <div className='grid grid-cols-1 grid-rows-5 text-input-text font-normal gap-[12px]'>
                <span>{order?.sender?.country}</span>
                <span>{order?.sender?.address}</span>
                <span>{order?.sender?.zipCode}</span>
                <span>{order?.sender?.city}</span>
                <span>{order?.sender?.state}</span>
              </div>
            </div>
          </div>
          <div>
            <div className='text-neutral-800 text-[12px] font-bold mb-[12px]'>
              Package information
            </div>
            <div className='grid grid-cols-3 text-neutral-800 text-[12px] font-bold'>
              <div className='grid grid-cols-1 grid-rows-3 text-input-text font-semibold gap-[12px]'>
                <span>Carrier:</span>
                <span>Weight:</span>
                <span>LWH:</span>
              </div>
              <div className='grid grid-cols-1 grid-rows-3 text-input-text font-normal gap-[12px]'>
              
                <span>{order?.parcel?.weight || 1}</span>
                <span>
                  {order?.parcel?.length || 1} x {order?.parcel?.width || 1} x{' '}
                  {order?.parcel?.height || 1}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OrderStepTransition>
  )
}
OrderStep3.propTypes = {
  order: PropTypes.object,
  setOrder: PropTypes.func
}

export default OrderStep3
