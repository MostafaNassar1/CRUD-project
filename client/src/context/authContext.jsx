import { createContext, useContext, useState } from "react";

const authContext = createContext()

export function AuthProvider({children}) {
    const[user, setUser] = useState(null)

    const login = (userData) => {
        setUser(userData)
    }

    const logout = () => {
        setUser(null)
    }

    return(
        <authContext.Provider value={{user, login, logout}}>{children}</authContext.Provider>
    )
}

export function useAuth(){
    return useContext(authContext)
}