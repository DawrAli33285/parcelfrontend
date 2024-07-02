import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthHeader from '../components/AuthHeader'
import api from '../lib/api'

export default function ResetPassword() {
  const [email, setEmail] = useState('')

  const handlePasswordReset = async () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!emailRegex.test(email)) {
      return toast.error('Please enter a valid email address')
    }

    try {
      await api.post('/users/reset-password', { email })
      toast.success(
        'You would receive an email with instructions to reset your password shortly.'
      )
    } catch (error) {
      console.error(error)
      return toast.error('An error occurred')
    }
  }

  return (
    <div>
      <AuthHeader />
      <div className='lg:absolute inset-0 w-screen lg:h-screen flex items-start lg:items-center justify-center px-4 sm:px-[19px] mx-auto max-w-[1440px]'>
        <div className='bg-white w-[344px] sm:w-[392px] md:w-[526px] rounded-[23px] md:rounded-[32px] flex flex-col items-center md:items-start pt-[32px] pb-[44px] px-[24px] md:pt-[52px] md:pb-[56px] md:px-[52px] mt-[36px] sm:mt-[68px] md:mt-[96px] lg:mt-0'>
          <div className='mb-[25px] md:mb-[39px] w-full'>
            <h2 className='text-neutral-800 text-[30px] md:text-[37px] font-bold text-center'>
              Password Reset
            </h2>
          </div>
          <div className='w-full mb-[39px]'>
            <div className='flex flex-col gap-[22px]'>
              <div className='bg-input-bg flex items-center gap-3 h-[66px] px-[27px] pr-[22px] md:pr-[27px] rounded-[11px]'>
                <input
                  name='email'
                  id='email'
                  type='email'
                  placeholder='Enter your email address'
                  className='flex-1 bg-transparent placeholder-input-text text-[13px] md:text-base font-normal focus:outline-none'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <label htmlFor='email' className='cursor-pointer'>
                  <img
                    src='/assets/svg/email.svg'
                    alt='email'
                    className='h-4'
                  />
                </label>
              </div>
              <button
                className='bg-orange hover:bg-orange-hover transition-all duration-500 h-16 px-7 rounded-xl relative flex justify-center items-center'
                onClick={handlePasswordReset}
              >
                <span className='text-white text-[16px] md:text-[19px] font-semibold'>
                  Reset Password
                </span>
                <img
                  src='/assets/svg/arrow-right-white.svg'
                  alt='arrow-right-white'
                  className='absolute right-0 pr-7'
                />
              </button>
            </div>
          </div>
          <div className='w-full flex justify-center'>
            <Link to='/login' className='inline-flex items-center gap-1 group'>
              <span className='text-orange text-[13px] md:text-[16px] font-normal group-hover:underline'>
                Go back to log in
              </span>
              <img src='/assets/svg/arrow-right.svg' alt='arrow-right' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
