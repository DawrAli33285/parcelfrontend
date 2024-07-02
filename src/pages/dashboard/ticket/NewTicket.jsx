import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'
import Dropdown from '../../../components/dropdown/Dropdown.jsx'
import DropdownItem from '../../../components/dropdown/DropdownItem.jsx'
import api from '../../../lib/api.js'

function NewTicket() {
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      priority: ''
    },
    resolver: zodResolver(
      z.object({
        priority: z
          .string()
          .refine(
            val => ['low', 'medium', 'high'].includes(val),
            "Priority must be 'low', 'medium' or 'high'"
          ),
        title: z.string().min(10).max(100),
        message: z.string().min(10).max(1000)
      })
    )
  })

  const handlePriorityChange = useCallback(
    value => {
      setValue('priority', value)
      clearErrors('priority')
    },
    [clearErrors, setValue]
  )

  const onSubmit = async data => {
    if (sending) return
    try {
      setSending(true)
      const { data: res } = await api.post('/ticket/create', data)
      console.log(res)
      navigate(`/dashboard/tickets/conversation/${res._id}`)
      toast.success('Ticket created successfully')
      queryClient.invalidateQueries({ queryKey: 'ticketList' })
      reset()
    } catch (error) {
      console.log(error)
      if (
        (error.response.status === 400 || error.response.status === 401) &&
        error.response.data?.message
      ) {
        return toast.error(error.response.data.message)
      }
      return toast.error('An error occurred')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className='flex-grow bg-white  rounded-[17px] pt-[28px] px-5 pr-[136px] pb-[17px] h-fit'>
      <h2 className='text-neutral-800 text-[22px] font-normal mb-[16px]'>
        Open a ticket
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-[15px]'
      >
        <div>
          <label className='text-xs font-bold block mb-[8px]'>Priority</label>
          <Dropdown
            invalid={errors.priority}
            placeholder={'Select priority'}
            onChange={handlePriorityChange}
          >
            <DropdownItem value={'low'}>Low</DropdownItem>
            <DropdownItem value={'medium'}>Medium</DropdownItem>
            <DropdownItem value={'high'}>High</DropdownItem>
          </Dropdown>
        </div>
        <div>
          <label className='text-xs font-bold block mb-[8px]'>Title</label>
          <input
            className={classNames(
              'px-[12px] flex justify-between items-center w-full h-[40px] bg-input-bg focus:outline-none placeholder-input-text rounded-[8px] text-xs font-normal',
              {
                'border border-solid border-red-500': errors.title
              }
            )}
            placeholder='Enter title'
            {...register('title')}
          />
        </div>
        <div>
          <label className='text-xs font-bold block mb-[8px]'>Message</label>
          <textarea
            className={classNames(
              'resize-none p-[12px] h-[216px] flex justify-between items-center w-full bg-input-bg focus:outline-none placeholder-input-text rounded-[8px] text-xs font-normal',
              {
                'border border-solid border-red-500': errors.message
              }
            )}
            placeholder='Enter your message here'
            {...register('message')}
          ></textarea>
        </div>
        <button
          type='submit'
          className='mt-[20px] self-start border border-solid px-[14px] bg-orange border-orange h-[42px] w-[155px] rounded-lg text-white text-[16px] flex items-center justify-center hover:bg-orange-hover hover:border-orange-hover active:bg-orange active:border-orange'
        >
          Submit ticket
        </button>
      </form>
    </div>
  )
}

export default NewTicket
