import Modal from '../layouts/Modal'

function ConfirmationModal({ closeModal, isOpen, onSuccess, actionText }) {
  const handleSubmit = async () => {
    await onSuccess()
    closeModal()
  }

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className='bg-white p-8 rounded-lg w-[515px] relative'>
        <p className='pb-8'>Are you sure you want to {actionText}?</p>
        <div className='flex justify-end'>
          <button onClick={closeModal} className='px-4 py-2 rounded-md'>
            cancel
          </button>
          <button
            onClick={handleSubmit}
            className='self-start border border-solid px-[14px] bg-orange border-orange h-[40px] rounded-lg text-white text-[16px] flex items-center justify-center hover:bg-orange-hover hover:border-orange-hover active:bg-orange active:border-orange'
          >
            {actionText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationModal
