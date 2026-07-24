import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
    // TODO (later, when backend is connected):
    // Also call POST /api/auth/logout to clear the real cookies
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-3.5 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600 tracking-tight">
        CRUD App
      </Link>

      <div className="flex items-center gap-6">
        {user?.role === 'user' && (
          <Link
            to="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
          >
            Dashboard
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
          >
            Admin
          </Link>
        )}

        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              {user.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-800 leading-tight">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize leading-tight">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar