import { AnimatePresence } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import DashboardNavigation from '../components/DashboardNavigation'
import ProtectedRoute from './ProtectedRoute'

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className='flex'>
        <DashboardNavigation />
        <AnimatePresence mode='wait'>
          <Outlet />
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  )
}
