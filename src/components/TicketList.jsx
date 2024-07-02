import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import ArrowButton from './ArrowButton'

function TicketList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const { isLoading, error, data } = useQuery({
    queryKey: ['ticketList', page],
    queryFn: async () => {
      const { data } = await api.get('info/ticketList?page=' + page)
      return data
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  const goToTicket = id => {
    navigate(`conversation/${id}`)
  }

  const handleNextPage = () => {
    data.hasNextPage && setPage(prev => prev + 1)
  }

  const handlePrevPage = () => {
    data.hasPrevPage && setPage(prev => prev - 1)
  }

  const isCurrentTicket = ticket => {
    const currentPath = window.location.pathname
    const ticketId = currentPath.split('/').pop()
    return ticketId === ticket._id
  }

  return (
    <div className='md:w-[40%] bg-white rounded-[17px] pt-[26px] px-5 pb-[10px]'>
      <div className='flex items-center justify-between'>
        <h2 className='text-neutral-800 text-[22px] font-normal'>
          Ticket history
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
      <div className='flex flex-col'>
        {isLoading &&
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={classNames(
                'h-[58px] px-[12px] pr-[70px] cursor-pointer flex items-center gap-[12px] rounded-[11px] hover:bg-grey-hover'
              )}
            >
              <div className='w-10px'>
                <Skeleton width={10} height={10} circle={true} />
              </div>
              <div className='w-full'>
                <Skeleton width={100} height={10} />
                <Skeleton width={200} height={10} />
              </div>
            </div>
          ))}
        {error && <p>Error: {error.message}</p>}
        {data && data.docs.length === 0 && (
          <div className='text-neutral-500 text-xs font-normal py-5'>
            No tickets found
          </div>
        )}
        {data &&
          data.docs &&
          data.docs.map(ticket => (
            <div
              key={ticket._id}
              onClick={() => goToTicket(ticket._id)}
              className={classNames(
                'h-[58px] px-[12px] pr-[70px] cursor-pointer flex items-center gap-[12px] rounded-[11px] hover:bg-grey-hover',
                isCurrentTicket(ticket) ? 'bg-grey-hover' : ''
              )}
            >
              <div className='w-10px'>
                {ticket.state === 'pending' ? (
                  <div className='h-[10px] w-[10px] rounded-full bg-[#ff6161]'></div>
                ) : (
                  <div className='h-[10px] w-[10px] rounded-full bg-[#31E479]'></div>
                )}
              </div>
              <div className='w-full'>
                <span className='block text-neutral-800 text-xs font-bold whitespace-nowrap text-ellipsis line-clamp-1 mb-[6px] capitalize'>
                  {ticket.title}
                </span>
                <span className='block text-input-text text-xs whitespace-nowrap text-ellipsis line-clamp-1'>
                  {ticket.description}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
export default TicketList
