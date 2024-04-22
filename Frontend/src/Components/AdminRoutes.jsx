import Cookies from 'js-cookie'
import api from "../api"
import { Navigate, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'

export const AdminRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)  

    // Check to see if the user is authorized to view the children of this component
    useEffect(() => {
        const authorize = async () => {
            try 
            {
                // try getting the token from the users browser
                if (Cookies.get('token') === undefined)
                {
                    setIsAuthenticated(false)
                }
                else
                {
                    // call the backend to validate the token and return its data
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
            {isAuthenticated ? <Outlet /> : <Navigate to="/" />}
        </>
    );
}