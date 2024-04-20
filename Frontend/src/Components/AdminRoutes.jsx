import Cookies from 'js-cookie'
import api from "../api"
import { Navigate, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Navbar } from './Navbar';

export const AdminRoutes = () => {
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
                    if (token.data != null && token.data.administrator == 1)
                    {
                        setIsAuthenticated(true)
                    }
                    else
                    {
                        setIsAuthenticated(false)
                    }
                }
            }
            catch (err)
            {
                setIsAuthenticated(false)
            }
        }

        authorize()
    }, [])

    if (isAuthenticated === null)
        return null

    return (
        <>
            <Navbar isAuthenticated={isAuthenticated} />
            {isAuthenticated ? <Outlet /> : <Navigate to="/" />}
        </>
    );
}