import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/authContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'

const queryClient = new QueryClient()

//await import('./api/mockApi.js')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <AuthProvider>
    <NotificationProvider>
    <App />
    </NotificationProvider>
    </AuthProvider>
    </BrowserRouter>
    </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
