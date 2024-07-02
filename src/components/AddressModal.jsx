import { zodResolver } from '@hookform/resolvers/zod'
import classNames from 'classnames'
import { countries } from 'countries-list'
import { useCallback } from 'react'
// import ReactGoogleAutocomplete from 'react-google-autocomplete'
import { useEffect, useRef, useState } from 'react'
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import Modal from '../layouts/Modal'
import api from '../lib/api.js'
import Dropdown from './dropdown/Dropdown.jsx'
import DropdownItem from './dropdown/DropdownItem.jsx'

function AddressModal({ closeModal, isOpen, onSuccess }) {
  // const countryShortNames = Object.keys(countries)
  // NOTE: This is a list of all countries, but we only need the US for now
  // const countryShortNames = Object.keys(countries)
  const countryShortNames = ['US']
  const {
    register,
    setValue,
    clearErrors,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      country: ''
    },
    resolver: zodResolver(
      z.object({
        country: z
          .string()
          .refine(
            value => countryShortNames.includes(value),
            'Invalid Country'
          ),
        city: z.string().min(1),
        state: z.string().min(1),
        zip: z.string().min(1),
        address: z.string().min(1)
      })
    )
  })

  const [predictions, setPredictions] = useState([])
  const {
    placePredictions,
    getPlacePredictions,
    placesService,
    isPlacePredictionsLoading
  } = usePlacesService({
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

  const { zipCodeRef, ...zipCode } = register('zip', { required: true })
  const { addressRef, ...address } = register('address', {
    required: true,
    onChange: e => {
      getPlacePredictions({ input: e.target.value })
    }
  })
  const { cityRef, ...city } = register('city', { required: true })
  const { stateRef, ...state } = register('state', { required: true })

  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && containerRef.current.contains(event.target))
        return
      setPredictions([])
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [getPlacePredictions])

  const onSubmit = async data => {
    try {
      await api.post('/address/create', data)
      toast.success('Address added successfully')
      reset()
      closeModal()
      await onSuccess()
    } catch (error) {
      console.error(error)

      if (
        (error.response.status === 400 || error.response.status === 401) &&
        error.response.data?.message
      ) {
        return toast.error(error.response.data.message)
      }
      return toast.error('An error occurred')
    }
  }

  const handleCountryChange = useCallback(
    value => {
      setValue('country', value)
      clearErrors('country')
    },
    [clearErrors, setValue]
  )

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className='bg-white px-[45px] pt-[43px] pb-[41px] rounded-[32px] w-[515px] relative'>
        <button
          onClick={closeModal}
          className='flex bg-input-bg justify-center items-center rounded-full w-[25px] h-[25px] absolute right-[32px] top-[30px]'
        >
          <svg
            width='10'
            height='9'
            viewBox='0 0 10 9'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M1.30762 1.04718L8.06738 7.80727'
              stroke='#202020'
              strokeWidth='2'
              strokeLinecap='round'
            />
            <path
              d='M1.30762 7.80719L8.0677 1.04742'
              stroke='#202020'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
        </button>
        <h1 className='text-[22px] font-normal mb-[26px]'>
          Add address to address book
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-[14px]'
        >
          <div>
            <label className='text-xs font-bold block mb-[8px]'>Country</label>
            <Dropdown
              invalid={errors.country}
              onChange={handleCountryChange}
              value='US'
              placeholder={countries['US'].name}
            >
              {countryShortNames.map(country => (
                <DropdownItem key={country} value={country}>
                  {countries[country].name}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
          <div>
            <label className='text-xs font-bold block mb-[8px]'>Address</label>
            <input
              ref={addressRef}
              {...address}
              className={classNames(
                'px-[12px] flex justify-between items-center w-full h-[40px] bg-input-bg focus:outline-none placeholder-input-text rounded-[8px] text-xs font-normal',
                {
                  'border border-solid border-red-500': errors.address
                }
              )}
              placeholder='Receiver Address'
              name={'address'}
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
                        setValue('address', prediction.description)
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
                              if (city) setValue('city', city)
                              if (state) setValue('state', state)
                              if (zipCode) setValue('zip', zipCode)
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
            <label className='text-xs font-bold block mb-[8px]'>Zip Code</label>
            <input
              className={classNames(
                'px-[12px] flex justify-between items-center w-full h-[40px] bg-input-bg focus:outline-none placeholder-input-text rounded-[8px] text-xs font-normal',
                {
                  'border border-solid border-red-500': errors.zip
                }
              )}
              placeholder='Receiver Zip Code'
              name={'zip'}
              ref={zipCodeRef}
              {...zipCode}
            />
          </div>
          <div>
            <label className='text-xs font-bold block mb-[8px]'>City</label>
            <input
              className={classNames(
                'px-[12px] flex justify-between items-center w-full h-[40px] bg-input-bg focus:outline-none placeholder-input-text rounded-[8px] text-xs font-normal',
                {
                  'border border-solid border-red-500': errors.city
                }
              )}
              placeholder='Receiver City'
              ref={cityRef}
              {...city}
            />
          </div>
          <div>
            <label className='text-xs font-bold block mb-[8px]'>State</label>
            <input
              className={classNames(
                'px-[12px] flex justify-between items-center w-full h-[40px] bg-input-bg focus:outline-none placeholder-input-text rounded-[8px] text-xs font-normal',
                {
                  'border border-solid border-red-500': errors.state
                }
              )}
              placeholder='Receiver State'
              name={'state'}
              ref={stateRef}
              {...state}
            />
          </div>
          <button className='mt-[24px] self-start border border-solid px-[14px] bg-orange border-orange h-[40px] w-[155px] rounded-lg text-white text-[16px] flex items-center justify-center hover:bg-orange-hover hover:border-orange-hover active:bg-orange active:border-orange'>
            Save address
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default AddressModal
