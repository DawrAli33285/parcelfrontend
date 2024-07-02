import PropTypes from 'prop-types'

const ArrowButton = ({ dir, ...rest }) => {
  return (
    <button
      className='h-5 w-5 flex justify-center items-center bg-white border border-solid border-[#F8F8F8] rounded-full hover:bg-[#FFE6D2] hover:border-[#FFE6D2] active:bg-orange active:border-orange text-orange active:text-white'
      {...rest}
    >
      {dir === 'left' && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='11'
          height='8'
          viewBox='0 0 11 8'
          fill='none'
        >
          <path
            d='M10.0205 4.62967C10.2967 4.62967 10.5205 4.40581 10.5205 4.12967C10.5205 3.85353 10.2967 3.62967 10.0205 3.62967L10.0205 4.62967ZM0.943468 3.77612C0.748206 3.97138 0.748206 4.28796 0.943468 4.48322L4.12545 7.6652C4.32071 7.86046 4.63729 7.86046 4.83256 7.6652C5.02782 7.46994 5.02782 7.15336 4.83256 6.9581L2.00413 4.12967L4.83256 1.30124C5.02782 1.10598 5.02782 0.789397 4.83256 0.594135C4.63729 0.398873 4.32071 0.398873 4.12545 0.594135L0.943468 3.77612ZM10.0205 3.62967L1.29702 3.62967L1.29702 4.62967L10.0205 4.62967L10.0205 3.62967Z'
            fill='currentColor'
          ></path>
        </svg>
      )}
      {dir === 'right' && (
        <svg
          className='w-[9px]'
          xmlns='http://www.w3.org/2000/svg'
          width='10'
          height='8'
          viewBox='0 0 10 8'
          fill='none'
        >
          <path
            d='M0.616211 3.62967C0.340069 3.62967 0.116211 3.85353 0.116211 4.12967C0.116211 4.40581 0.340069 4.62967 0.616211 4.62967V3.62967ZM9.69325 4.48322C9.88851 4.28796 9.88851 3.97138 9.69325 3.77612L6.51127 0.594135C6.31601 0.398873 5.99942 0.398873 5.80416 0.594135C5.6089 0.789397 5.6089 1.10598 5.80416 1.30124L8.63259 4.12967L5.80416 6.9581C5.6089 7.15336 5.6089 7.46994 5.80416 7.6652C5.99942 7.86047 6.31601 7.86047 6.51127 7.6652L9.69325 4.48322ZM0.616211 4.62967H9.3397V3.62967H0.616211V4.62967Z'
            fill='currentColor'
          ></path>
        </svg>
      )}
    </button>
  )
}

ArrowButton.propTypes = {
  dir: PropTypes.oneOf(['left', 'right']).isRequired
}

export default ArrowButton
