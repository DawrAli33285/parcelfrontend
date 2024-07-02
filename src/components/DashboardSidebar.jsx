import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../lib/api'

function DashboardSidebar() {
  const { data } = useQuery({
    queryKey: ['liveRates'],
    queryFn: async () => {
      const { data } = await api.get(`/rates/live`)
      return data
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  return (
    <div className='lg:col-span-1 grid md:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-[14px] max-h-[740px]'>
      <div className='bg-white h-[134px] md:h-auto rounded-[10px] flex justify-start md:justify-center items-center'>
        <div className='md:w-[220px] h-full flex md:flex-col md:gap-[26px] lg:gap-0 lg:justify-evenly md:items-center lg:p-0 md:pt-[30px] md:pb-[50px]'>
          <img
            src='/assets/images/support.jpg'
            alt='support'
            className='p-4 px-4'
          />
          {/*// <!-- for Tablet and Desktop  -->*/}
          <p className='hidden md:block text-center text-neutral-500 text-[15px] font-normal leading-normal'>
            Are you stuck or do you have questions? We’re here to help.
          </p>
          <Link
            to='/dashboard/tickets/new-ticket'
            className='hidden md:flex bg-orange hover:bg-orange-hover transition-all duration-500  h-[42px] w-[210px] rounded-lg relative justify-center items-center'
          >
            <span className='text-white text-base font-normal'>
              Open a ticket
            </span>
            <img
              src='/assets/svg/arrow-right-white.svg'
              alt='arrow-right-white'
              className='absolute w-3 right-7'
            />
          </Link>
          {/*// <!-- for Mobile -->*/}
          <div className='flex flex-col w-[220px] md:hidden my-auto gap-[10px] ml-[8px]'>
            <p className='text-neutral-500 text-xs font-normal leading-normal'>
              Are you stuck or do you have questions? We’re here to help.
            </p>
            <Link
              to='/dashboard/tickets/new-ticket'
              className='self-start flex items-center gap-2 text-orange w-auto'
            >
              <span className='text-[13px] font-normal'>Open a ticket</span>
              <img
                src='/assets/svg/arrow-right.svg'
                alt='arrow-right'
                className='w-[13px]'
              />
            </Link>
          </div>
        </div>
      </div>
      <div className='bg-white h-[134px] md:h-auto rounded-[10px] pl-[24px] pr-[20px] md:px-[22px]'>
        <div className='h-full flex gap-[14px] md:gap-0 md:flex-col md:justify-evenly items-center'>
          <img
            src='/assets/images/shipping.png'
            alt='shipping'
            className='h-[110px] md:h-[180px]'
          />
          <div className='w-full flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <span className='text-neutral-800 text-xs md:text-[15px] font-bold'>
                Shipping rates
              </span>
              <span className='bg-[#FF5454] text-center text-white text-[10px] px-[4px] md:text-[13px] font-normal md:px-[8px] py-[2px] rounded-[5px]'>
                LIVE
              </span>
            </div>
            <div className='w-full flex items-center justify-between'>
              <span className='text-neutral-500 text-xs md:text-[15px] font-normal'>
                Small packages
              </span>
              <span className='text-neutral-500 text-xs md:text-[15px] font-bold'>
                ${data?.small || 0}
              </span>
            </div>
            <div className='w-full flex items-center justify-between'>
              <span className='text-neutral-500 text-xs md:text-[15px] font-normal'>
                Medium packages
              </span>
              <span className='text-neutral-500 text-xs md:text-[15px] font-bold'>
                ${data?.medium || 0}
              </span>
            </div>
            <div className='w-full flex items-center justify-between'>
              <span className='text-neutral-500 text-xs md:text-[15px] font-normal'>
                Large packages
              </span>
              <span className='text-neutral-500 text-xs md:text-[15px] font-bold'>
                ${data?.large || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

DashboardSidebar.propTypes = {}

export default DashboardSidebar
