import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmationModal from '../../../components/ConfirmationModal'
import api from '../../../lib/api'
import { formatTime } from '../../../lib/utils'
import useUserInfoStore from '../../../store/useUserInfoStore'
import io from 'socket.io-client'

function Conversation() {
  const { id } = useParams()
  const socketRef=useRef()
  const chatRef = useRef(null)
  const user = useUserInfoStore(state => state.userInfo)
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [marking, setMarking] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  const { isLoading, data: ticket } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const { data } = await api.post(`/ticket/getTicket`, {
        id
      })
      return data
    }
  })

  useEffect(() => {
    if (ticket?.chat.length > 0) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [ticket])

  const handleSendMessage = async () => {
    if (!message) return
    if (sending) return
    try {
      setSending(true)
      await api.post(`/ticket/message`, {
        id: ticket._id,
        message
      })
      let addmessage={
        message,
        sender:'user',
        senderId:user.id,
        ticketId:ticket._id,
        _id:user._id
      }
      socketRef?.current?.emit('message',addmessage)
      setMessage('')
      await queryClient.invalidateQueries({
        queryKey: ['ticket', id]
      })
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    } catch (error) {
      console.error(error)
      toast.error('An error occurred while sending the message')
    } finally {
      setSending(false)
    }
  }

  const markAsResolved = useCallback(
    async id => {
      if (marking) return
      try {
        setMarking(true)
        await api.post(`/ticket/mark-resolved`, {
          id
        })
      } catch (error) {
        console.error(error)
        toast.error('An error occurred while marking the ticket as solved')
      } finally {
        setMarking(false)
        await queryClient.invalidateQueries({ queryKey: ['ticket', id] })
      }
    },
    [marking, queryClient]
  )

  const markCurrentTicketAsResolved = useCallback(async () => {
    markAsResolved(id)
  }, [markAsResolved, id])

  const closeModal = useCallback(() => {
    setConfirmModalOpen(false)
  }, [])

  const ready = !isLoading && ticket
  useEffect(() => {

    // Initialize socket connection
    socketRef.current = io('http://localhost:3000')
    let connectiondata={
      userId:user.id,
  }
  socketRef.current.emit('connected',connectiondata)
  socketRef.current.on('message',(data)=>{
    console.log("DATA")
    console.log(data)
  })
  }, [])

  return (
    <div className='flex-grow bg-white min-h-[600px]  rounded-[17px] pt-[28px] pb-[22px] px-5 flex flex-col'>
      <div className='flex items-center justify-between mb-[20px]'>
        {ready ? (
          <h2 className='text-neutral-800 text-[22px] font-normal'>
            {ticket.title}
          </h2>
        ) : (
          <Skeleton containerClassName='w-20' />
        )}
        {ready &&
          (ticket.state === 'pending' ? (
            <button
              className='h-[32px] w-[110px] rounded-lg flex justify-center items-center text-xs bg-white text-orange border border-solid border-orange  hover:bg-orange hover:text-white'
              onClick={() => setConfirmModalOpen(true)}
            >
              Mark as solved
            </button>
          ) : (
            <p className='h-[32px] w-[110px] rounded-lg flex justify-center items-center text-xs text-green-500 border border-solid border-green-500 cursor-default'>
              Closed
            </p>
          ))}
      </div>
      <div className='flex-grow w-full rounded-[25px] bg-[#f7f7f7] flex flex-col px-5 py-[24px]'>
        <div className='flex-grow relative mb-[24px]'>
          <div
            ref={chatRef}
            className='absolute inset-0 w-full h-full overflow-y-scroll no-scrollbar'
          >
            <div className='flex flex-col gap-[24px]'>
              {ready ? (
                ticket.chat.map(message => (
                  <div
                    key={message._id}
                    className={
                      message.sender == 'user'
                        ? 'pl-[95px] text-right'
                        : 'pr-[95px] text-left'
                    }
                  >
                    <div
                      className={
                        message.sender == 'user'
                          ? 'flex flex-row-reverse items-center gap-[15px] mb-[14px]'
                          : 'flex items-center gap-[15px] mb-[14px]'
                      }
                    >
                      {user.picture ? (
                        <img
                          className='h-[38px] w-[38px] object-cover rounded-full'
                          src={user.picture}
                          alt='profile-picture'
                        />
                      ) : (
                        <div
                          className='h-[38px] w-[38px] object-cover rounded-full bg-[#202020] flex justify-center items-center'
                          style={{ borderRadius: '50%' }}
                        >
                          <img
                            src='/assets/svg/profile.svg'
                            alt='profile-picture'
                          />
                        </div>
                      )}
                      <div>
                        <div className='text-neutral-800 text-xs font-bold'>
                          {message?.sender=="admin"?"Admin":'User'}
                        </div>
                        <div className='text-input-text text-xs font-normal'>
                          {formatTime(message.sentAt)}
                        </div>
                      </div>
                    </div>
                    <p className='text-input-text text-xs font-normal'>
                      {message.message}
                    </p>
                  </div>
                ))
              ) : (
                <Skeleton count={10} />
              )}
            </div>
          </div>
        </div>
        {ready && ticket.state === 'pending' && (
          <div className='h-[50px] pl-[17px] pr-[6px] rounded-xl bg-white border border-solid border-[#D8D8D8] flex items-center gap-[12px]'>
            <input
              className='w-full outline-none placeholder-input-text text-[12px]'
              placeholder='Type a message'
              value={message}
              onChange={e => {
                setMessage(e.target.value)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSendMessage()
                }
              }}
            />
            <button
              className='h-[40px] w-[40px] flex justify-center items-center hover:bg-[#FAFAFA] rounded-[9px] group'
              onClick={handleSendMessage}
            >
              {sending ? (
                <svg
                  className='animate-spin h-5 w-5 text-orange'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.009 8.009 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
              ) : (
                <svg
                  className='text-white group-hover:text-[#FAFAFA]'
                  width='22'
                  height='23'
                  viewBox='0 0 22 23'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M2.65955 10.2544C2.0642 10.0228 1.76653 9.90708 1.67962 9.74028C1.60428 9.59568 1.60418 9.42343 1.67935 9.27874C1.76606 9.11184 2.0636 8.99573 2.65867 8.7635L19.5464 2.17316C20.0836 1.96353 20.3522 1.85871 20.5238 1.91605C20.6729 1.96584 20.7898 2.08281 20.8396 2.23186C20.897 2.40349 20.7921 2.67208 20.5825 3.20926L13.9922 20.097C13.7599 20.6921 13.6438 20.9896 13.4769 21.0763C13.3322 21.1515 13.16 21.1514 13.0154 21.0761C12.8486 20.9891 12.7328 20.6915 12.5013 20.0961L9.8732 13.3381C9.8262 13.2173 9.8027 13.1569 9.76641 13.106C9.73424 13.0609 9.6948 13.0214 9.6497 12.9893C9.59882 12.953 9.5384 12.9295 9.41755 12.8825L2.65955 10.2544Z'
                    fill='currentColor'
                    stroke='#FF841F'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
      <ConfirmationModal
        closeModal={closeModal}
        isOpen={confirmModalOpen}
        onSuccess={markCurrentTicketAsResolved}
        actionText={'mark as resolved'}
      />
    </div>
  )
}

export default Conversation
