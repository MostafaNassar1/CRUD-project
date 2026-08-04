import { createContext, useContext, useState } from "react";

const NotificationContext = createContext()

export function NotificationProvider({children}) {
    const [notifications, setNotifications] = useState(() => {
        const stored = localStorage.getItem('notifications')
        return stored ? JSON.parse(stored) : []
    })

    const addNotification = (message) => {
        const newNotification = {
            id: crypto.randomUUID(),
            message,
            timestamp: new Date().toISOString(),
            read: false
        }

        setNotifications((prev) => {
            const updated = [newNotification, ...prev].slice(0, 20)
            localStorage.setItem('notifications', JSON.stringify(updated))
            return updated
        })
    }

    const markAllAsRead = () => {
        setNotifications((prev) => {
            const updated = prev.map((n) => ({...n, read: true}))
            localStorage.setItem('notifications', JSON.stringify(updated))
            return updated
        })
    }

    const removeNotification = (id) => {
        setNotifications((prev) => {
            const updated = prev.filter((n) => n.id !== id)
            localStorage.setItem('notifications', JSON.stringify(updated))
            return updated
        })
    }

    const clearAllNotifications = () => {
        setNotifications([])
        localStorage.setItem('notifications', JSON.stringify([]))
    }

    const unreadCount = notifications.filter((n) => !n.read).length

    return(
        <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead, unreadCount, removeNotification, clearAllNotifications }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications(){
    return useContext(NotificationContext)
}