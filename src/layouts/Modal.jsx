import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'

const variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0 }
}

const transition = {
  ease: 'easeOut',
  duration: 0.3
}

function Modal({ isOpen, closeModal, children }) {
  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <div className='fixed inset-0 z-30 flex items-center justify-center h-screen p-4 overflow-y-auto no-scrollbar'>
          <div className='fixed inset-0 flex items-center justify-center h-screen'>
            <motion.div
              className='absolute inset-0 z-40 h-screen w-screen bg-black flex justify-center items-center'
              initial='hidden'
              animate={'visible'}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 0.1 },
                exit: { opacity: 0 }
              }}
              transition={{
                ease: 'easeOut',
                duration: 1
              }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            ></motion.div>
            <motion.div
              initial='hidden'
              animate={'visible'}
              variants={variants}
              exit='exit'
              transition={transition}
              className='z-50'
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  closeModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
}

export default Modal
