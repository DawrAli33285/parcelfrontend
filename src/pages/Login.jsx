import { zodResolver } from '@hookform/resolvers/zod'
import { Turnstile } from '@marsidev/react-turnstile'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'
import AuthHeader from '../components/AuthHeader'
import api from '../lib/api'
import { TURNSTILE_SITE_KEY } from '../lib/config'
import {
  getTokenFromCookie,
  handleGoogleLogin,
  setTokenToCookie
} from '../lib/utils'

export default function Login() {
  const [captchaOK, setCaptchaOK] = useState(false)
  const [captchaToken, setCaptchaToken] = useState(null)
  const navigate = useNavigate()
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email(),
        password: z.string().min(8)
      })
    )
  })

  useEffect(() => {
    if (errors.password) {
      setShowForgotPassword(true)
    }
  }, [errors.password])

  useEffect(() => {
    const token = getTokenFromCookie()

    if (token) {
      navigate('/dashboard')
    }
  }, [navigate])

  const onSubmit = async data => {
    if (loading) {
      return
    }
    if (!captchaOK || !captchaToken) {
      toast.error('Captcha not verified')
      return
    }

    try {
      setLoading(true)
      const res = await api.post('/users/login', {
        ...data,
        captchaToken
      })
      toast.success('Logged in successfully')
      setTokenToCookie(res.data.token)
      navigate('/admin')
    } catch (error) {
      console.log(error)

      if (
        (error.response.status === 400 || error.response.status === 401) &&
        error.response.data?.message
      ) {
        setError('password', {
          type: 'custom',
          message: error.response.data.message
        })
        setShowForgotPassword(true)
        return toast.error(error.response.data.message)
      }
      return toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='py-10'>
      <AuthHeader />
      <div className='lg:absolute inset-0 w-screen lg:h-screen flex items-start lg:items-center justify-center lg:justify-between md:px-20 mx-auto max-w-[1440px] z-0'>
        <h1 className='hidden lg:block w-[608px]  text-white text-6xl leading-normal font-bold'>
          Your everyday shipping label portal
        </h1>
        <div className='bg-white w-[344px] sm:w-[392px] md:w-[496px] rounded-[23px] md:rounded-[32px] flex flex-col items-center md:items-start pt-[32px] pb-[44px] px-[24px] md:pt-[44px] md:pb-[56px] md:px-[52px] mt-[36px] sm:mt-[68px] md:mt-[96px] lg:mt-0'>
          <div className='flex flex-col items-center md:items-start mb-[25px] md:mb-[31px]'>
            <h2 className='text-neutral-800 text-[30px] md:text-[37px] font-bold md:mb-[6px]'>
              Welcome Back!
            </h2>
            <Link
              to='/register'
              className='inline-flex items-center gap-1 group'
            >
              <span className='text-orange text-[13px] md:text-[16px] font-normal group-hover:underline'>
                Don’t have an account?
              </span>
              <img src='/assets/svg/arrow-right.svg' alt='arrow-right' />
            </Link>
          </div>
          <div className='w-full'>
            <form
              className='flex flex-col gap-[28px]'
              onSubmit={handleSubmit(onSubmit)}
            >
              <div
                className={
                  'bg-input-bg flex items-center gap-3 h-[66px] px-[27px] pr-[22px] md:pr-[27px] rounded-[11px] border border-solid ' +
                  classNames({
                    'border-input-bg': !errors.email,
                    'border-red-500': errors.email
                  })
                }
              >
                <input
                  placeholder='Enter your email address'
                  className='flex-1 bg-transparent placeholder-input-text text-[13px] md:text-base font-normal focus:outline-none '
                  {...register('email', {
                    required: true,
                    onChange: e => e.key === 'Enter' && handleSubmit(onSubmit)()
                  })}
                />
                <label htmlFor='email' className='cursor-pointer'>
                  <img
                    src='/assets/svg/email.svg'
                    alt='email'
                    className='h-4'
                  />
                </label>
              </div>
              <div
                className={
                  'bg-input-bg flex items-center gap-3 h-[66px] px-[27px] pr-[22px] md:pr-[27px] rounded-[11px] border border-solid ' +
                  classNames({
                    'border-input-bg': !errors.password,
                    'border-red-500': errors.password
                  })
                }
              >
                <input
                  name='password'
                  id='password'
                  type='password'
                  placeholder='Enter a password'
                  className='flex-1 bg-transparent placeholder-input-text text-[13px] md:text-base font-normal focus:outline-none'
                  {...register('password', {
                    required: true,
                    onChange: e => e.key === 'Enter' && handleSubmit(onSubmit)()
                  })}
                />
                <label htmlFor='password' className='cursor-pointer'>
                  <img src='/assets/svg/lock.svg' alt='lock' className='h-5' />
                </label>
              </div>
              {TURNSTILE_SITE_KEY && (
                <Turnstile
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={token => {
                    setCaptchaToken(token)
                    setCaptchaOK(true)
                  }}
                  onError={() => setCaptchaOK(false)}
                  onExpire={() => setCaptchaOK(false)}
                  options={{
                    size: 'invisible'
                  }}
                />
              )}
              <button
                className='bg-orange hover:bg-orange-hover transition-all duration-500 h-16 px-7 rounded-xl relative flex justify-center items-center'
                type='submit'
                disabled={captchaOK === false}
              >
                <span className='text-white text-[16px] md:text-[19px] font-semibold'>
                  Log In
                </span>
                <img
                  src='/assets/svg/arrow-right-white.svg'
                  alt='arrow-right-white'
                  className='absolute right-0 pr-7'
                />
              </button>
            </form>
          </div>
          <div className='w-full relative flex items-center justify-center mt-[37px] mb-[27px] md:my-[53px]'>
            {showForgotPassword && (
              <Link
                to='/reset-password'
                className='absolute top-[-24px] md:top-[-36px] inset-x-auto text-center text-wrong-red text-[13px] md:text-[16px] font-normal hover:underline'
              >
                Forgot your password?
              </Link>
            )}
            <div className='bg-white text-stone-300 text-xl font-normal px-4 z-10'>
              Or
            </div>
            <div className='absolute top-1/2 left-0 right-0 h-px bg-stone-300'></div>
          </div>
          <button
            className='bg-white w-full hover:bg-grey-hover border border-grey-border transition-all duration-500 h-16 px-7 rounded-xl flex items-center justify-center gap-3'
            onClick={handleGoogleLogin}
          >
            <img
              src='/assets/svg/google-logo.svg'
              alt='google-logo'
              className='h-[22px]'
            />
            <span className='text-grey-text text-[16px] md:text-[19px] font-normal'>
              Log in With Google
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
