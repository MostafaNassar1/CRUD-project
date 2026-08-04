import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { toast } from 'react-toastify'
import { useTheme } from '../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faBell } from '@fortawesome/free-solid-svg-icons'
import { useNotifications } from '../context/NotificationContext'
import { useState } from 'react'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { notifications, unreadCount, markAllAsRead, removeNotification, clearAllNotifications } = useNotifications()
  const [ showNotifications, setShowNotifications ] = useState(false)

  const handleLogout = () => {
    logout()
    toast.info('Logged out successfully')
    navigate('/login')
    // TODO (later, when backend is connected):
    // Also call POST /api/auth/logout to clear the real cookies
  }

  const formatTime = (timestamp) => {
    const data = new Date(timestamp)
    return data.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 px-6 py-3.5 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
        CRUD App
      </Link>

      <div className="flex items-center gap-6">
        {user?.role === 'user' && (
          <Link
            to="/dashboard"
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Dashboard
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Admin
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link to="/analytics" className='text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition'>
            Dashboard
          </Link>
        )}

        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold overflow-hidden">
              {user.photo ? (
                <img src={user.photo} alt='Profile' className='w-9 h-9 rounded-full object-cover'/>
              ):(user.name.charAt(0))}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize dark:text-gray-400 leading-tight">{user.role}</p>
            </div>
          </div>
        )}
        <div className="relative">
    <button
        onClick={() => {
            setShowNotifications(!showNotifications)
            if (!showNotifications) markAllAsRead()
        }}
        className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        title="Notifications"
    >
        <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
        {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
            </span>
        )}
    </button>

    {showNotifications && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <span className='font-semibold text-sm text-gray-800 dark:text-gray-100'>
                Notifications
              </span>
              {notifications.length > 0 && (
                <button onClick={clearAllNotifications} className='text-xs text-blue-600 dark:text-blue-400 hover:underline'>Clear all</button>
              )}
            </div>
            {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
            ) : (
                notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-200">{n.message}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatTime(n.timestamp)}</p>
                      </div>
                      <button onClick={() => removeNotification(n.id)} className='text-gray-400 hover:text-red-500 dark:text-gray-500 dark:text-red-400 text-sm leading-none px-1' title='Remove notification'>
                        x
                      </button>  
                    </div>
                ))
            )}
        </div>
    )}
</div>

        <button onClick={toggleTheme} className='p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition' title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className='w-4 h-4' />
        </button>

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