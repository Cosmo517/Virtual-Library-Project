import Cookies from 'js-cookie'
import api from "../api"
import { Navigate, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'

export const PrivateRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null) 

    // check to see if the user is authorized to access the children components
    useEffect(() => {
        const authorize = async () => {
            try 
            {
                // try grabbing the token cookie from the users browser
                if (Cookies.get('token') === undefined)
                {
                    setIsAuthenticated(false)
                }
                else
                {
                    // Validate to see if the users information is current
                    const token = await api.post("/token/", { 'token' : Cookies.get('token') })
                    if (token.data != null)
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

    // Wait till the server responds with the Authentication information
    if (isAuthenticated === null)
        return null

    return isAuthenticated ? <Outlet /> : <Navigate to="/login"/>;
}