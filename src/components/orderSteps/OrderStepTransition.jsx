import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

function OrderStepTransition({ children, className }) {
  const variants = {
    enter: {
      opacity: 0
    },
    center: {
      opacity: 1
    },
    exit: {
      opacity: 0
    }
  }

  return (
    <motion.div
      variants={variants}
      initial='enter'
      animate='center'
      exit='exit'
      transition={{
        opacity: { duration: 1, ease: 'easeInOut' }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

OrderStepTransition.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}

export default OrderStepTransition
