import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify'

import React from 'react'
import ReactDOM from 'react-dom/client'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.jsx'
import './styles/reset.css'
import './styles/tailwind.css'

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
    <ToastContainer
      position='bottom-left'
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      // pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='light'
    />
  </React.StrictMode>
)
