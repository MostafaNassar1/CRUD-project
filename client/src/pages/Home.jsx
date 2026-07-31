import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

function Home() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">CRUD App</span>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800 transition"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="w-4 h-4" />
          </button>

          <Link
            to="/login"
            className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-50 mb-6">
          Manage Users, Simply.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
          A full-stack user management system with secure authentication,
          role-based access control, and real-time admin tools — built to
          handle registration, profiles, and permissions in one place.
        </p>

        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
        >
          Login to Continue
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 text-left">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Secure Authentication</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              JWT-based login with HTTP-only cookies keeps sessions safe.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Role-Based Access</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Admins and users get different views and permissions automatically.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Full CRUD Control</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create, search, filter, update, and delete users with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home