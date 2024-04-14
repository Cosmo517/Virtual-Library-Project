import Cookies from 'js-cookie'
import api from "../src/api"
import { Navigate, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthProvider } from './Auth'

export const PrivateRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)  

    useEffect(() => {
        const authorize = async () => {
            try 
            {
                if (Cookies.get('token') === undefined)
                {
                    setIsAuthenticated(false)
                }
                else
                {
                    const token = await api.post("/token/", { 'token' : Cookies.get('token') })
                    if (Object.keys(token).length != 0)
                    {
                        setIsAuthenticated(true)
                    }
                }
            }
            catch (err)
            {
                console.log('error, ', err)
                setIsAuthenticated(false)
            }

        }

        authorize()
    }, [])

    if (isAuthenticated === null)
        return null

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}