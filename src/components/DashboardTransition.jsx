import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
}

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.8
}

function DashboardTransition({ children }) {
  return (
    <motion.div
      key={location.key}
      initial='initial'
      animate='in'
      exit='out'
      variants={pageVariants}
      transition={pageTransition}
      className='lg:col-span-3 relative'
    >
      {children}
    </motion.div>
  )
}

DashboardTransition.propTypes = {
  children: PropTypes.node.isRequired
}

export default DashboardTransition
