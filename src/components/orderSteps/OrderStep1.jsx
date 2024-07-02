import { useQuery } from '@tanstack/react-query'
import { countries } from 'countries-list'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import usePlacesAutocompleteService from 'react-google-autocomplete/lib/usePlacesAutocompleteService.js'
import { Link, useOutletContext } from 'react-router-dom'
import api from '../../lib/api.js'
import Dropdown from '../dropdown/Dropdown.jsx'
import DropdownItem from '../dropdown/DropdownItem.jsx'
import OrderStepTransition from './OrderStepTransition'

function OrderStep1() {
  // NOTE: This is a list of all countries, but we only need the US for now
  // const countryShortNames = Object.keys(countries)
  const countryShortNames = ['US']
  const [selectedAddress, setSelectedAddress] = useState('')
  const { isLoading, data: addressList } = useQuery({
    queryKey: ['addressList'],
    queryFn: async () => {
      const { data } = await api.get(`info/addressList?limit=1000`)
      return data
    }
  })
  const [order, setOrder] = useOutletContext()

  const updateValues = address => {
    setOrder(prevOrder => ({
      ...prevOrder,
      receiver: {
        ...prevOrder?.receiver,
        address: address.address,
        country: address.country,
        zipCode: address.zip,
        city: address.city,
        state: address.state
      }
    }))
  }

  const containerRef = useRef()
  const [predictions, setPredictions] = useState([])
  const {
    placePredictions,
    getPlacePredictions,
    placesService,
    isPlacePredictionsLoading
  } = usePlacesAutocompleteService({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    options: {
      componentRestrictions: { country: 'us' }
    }
  })

  useEffect(() => {
    if (!placePredictions) return
    if (placePredictions.length === 0) return
    setPredictions(placePredictions)
  }, [placePredictions])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && containerRef.current.contains(event.target))
        return
      setPredictions([])
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [getPlacePredictions])

  return (
    <OrderStepTransition>
      <h2 className='text-[22px] font-normal text-neutral-800 mb-[16px]'>
        1. Receiver Shipping details
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 md:gap-[70px]'>
        <div className='col-span-1'>
          <form className='flex flex-col gap-[15px]'>
            <div>
              <div className='flex justify-between items-center mb-[8px]'>
                <label className='text-xs font-bold block'>Address Book</label>
                <Link
                  to='/dashboard/address-book'
                  className='text-orange text-xs font-normal hover:underline'
                >
                  Add
                </Link>
              </div>
              <div className='relative'>
                <Dropdown
                  placeholder={selectedAddress.address || 'Address'}
                  value={selectedAddress || ''}
                  onChange={e => {
                    setSelectedAddress(e)
                    updateValues(e)
                  }}
                >
                  {!isLoading &&
                    addressList &&
                    addressList?.docs &&
                    addressList?.docs?.map(address => (
                      <DropdownItem key={address._id} value={address}>
                        {address.address}
                      </DropdownItem>
                    ))}
                </Dropdown>
              </div>
            </div>
            <div>
              <label className='text-xs font-bold block mb-[8px]'>
                Country
              </label>
              <div className='relative'>
                <Dropdown
                  placeholder={
                    countries[order?.receiver?.country]?.name ||
                    'Receiver Country'
                  }
                  value={order?.receiver?.country || ''}
                  onChange={e =>
                    setOrder(prevOrder => ({
                      ...prevOrder,
                      receiver: {
                        ...prevOrder?.receiver,
                        country: e
                      }
                    }))
                  }
                >
                  {countryShortNames.map(country => (
                    <DropdownItem key={country} value={country}>
                      {countries[country].name}
                    </DropdownItem>
                  ))}
                </Dropdown>
              </div>
            </div>
            <div>
              <label className='text-xs font-bold block mb-[8px]'>
                Address
              </label>
              <input
                className='px-[12px] flex justify-between items-center w-full h-[40px] bg-input-bg focus:outline-none placeholder-input-text rounded-[8px] text-xs font-normal'
                placeholder='Receiver Address'
                value={order?.receiver?.address || ''}
                onChange={e => {
                  setOrder(prevOrder => ({
                    ...prevOrder,
                    receiver: {
                      ...prevOrder?.receiver,
                      address: e.target.value
                    }
                  }))
                  getPlacePredictions({ input: e.target.value })
                }}
              />
              {/* container to show list of options */}
              <div ref={containerRef} className='relative'>
                {!isPlacePredictionsLoading && predictions.length > 0 && (
                  <div
                    className='absolute z-50 right-0 w-full overflow-y-scroll no-scrollbar py-2.5 rounded-lg bg-input-bg transition-all duration-300 ease-in max-h-60
          border border-solid border-input-border shadow-input-shadow
          border-[#dcdcdc]'
                  >
                    {predictions?.map(prediction => (
                      <div
                        key={prediction.place_id}
                        className='p-2 border border-solid border-gray-200 hover:bg-orange hover:text-white cursor-pointer'
                        onClick={() => {
                          // hide the list of placePredictions
                          setPredictions([])
                          // set the address value
                          setOrder(prevOrder => ({
                            ...prevOrder,
                            receiver: {
                              ...prevOrder?.receiver,
                              address: prediction.description
                            }
                          }))
                          // get the details of the place
                          placesService.getDetails(
                            {
                              placeId: prediction.place_id,
                              fields: ['address_components']
                            },
                            (place, status) => {
                              if (status === 'OK') {
                                const city = place?.address_components.find(
                                  component =>
                                    component.types.includes('locality')
                                )?.long_name
                                const state = place?.address_components.find(
                                  component =>
                                    component.types.includes(
                                      'administrative_area_level_1'
                                    )
                                )?.long_name
                                const zipCode = place?.address_components.find(
                                  component =>
                                    component.types.includes('postal_code')
                                )?.long_name
                                const newValues = {}
                                if (city) newValues.city = city
                                if (state) newValues.state = state
                                if (zipCode) newValues.zipCode = zipCode
                                setOrder(prevOrder => ({
                                  ...prevOrder,
                                  receiver: {
                                    ...prevOrder?.receiver,
                                    ...newValues
                                  }
                                }))
                              }
                            }
                          )
                        }}
                      >
                        {prediction.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className='text-xs font-bold block mb-[8px]'>
                Zip Code
              </label>
              <input
                className='px-[12px] flex justify-between items-center w-full h-[40px] bg-input-bg focus:outline-none placeholder-input-text rounded-[8px] text-xs font-normal'
                placeholder='Receiver Zip Code'
                value={order?.receiver?.zipCode || ''}
                onChange={e =>
                  setOrder(prevOrder => ({
                    ...prevOrder,
                    receiver: {
                      ...prevOrder?.receiver,
                      zipCode: e.target.value
                    }
                  }))
                }
              />
            </div>
            <div>
              <label className='text-xs font-bold block mb-[8px]'>City</label>
              <input
                className='px-[12px] flex justify-between items-center w-full h-[40px] bg-input-bg focus:outline-none placeholder-input-text rounded-[8px] text-xs font-normal'
                placeholder='Receiver City'
                value={order?.receiver?.city || ''}
                onChange={e =>
                  setOrder(prevOrder => ({
                    ...prevOrder,
                    receiver: {
                      ...prevOrder?.receiver,
                      city: e.target.value
                    }
                  }))
                }
              />
            </div>
            <div>
              <label className='text-xs font-bold block mb-[8px]'>State</label>
              <input
                className='px-[12px] flex justify-between items-center w-full h-[40px] bg-input-bg focus:outline-none placeholder-input-text rounded-[8px] text-xs font-normal'
                placeholder='Receiver State'
                value={order?.receiver?.state || ''}
                onChange={e =>
                  setOrder(prevOrder => ({
                    ...prevOrder,
                    receiver: {
                      ...prevOrder?.receiver,
                      state: e.target.value
                    }
                  }))
                }
              />
            </div>
          </form>
        </div>
        <div className='col-span-1 pt-[20px]  pr-[40px]'>
          <h3 className='text-xs font-bold mb-[10px] text-neutral-800'>
            Important information
          </h3>
          <p className='text-xs spacing leading-relaxed tracking-normal text-nav-grey-text'>
            Lorem ipsum dolor sit amet consectetur. Mi congue facilisi
            consectetur aliquam condimentum scelerisque. Vitae facilisi a morbi
            velit tincidunt elit id augue ut. Faucibus nisi dapibus posuere in
            viverra consectetur aliquet pellentesque. Rutrum at et suspendisse
            enim sed feugiat eu posuere quis. Vitae amet neque auctor rhoncus
            facilisi praesent nec posuere. A lacus cursus non vitae ipsum ornare
            enim. Suscipit feugiat pulvinar.
          </p>
        </div>
      </div>
    </OrderStepTransition>
  )
}
OrderStep1.propTypes = {
  order: PropTypes.object,
  setOrder: PropTypes.func
}

export default OrderStep1
