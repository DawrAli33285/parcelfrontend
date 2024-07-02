import { useQuery } from '@tanstack/react-query'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Link } from 'react-router-dom'
import DashboardTransition from '../../components/DashboardTransition'
import DashboardWrapper from '../../components/DashboardWrapper'
import RecentOrders from '../../components/RecentOrders.jsx'
import api from '../../lib/api.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const screenWidth = document.body.clientWidth

const options = {
  scales: {
    y: {
      border: {
        display: false,
        dash: [5, 5]
      },
      ticks: {
        font: {
          size: 12,
          family: "'Open Sans', 'sans-serif'"
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      border: {
        display: false
      },
      ticks: {
        font: {
          size: 12,
          family: "'Open Sans', 'sans-serif'"
        }
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
}

function Main({ title }) {
  const [chartData, setChartData] = useState({
    labels:
      screenWidth > 767
        ? [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ]
        : ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    datasets: [
      {
        backgroundColor: '#FFE6D2',
        barThickness: screenWidth > 767 ? 27 : 10,
        borderRadius: 6,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0]
      }
    ]
  })

  const { isLoading: statsLoading, data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data } = await api.get('info/statistics')
      return data
    },
    initialData: {
      addresses: 0,
      labels: 0,
      tickets: 0,
      labelsChart: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  })

  useEffect(() => {
    if (stats && !statsLoading) {
      setChartData(prevState => {
        return {
          ...prevState,
          datasets: [
            {
              ...prevState.datasets[0],
              data: stats.labelsChart
            }
          ]
        }
      })
    }
  }, [stats, statsLoading])

  return (
    <DashboardWrapper title={title}>
      <DashboardTransition>
        <div className='lg:absolute lg:inset-0 lg:overflow-y-auto no-scrollbar'>
          <div className='flex overflow-x-auto md:grid grid-cols-3 gap-[14px] mb-[10px] no-scrollbar'>
            <div className='bg-white aspect-[2.8] md:aspect-auto h-[73px] lg:h-[95px] rounded-lg lg:rounded-[11px] col-span-1 flex items-center pl-[16px] relative'>
              <div className='h-[40px] lg:h-[60px] bg-[#FFF9EC] flex justify-center items-center aspect-square rounded-[5px] mr-[11px] lg:mr-[18px]'>
                <img
                  className='h-[20px] lg:h-[30px]'
                  src='/assets/svg/saved-address.svg'
                  alt='saved-address'
                />
              </div>
              <div className='h-[40px] lg:h-[60px] flex flex-col justify-between'>
                <span className='text-neutral-500 text-[13px] lg:text-[15px] font-normal'>
                  Addresses saved
                </span>
                <span className='text-neutral-800 text-lg lg:text-2xl font-bold'>
                  {stats ? stats.addresses : 0}
                </span>
              </div>
              <Link
                to='/dashboard/address-book'
                className='bg-orange hover:bg-orange-hover active:bg-orange absolute right-[10px] bottom-[10px] lg:right-[16px] lg:bottom-[11px] aspect-square h-[19px] lg:h-[27px] rounded-[44px] flex justify-center items-center'
              >
                <img
                  className='w-[12px] lg:w-[16px]'
                  src='/assets/svg/arrow-right-white.svg'
                  alt='arror-right-white'
                />
              </Link>
            </div>
            <div className='bg-white aspect-[2.8] md:aspect-auto h-[73px] lg:h-[95px] rounded-lg col-span-1 flex items-center pl-[16px] relative'>
              <div className='h-[40px] lg:h-[60px] bg-[#FFF9EC] flex justify-center items-center aspect-square rounded-[5px] mr-[11px] lg:mr-[18px]'>
                <img
                  className='h-[20px] lg:h-[30px]'
                  src='/assets/svg/labels-orange.svg'
                  alt='labels-orange'
                />
              </div>
              <div className='h-[40px] lg:h-[60px] flex flex-col justify-between'>
                <span className='text-neutral-500 text-[13px] lg:text-[15px] font-normal'>
                  Labels bought
                </span>
                <span className='text-neutral-800 text-lg lg:text-2xl font-bold'>
                  {stats ? stats.labels : 0}
                </span>
              </div>
              <Link
                to='/dashboard/order'
                className='bg-orange hover:bg-orange-hover active:bg-orange absolute right-[10px] bottom-[10px] lg:right-[16px] lg:bottom-[11px] aspect-square h-[19px] lg:h-[27px] rounded-[44px] flex justify-center items-center'
              >
                <img
                  className='w-[12px] lg:w-[16px]'
                  src='/assets/svg/arrow-right-white.svg'
                  alt='arror-right-white'
                />
              </Link>
            </div>
            <div className='bg-white aspect-[2.8] md:aspect-auto h-[73px] lg:h-[95px] rounded-lg col-span-1 flex items-center pl-[16px] relative'>
              <div className='h-[40px] lg:h-[60px] bg-[#FFF9EC] flex justify-center items-center aspect-square rounded-[5px] mr-[11px] lg:mr-[18px]'>
                <img
                  className='h-[20px] lg:h-[30px]'
                  src='/assets/svg/tickets-orange.svg'
                  alt='tickets-orange'
                />
              </div>
              <div className='h-[40px] lg:h-[60px] flex flex-col justify-between'>
                <span className='text-neutral-500 text-[13px] lg:text-[15px] font-normal'>
                  Active Tickets
                </span>
                <span className='text-neutral-800 text-lg lg:text-2xl font-bold'>
                  {stats ? stats.tickets : 0}
                </span>
              </div>
              <Link
                to='/dashboard/tickets/new-ticket'
                className='bg-orange hover:bg-orange-hover active:bg-orange absolute right-[10px] bottom-[10px] lg:right-[16px] lg:bottom-[11px] aspect-square h-[19px] lg:h-[27px] rounded-[44px] flex justify-center items-center'
              >
                <img
                  className='w-[12px] lg:w-[16px]'
                  src='/assets/svg/arrow-right-white.svg'
                  alt='arror-right-white'
                />
              </Link>
            </div>
          </div>
          <div className='w-full bg-white rounded-lg py-[15px] px-[20px] mb-[10px] h-[350px] md:h-[370px] flex flex-col'>
            <h2 className='text-neutral-800 text-[15px] font-bold mb-[17px]'>
              Labels statistics
            </h2>
            <div className='h-full w-full'>
              <Bar data={chartData} options={options} />
            </div>
          </div>
          <RecentOrders />
        </div>
      </DashboardTransition>
    </DashboardWrapper>
  )
}

Main.propTypes = {
  title: PropTypes.string
}

export default Main
