import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../lib/api'
import OrderStepTransition from './OrderStepTransition'

function OrderStep5() {
  const params = new URLSearchParams(window.location.search)
  const isOrderSuccess = params.get('success') === 'true'
  const isOrderFailed = params.get('canceled') === 'true'
  const orderID = params.get('id') || ''
  const [downloadURL, setDownloadURL] = useState('')

  useEffect(() => {
    if (isOrderSuccess) {
      api
        .get(`order/downloadLabel/${orderID}`)
        .then(({ data }) => {
          setDownloadURL(data.downloadURL)
        })
        .catch(error => {
          console.error(error)
          toast.error('An error occurred while fetching download URL')
        })
    }
  }, [isOrderSuccess, orderID])

  return (
    <OrderStepTransition className='flex-1 flex justify-center items-center'>
      {isOrderSuccess && (
        <div className='w-[340px]'>
          <img
            src='/assets/images/order-completed.jpg'
            alt='order-completed'
            className='mx-auto mb-[10px]'
          />
          <h2 className='text-[30px] font-bold text-center mb-[15px]'>
            Order Completed!
          </h2>
          <p className='text-[12px] font-normal text-input-text text-center'>
            Our Oompa-Loompa&apos;s are working on your order and your label
            will arrive in your mail-box soon!
          </p>
          <a
            href={downloadURL}
            download='label.pdf'
            className='text-white md:flex bg-orange hover:bg-orange-hover transition-all duration-500  h-[42px] mt-4  rounded-lg relative justify-center items-center'
          >
            Download Label
          </a>
        </div>
      )}
      {isOrderFailed && (
        <div className='w-[340px]'>
          <img
            src='/assets/images/order-failed.jpg'
            alt='order-failed'
            className='mx-auto mb-[10px]'
          />
          <h2 className='text-[30px] font-bold text-center mb-[15px]'>
            Order Failed!
          </h2>
          <p className='text-[12px] font-normal text-input-text text-center'>
            Whoops! Something went wrong there. Please try again. Think
            something&apos;s off? Get in touch!
          </p>
        </div>
      )}
    </OrderStepTransition>
  )
}

export default OrderStep5
