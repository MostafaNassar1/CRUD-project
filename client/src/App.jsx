import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import AdminPanel from './pages/AdminPanel'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer, toast } from 'react-toastify'
import Analyticsdashboard from './pages/AnalyticsDashboard'

function App() {
  return (
    <>
    <ToastContainer position='top-right' autoClose={3000} theme="light" />
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin">
                                    <AdminPanel/>
                                    </ProtectedRoute> }/>
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      <Route path="/analytics" element={<ProtectedRoute allowedRole="admin"><Analyticsdashboard/></ProtectedRoute>}/>
    </Routes>
    </>
  )
}

export default App