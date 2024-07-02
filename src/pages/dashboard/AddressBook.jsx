import { useQuery, useQueryClient } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import AddressModal from '../../components/AddressModal'
import ArrowButton from '../../components/ArrowButton.jsx'
import DashboardTransition from '../../components/DashboardTransition'
import DashboardWrapper from '../../components/DashboardWrapper'
import api from '../../lib/api.js'
import { formatDate } from '../../lib/utils.js'

function AddressBook({ title }) {
  const [page, setPage] = useState(1)
  const [openAddressModal, setOpenAddressModal] = useState(false)
  const queryClient = useQueryClient()
  const { isLoading, error, data } = useQuery({
    queryKey: ['addressList', page],
    queryFn: async () => {
      const { data } = await api.get(`info/addressList?page=${page}`)
      return data
    }
  })

  const closeModal = useCallback(() => {
    setOpenAddressModal(false)
  }, [])

  const openModal = () => {
    setOpenAddressModal(true)
  }

  const handleDeleteAddress = async id => {
    try {
      await api.post(`address/delete`, { id })
      queryClient.invalidateQueries({ queryKey: ['addressList'] })
    } catch (error) {
      console.error(error)
    }
  }

  const handleNextPage = () => {
    data.hasNextPage && setPage(prev => prev + 1)
  }

  const handlePrevPage = () => {
    data.hasPrevPage && setPage(prev => prev - 1)
  }

  const itemsList =
    data &&
    data?.docs?.map(address => {
      return (
        <div
          key={address._id}
          className='h-[42px] px-[16px] border border-solid border-nav-inactive-border rounded-[9px] flex items-center gap-[12px] justify-between'
        >
          <div className='flex items-center gap-[8px] md:gap-[18px]'>
            <span className='text-input-text w-[350px] text-[12px] md:text-xs font-normal line-clamp-2 md:line-clamp-1'>
              {address.address}
            </span>
            <span className='text-input-text w-[150px] text-[12px] md:text-xs font-normal line-clamp-2 md:line-clamp-1'>
              Date added: {formatDate(address.createdAt)}
            </span>
          </div>
          <button className='flex items-center gap-[7px]'>
            <img src='/assets/svg/red-x.svg' alt='red-x' className='h-[12px]' />
            <span
              className='hidden text-input-text text-[12px] font-normal md:inline-block'
              onClick={() => handleDeleteAddress(address._id)}
            >
              Delete
            </span>
          </button>
        </div>
      )
    })

  return (
    <>
      <DashboardWrapper title={title}>
        <DashboardTransition>
          <div className='lg:absolute lg:inset-0 lg:overflow-y-auto no-scrollbar'>
            <div className='w-full bg-white rounded-lg py-[15px] px-[20px] flex flex-col'>
              <div className='flex justify-between items-center mb-[16px]'>
                <h2 className='text-neutral-800 text-[15px] font-bold'>
                  Your saved sender addresses
                </h2>
                {data && data.docs.length !== 0 && (
                  <div className='flex items-center gap-[8px]'>
                    {data.hasPrevPage && (
                      <ArrowButton dir={'left'} onClick={handlePrevPage} />
                    )}
                    <span className='text-neutral-500 text-xs font-normal'>
                      Page {page}
                    </span>
                    {data.hasNextPage && (
                      <ArrowButton dir={'right'} onClick={handleNextPage} />
                    )}
                  </div>
                )}
              </div>
              <div className='flex flex-col w-full gap-[7px]'>
                {isLoading &&
                  Array.from({ length: 10 }).map((_, index) => (
                    <div
                      key={index}
                      className='pl-[9px] pr-[12px] md:pl-[16px] md:pr-0 h-[42px] border border-solid border-nav-inactive-border rounded-[9px] flex items-center gap-[12px] justify-between'
                    >
                      <Skeleton width={100} height={12} />
                      <Skeleton width={100} height={12} />
                      <Skeleton width={100} height={12} />
                    </div>
                  ))}
                {error && <p>error.response.message</p>}
                {data && !data.docs.length && (
                  <p className='text-input-text text-[12px] font-normal'>
                    No address found
                  </p>
                )}
                {!isLoading && data && itemsList}
              </div>
              <button
                className='mt-[14px] self-start border border-solid px-[14px] bg-orange border-orange h-[40px] rounded-lg text-white text-[16px] flex items-center justify-center hover:bg-orange-hover hover:border-orange-hover active:bg-orange active:border-orange'
                onClick={openModal}
              >
                Add new address
              </button>
            </div>
          </div>
        </DashboardTransition>
      </DashboardWrapper>
      <AddressModal
        isOpen={openAddressModal}
        closeModal={closeModal}
        onSuccess={() =>
          queryClient.invalidateQueries({
            queryKey: ['addressList']
          })
        }
      />
    </>
  )
}

AddressBook.propTypes = {
  title: PropTypes.string
}

export default AddressBook
