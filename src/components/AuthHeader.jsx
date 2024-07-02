import { useEffect } from 'react'

export default function AuthHeader() {
  useEffect(() => {
    document.body.style.backgroundImage =
      'url(/assets/images/auth-background.jpg)'
    document.body.style.backgroundSize = 'cover'
    document.body.style.minHeight = '100vh'
    document.body.style.backgroundPosition = 'top left'
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.style.zIndex = '-10'
    document.body.style.overflowX = 'hidden'

    return () => {
      document.body.style.backgroundImage = 'none'
      document.body.style.backgroundSize = 'none'
      document.body.style.backgroundPosition = 'none'
      document.body.style.backgroundRepeat = 'none'
      document.body.style.zIndex = 'none'
      document.body.style.overflowX = 'none'
    }
  }, [])

  return (
    <header className=' mx-auto max-w-[1440px] relative z-50'>
      {/* <div className='absolute inset-0 w-screen h-screen -z-10'>
        <img
          src='/assets/images/auth-background.jpg'
          alt='auth-background'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 w-full h-full bg-neutral-800 bg-opacity-40 '></div>
      </div> */}
      <div className='flex justify-center lg:justify-start mt-[50px] sm:mt-[78px] md:mt-[100px] lg:mt-[44px] lg:mx-[80px]'>
        <a href='https://parcelportal.co'>
          <img
            src='/assets/svg/logo-white.svg'
            alt='logo-white'
            className='h-[46px]'
          />
        </a>
      </div>
    </header>
  )
}
