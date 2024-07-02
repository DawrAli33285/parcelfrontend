import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthHeader from '../components/AuthHeader'
import api from '../lib/api'

export default function NewPassword() {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match')
    }

    if (password.length < 8) {
      return toast.error('Password must be at least 8 characters long')
    }

    try {
      await api.post(`/users/set-password/${token}`, {
        password
      })
      toast.success('Password reset successfully')
      return navigate('/login')
    } catch (error) {
      return toast.error(error.response.data.message)
    }
  }

  return (
    <div>
      <AuthHeader />
      <div className='lg:absolute inset-0 w-screen lg:h-screen flex items-start lg:items-center justify-center px-4 sm:px-[19px] mx-auto max-w-[1440px]'>
        <div className='bg-white w-[344px] sm:w-[392px] md:w-[526px] rounded-[23px] md:rounded-[32px] flex flex-col items-center md:items-start pt-[32px] pb-[44px] px-[24px] md:pt-[52px] md:pb-[56px] md:px-[52px] mt-[36px] sm:mt-[68px] md:mt-[96px] lg:mt-0'>
          <div className='mb-[25px] md:mb-[39px] w-full'>
            <h2 className='text-neutral-800 text-[30px] md:text-[37px] font-bold text-center'>
              Enter a new password
            </h2>
          </div>
          <div className='w-full mb-[39px]'>
            <div className='flex flex-col gap-[22px]'>
              <div className='bg-input-bg flex items-center gap-3 h-[66px] px-[27px] pr-[22px] md:pr-[27px] rounded-[11px]'>
                <input
                  name='new-password'
                  id='new-password'
                  type='password'
                  placeholder='Enter a new password'
                  className='flex-1 bg-transparent placeholder-input-text text-[13px] md:text-base font-normal focus:outline-none'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <label htmlFor='new-password' className='cursor-pointer'>
                  <img src='/assets/svg/lock.svg' alt='lock' className='h-5' />
                </label>
              </div>
              <div className='bg-input-bg flex items-center gap-3 h-[66px] px-[27px] pr-[22px] md:pr-[27px] rounded-[11px]'>
                <input
                  name='confirm-password'
                  id='confirm-password'
                  type='password'
                  placeholder='Confirm new password'
                  className='flex-1 bg-transparent placeholder-input-text text-[13px] md:text-base font-normal focus:outline-none'
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                className='bg-orange hover:bg-orange-hover transition-all duration-500 h-16 px-7 rounded-xl relative flex justify-center items-center'
                onClick={handleResetPassword}
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
