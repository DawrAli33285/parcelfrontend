import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import api from '../lib/api'
import { formatUTCTime } from '../lib/utils'
import ArrowButton from './ArrowButton'

function RecentOrders() {
  const [page, setPage] = useState(1)
  const { data: recentOrders, isLoading: recentOrdersLoading } = useQuery({
    queryKey: ['recentOrders', page],
    queryFn: async () => {
      const { data } = await api.get(`info/orderList?page=${page}&limit=5`)
      return data
    },
    initialData: []
  })

  const handleNextPage = () => {
    recentOrders.hasNextPage && setPage(prev => prev + 1)
  }

  const handlePrevPage = () => {
    recentOrders.hasPrevPage && setPage(prev => prev - 1)
  }

  return (
    <div className='w-full bg-white rounded-lg py-[15px] px-[20px] flex flex-col'>
      <div className='flex justify-between items-center mb-[16px]'>
        <h2 className='text-neutral-800 text-[15px] font-bold'>
          Recent orders
        </h2>
        {!recentOrdersLoading && recentOrders?.docs?.length !== 0 && (
          <div className='flex items-center gap-[8px]'>
            {recentOrders.hasPrevPage && (
              <ArrowButton dir={'left'} onClick={handlePrevPage} />
            )}
            <span className='text-neutral-500 text-xs font-normal'>
              Page {page}
            </span>
            {recentOrders.hasNextPage && (
              <ArrowButton dir={'right'} onClick={handleNextPage} />
            )}
          </div>
        )}
      </div>
      <div className='flex flex-col w-full gap-[7px]'>
        {recentOrdersLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className='pl-[9px] pr-[12px] md:pl-[16px] md:pr-0 h-[42px] border border-solid border-nav-inactive-border rounded-[9px] flex items-center gap-[12px] justify-between'
            >
              <Skeleton width={100} height={12} />
              <Skeleton width={100} height={12} />
              <Skeleton width={100} height={12} />
            </div>
          ))}
        {!recentOrdersLoading && !recentOrders?.docs?.length && (
          <p className='text-neutral-800 text-[15px]'>No recent orders</p>
        )}
        {recentOrders &&
          recentOrders?.docs?.map((order, index) => (
            <div
              key={index}
              className='pl-[9px] pr-[12px] md:pl-[16px] md:pr-0 h-[42px] border border-solid border-nav-inactive-border rounded-[9px] flex items-center gap-[12px] justify-between'
            >
              <div className='flex items-center gap-[8px] md:gap-[18px]'>
                <span className='text-nav-grey-text w-[75px] md:w-[150px] text-[11px] md:text-xs font-normal line-clamp-2 md:line-clamp-1'>
                  Name: {order?.sender?.name}
                </span>
                <span className='w-px h-[18px] bg-nav-inactive-border'></span>
                <span className='text-nav-grey-text max-w-[160px] md:max-w-[300px] text-[11px] md:text-xs font-normal line-clamp-2 md:line-clamp-1'>
                  Address: {order?.sender?.street1}
                </span>
                <span className='hidden md:block w-px h-[18px] bg-nav-inactive-border'></span>
                <span className='hidden text-nav-grey-text w-[150px] text-xs font-normal md:inline-block whitespace-nowrap overflow-hidden text-ellipsis'>
                  Order created: {formatUTCTime(order.createdAt)}
                </span>
              </div>
              <div className='flex items-center gap-[7px] md:w-[94px]'>
                <img
                  src={
                    order.fulfilled
                      ? '/assets/svg/checked-green.svg'
                      : '/assets/svg/red-x.svg'
                  }
                  alt='checked-green'
                  className='h-[12px]'
                />
                <span className='hidden text-nav-grey-text w-[150px] text-xs font-normal md:inline-block'>
                  {order.fulfilled ? 'Completed' : 'Canceled'}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
export default RecentOrders
