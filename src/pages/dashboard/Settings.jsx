import { zodResolver } from '@hookform/resolvers/zod'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import DashboardTransition from '../../components/DashboardTransition'
import DashboardWrapper from '../../components/DashboardWrapper'
import api from '../../lib/api.js'
import useUserInfoStore from '../../store/useUserInfoStore.js'

function Settings({ title }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const currentUserEmail = useUserInfoStore(state => state.userInfo.email)

  const passwordUpdateForm = useForm({
    resolver: zodResolver(
      z.object({
        currentPassword: z.string().min(8),
        newPassword: z.string().min(8)
      })
    )
  })

  const emailUpdateForm = useForm({
    resolver: zodResolver(
      z.object({
        currentEmail: z
          .string()
          .email()
          .refine(
            email => email === currentUserEmail,
            'Current email does not match'
          ),
        newEmail: z.string().email()
      })
    )
  })

  const onEmailSubmit = async data => {
    try {
      await api.post('/settings/updateEmail', data)
      toast.success('Email updated successfully')
    } catch (e) {
      console.log(e)
      if (e.response.status === 400) {
        toast.error(e.response.data.message)
      }
      if (e.response.status === 500) {
        toast.error(
          'An error occurred while updating your email. Please try again later.'
        )
      }
    }
  }

  const onPasswordSubmit = async data => {
    try {
      await api.post('/settings/updatePassword', data)
      toast.success('Password updated successfully')
    } catch (e) {
      console.log(e)
      if (e.response.status === 400) {
        toast.error(e.response.data.message)
      }
      if (e.response.status === 500) {
        toast.error(
          'An error occurred while updating your email. Please try again later.'
        )
      }
    }
  }

  return (
    <DashboardWrapper title={title}>
      <DashboardTransition>
        <div className='lg:absolute lg:inset-0 lg:overflow-y-auto no-scrollbar'>
          <div className='w-full bg-white rounded-lg pt-[38px] pb-[44px] pl-[33px] pr-[48px] flex flex-col'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-[64px]'>
              <form
                onSubmit={passwordUpdateForm.handleSubmit(onPasswordSubmit)}
                className='col-span-1 flex flex-col'
              >
                <h2 className='text-neutral-800 text-[22px] font-normal mb-[22px]'>
                  Change password
                </h2>
                <div className='flex flex-col gap-[15px] mb-[28px]'>
                  <div className='flex flex-col gap-[8px]'>
                    <label
                      htmlFor='currentPassword'
                      className='text-neutral-800 text-[12px] font-bold'
                    >
                      Current password
                    </label>
                    <div className='bg-input-bg flex items-center gap-3 h-[40px] pr-[14px] pl-[17px] rounded-lg'>
                      <input
                        id='currentPassword'
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder='Enter current password'
                        className='flex-1 bg-transparent placeholder-input-text text-[12px] font-normal focus:outline-none'
                        {...passwordUpdateForm.register('currentPassword')}
                      />
                      <div
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className={classNames(
                          'hover:text-orange-hover cursor-pointer',
                          {
                            'text-orange': showCurrentPassword,
                            'text-black': !showCurrentPassword
                          }
                        )}
                      >
                        {showCurrentPassword ? (
                          <svg
                            width='18'
                            height='14'
                            viewBox='0 0 18 14'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M1.66775 7.70249C1.56202 7.53508 1.50916 7.45137 1.47956 7.32226C1.45733 7.22528 1.45733 7.07234 1.47956 6.97537C1.50916 6.84626 1.56202 6.76255 1.66775 6.59514C2.54146 5.21169 5.14214 1.71436 9.10541 1.71436C13.0687 1.71436 15.6694 5.21169 16.5431 6.59514C16.6488 6.76255 16.7017 6.84626 16.7313 6.97537C16.7535 7.07234 16.7535 7.22528 16.7313 7.32226C16.7017 7.45137 16.6488 7.53508 16.5431 7.70249C15.6694 9.08593 13.0687 12.5833 9.10541 12.5833C5.14214 12.5833 2.54146 9.08594 1.66775 7.70249Z'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M9.10541 9.47787C10.3917 9.47787 11.4345 8.43512 11.4345 7.14881C11.4345 5.86251 10.3917 4.81976 9.10541 4.81976C7.81911 4.81976 6.77636 5.86251 6.77636 7.14881C6.77636 8.43512 7.81911 9.47787 9.10541 9.47787Z'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        ) : (
                          <svg
                            width='18'
                            height='17'
                            viewBox='0 0 18 17'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M8.12918 3.50975C8.4447 3.4631 8.77019 3.43808 9.10542 3.43808C13.0687 3.43808 15.6694 6.93542 16.5431 8.31886C16.6488 8.4863 16.7017 8.57002 16.7313 8.69916C16.7535 8.79614 16.7535 8.94913 16.7313 9.04611C16.7017 9.17524 16.6484 9.25951 16.5419 9.42807C16.3091 9.79651 15.9542 10.3143 15.484 10.8759M5.00932 4.76955C3.33079 5.9082 2.19126 7.49015 1.66851 8.31767C1.56229 8.48581 1.50918 8.56989 1.47957 8.69901C1.45734 8.79599 1.45733 8.94896 1.47955 9.04594C1.50915 9.17507 1.56202 9.25878 1.66776 9.42621C2.54147 10.8097 5.14215 14.307 9.10542 14.307C10.7035 14.307 12.08 13.7384 13.2111 12.969M2.11826 1.88538L16.0926 15.8597M7.45853 7.22565C7.03706 7.64712 6.77637 8.22939 6.77637 8.87254C6.77637 10.1588 7.81912 11.2016 9.10542 11.2016C9.74857 11.2016 10.3308 10.9409 10.7523 10.5194'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col gap-[8px]'>
                    <label
                      htmlFor='newPassword'
                      className='text-neutral-800 text-[12px] font-bold'
                    >
                      New password
                    </label>
                    <div className='bg-input-bg flex items-center gap-3 h-[40px] pr-[14px] pl-[17px] rounded-lg'>
                      <input
                        id='newPassword'
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder='Enter new password'
                        className='flex-1 bg-transparent placeholder-input-text text-[12px] font-normal focus:outline-none'
                        {...passwordUpdateForm.register('newPassword')}
                      />
                      <div
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className={classNames(
                          'hover:text-orange-hover cursor-pointer',
                          {
                            'text-orange': showNewPassword,
                            'text-black': !showNewPassword
                          }
                        )}
                      >
                        {showNewPassword ? (
                          <svg
                            width='18'
                            height='14'
                            viewBox='0 0 18 14'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M1.66775 7.70249C1.56202 7.53508 1.50916 7.45137 1.47956 7.32226C1.45733 7.22528 1.45733 7.07234 1.47956 6.97537C1.50916 6.84626 1.56202 6.76255 1.66775 6.59514C2.54146 5.21169 5.14214 1.71436 9.10541 1.71436C13.0687 1.71436 15.6694 5.21169 16.5431 6.59514C16.6488 6.76255 16.7017 6.84626 16.7313 6.97537C16.7535 7.07234 16.7535 7.22528 16.7313 7.32226C16.7017 7.45137 16.6488 7.53508 16.5431 7.70249C15.6694 9.08593 13.0687 12.5833 9.10541 12.5833C5.14214 12.5833 2.54146 9.08594 1.66775 7.70249Z'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                            <path
                              d='M9.10541 9.47787C10.3917 9.47787 11.4345 8.43512 11.4345 7.14881C11.4345 5.86251 10.3917 4.81976 9.10541 4.81976C7.81911 4.81976 6.77636 5.86251 6.77636 7.14881C6.77636 8.43512 7.81911 9.47787 9.10541 9.47787Z'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        ) : (
                          <svg
                            width='18'
                            height='17'
                            viewBox='0 0 18 17'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M8.12918 3.50975C8.4447 3.4631 8.77019 3.43808 9.10542 3.43808C13.0687 3.43808 15.6694 6.93542 16.5431 8.31886C16.6488 8.4863 16.7017 8.57002 16.7313 8.69916C16.7535 8.79614 16.7535 8.94913 16.7313 9.04611C16.7017 9.17524 16.6484 9.25951 16.5419 9.42807C16.3091 9.79651 15.9542 10.3143 15.484 10.8759M5.00932 4.76955C3.33079 5.9082 2.19126 7.49015 1.66851 8.31767C1.56229 8.48581 1.50918 8.56989 1.47957 8.69901C1.45734 8.79599 1.45733 8.94896 1.47955 9.04594C1.50915 9.17507 1.56202 9.25878 1.66776 9.42621C2.54147 10.8097 5.14215 14.307 9.10542 14.307C10.7035 14.307 12.08 13.7384 13.2111 12.969M2.11826 1.88538L16.0926 15.8597M7.45853 7.22565C7.03706 7.64712 6.77637 8.22939 6.77637 8.87254C6.77637 10.1588 7.81912 11.2016 9.10542 11.2016C9.74857 11.2016 10.3308 10.9409 10.7523 10.5194'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type={'submit'}
                  className='self-start border border-solid px-[14px] bg-orange border-orange h-[40px] w-[155px] rounded-lg text-white text-[16px] flex items-center justify-center hover:bg-orange-hover hover:border-orange-hover active:bg-orange active:border-orange'
                >
                  Save changes
                </button>
              </form>
              <form
                onSubmit={emailUpdateForm.handleSubmit(onEmailSubmit)}
                className='col-span-1 flex flex-col'
              >
                <h2 className='text-neutral-800 text-[22px] font-normal mb-[22px]'>
                  Change email
                </h2>
                <div className='flex flex-col gap-[15px] mb-[28px]'>
                  <div className='flex flex-col gap-[8px]'>
                    <label
                      htmlFor='currentEmail'
                      className='text-neutral-800 text-[12px] font-bold'
                    >
                      Current email
                    </label>
                    <div className='bg-input-bg flex items-center gap-3 h-[40px] pr-[14px] pl-[17px] rounded-lg'>
                      <input
                        id='currentEmail'
                        type='email'
                        placeholder='Enter current email'
                        className='flex-1 bg-transparent placeholder-input-text text-[12px] font-normal focus:outline-none'
                        {...emailUpdateForm.register('currentEmail')}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col gap-[8px]'>
                    <label
                      htmlFor='newEmail'
                      className='text-neutral-800 text-[12px] font-bold'
                    >
                      New email
                    </label>
                    <div className='bg-input-bg flex items-center gap-3 h-[40px] pr-[14px] pl-[17px] rounded-lg'>
                      <input
                        id='newEmail'
                        type='email'
                        placeholder='Enter a new email'
                        className='flex-1 bg-transparent placeholder-input-text text-[12px] font-normal focus:outline-none'
                        {...emailUpdateForm.register('newEmail')}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type={'submit'}
                  className='self-start border border-solid px-[14px] bg-orange border-orange h-[40px] w-[155px] rounded-lg text-white text-[16px] flex items-center justify-center hover:bg-orange-hover hover:border-orange-hover active:bg-orange active:border-orange'
                >
                  Save changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </DashboardTransition>
    </DashboardWrapper>
  )
}

Settings.propTypes = {
  title: PropTypes.string.isRequired
}

export default Settings
