import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function DashboardHeader({ title }) {
  return (
    <header className='bg-white flex justify-end md:justify-between items-center h-[70px] md:h-[96px] pr-[11px] md:px-[21px]'>
      <h1 className='hidden md:block text-neutral-800 text-3xl font-bold'>
        {title}
      </h1>
      <div className='flex gap-[12px] md:gap-[14px] lg:gap-[26px]'>
        <Link
          to={'/dashboard/order'}
          className='flex justify-center items-center gap-[10px] bg-orange hover:bg-orange-hover text-white border border-solid border-orange hover:border-orange-hover w-[140px] h-[42px] md:w-[160px] md:h-[45px] lg:w-[178px] lg:h-[53px] rounded-[10px]'
        >
          <svg
            className='h-[11px] md:h-[15px]'
            width='17'
            height='17'
            viewBox='0 0 17 17'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g id='Group 61'>
              <path
                id='Vector 14'
                d='M8.37988 1.00708L8.37988 15.746'
                stroke='white'
                strokeLinecap='round'
              />
              <path
                id='Vector 15'
                d='M15.749 8.37646L1.01013 8.37646'
                stroke='white'
                strokeLinecap='round'
              />
            </g>
          </svg>
          <span className='text-[13px] md:text-[14px] lg:text-base font-normal'>
            Start new Order
          </span>
        </Link>
      </div>
    </header>
  )
}

DashboardHeader.propTypes = {
  title: PropTypes.string.isRequired
}

export default DashboardHeader
