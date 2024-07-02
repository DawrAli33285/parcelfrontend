import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import OrderStep1 from './components/orderSteps/OrderStep1'
import OrderStep2 from './components/orderSteps/OrderStep2'
import OrderStep3 from './components/orderSteps/OrderStep3'
import OrderStep4 from './components/orderSteps/OrderStep4'
import OrderStep5 from './components/orderSteps/OrderStep5'
import AdminDashboard from './layouts/AdminDashboard'
import Dashboard from './layouts/Dashboard'
import Ticket from './layouts/Ticket'
import AdminMain from './pages/admin/AdminMain'
import AuthRedirect from './pages/AuthRedirect'
import AddressBook from './pages/dashboard/AddressBook'
import Main from './pages/dashboard/Main'
import Order from './pages/dashboard/Order'
import Settings from './pages/dashboard/Settings'
import Conversation from './pages/dashboard/ticket/Conversation'
import NewTicket from './pages/dashboard/ticket/NewTicket'
import Login from './pages/Login'
import NewPassword from './pages/NewPassword'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/login' />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/new-password/:token',
    element: <NewPassword />
  },
  {
    path: '/google/redirect',
    element: <AuthRedirect />
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
    children: [
      {
        index: true,
        element: <Navigate to='home' replace={true} />
      },
      {
        path: 'home',
        element: <AdminMain title={'Admin Dashboard'} />
      }
    ]
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <Navigate to='home' replace={true} />
      },
      {
        path: 'home',
        element: <Main title={'Dashboard'} />
      },
      {
        path: 'address-book',
        element: <AddressBook title={'Address Book'} />
      },
      {
        path: 'settings',
        element: <Settings title={'Settings'} />
      },
      {
        path: 'tickets',
        element: <Ticket title={'Tickets'} />,
        children: [
          {
            index: true,
            element: <Navigate to='new-ticket' replace={true} />
          },
          {
            path: 'new-ticket',
            element: <NewTicket />
          },
          {
            path: 'conversation/:id',
            element: <Conversation />
          }
        ]
      },
      {
        path: 'order',
        element: <Order title={'Order'} />,
        children: [
          {
            index: true,
            element: <Navigate to='step-1' replace={true} />
          },
          {
            path: 'step-1',
            element: <OrderStep1 />
          },
          {
            path: 'step-2',
            element: <OrderStep2 />
          },
          {
            path: 'step-3',
            element: <OrderStep3 />
          },
          {
            path: 'step-4',
            element: <OrderStep4 />
          },
          {
            path: 'step-5',
            element: <OrderStep5 />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <h1>Not Found</h1>
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
