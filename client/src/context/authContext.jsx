import { createContext, useContext, useState } from "react";

const authContext = createContext()

export function AuthProvider({children}) {
    const[user, setUser] = useState(() => {
        const stored = localStorage.getItem('loggedInUser')
        return stored ? JSON.parse(stored) : null
    })
    

    const login = (userData) => {
        setUser(userData)
        localStorage.setItem('loggedInUser', JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('loggedInUser')
    }

    const updateUser = (updates) => {
        setUser((prev) => {
            const updated = {...prev, ...updates}
            localStorage.setItem('loogedInUser', JSON.stringify(updated))
            return updated
        })
    }

    return(
        <authContext.Provider value={{user, login, logout, updateUser}}>{children}</authContext.Provider>
    )
}

export function useAuth(){
    return useContext(authContext)
}