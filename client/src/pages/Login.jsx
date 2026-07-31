import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/authContext'
import { toast } from 'react-toastify'

function Login() {

  const navigate = useNavigate()
  
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await api.post('/auth/login', formData)
      const { role } = response.data.user

      login(response.data.user)
      toast.success(`Welcome back, ${response.data.user.name}!`)

      if (role === 'admin'){
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
     } catch (error) {
      setError(error.response?.data?.message || "Something went Wrong")
    }

    // TODO (later, when backend is connected):
    // 1. Send formData to POST /api/auth/login using axios
    // 2. Backend sets accessToken + refreshToken cookies and returns user info (including role)
    // 3. Based on response.data.user.role:
    //    if role === "admin" -> navigate("/admin")
    //    if role === "user"  -> navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-1 text-center text-gray-800 dark:text-gray-50">Welcome Back</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Login to your account</p>

        {error && (
  <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm px-4 py-2 rounded-lg mb-4">
    {error}
  </div>
)}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-6">
          If you don't have an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login