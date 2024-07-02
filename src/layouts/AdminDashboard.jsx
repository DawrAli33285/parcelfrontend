import { AnimatePresence } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import AdminDashboardNavigation from '../components/admin/AdminDashboardNavigation'
import ProtectedAdminRoute from './ProtectedAdminRoute'

export default function AdminDashboard() {
  return (
    <ProtectedAdminRoute>
      <div className='flex'>
        <AdminDashboardNavigation />
        <AnimatePresence mode='wait'>
          <Outlet />
        </AnimatePresence>
      </div>
    </ProtectedAdminRoute>
  )
}
