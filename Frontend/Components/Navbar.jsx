import { useEffect, useState } from 'react'
import '../src/CSS/custom_nav_padding.css'

export const Navbar = () => {
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


    return (
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
            <div className='container-fluid'>
                <a className="navbar-brand" href="#">
                    Virtual Library
                </a>

                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active custom_nav_padding">
                        <a className='navbar-link' href='#'>
                            Dashboard
                        </a>
                    </li>

                    <li className="nav-item active custom_nav_padding">
                        <a className='navbar-link' href='#/Browse'>
                            Browse
                        </a>
                    </li>

                    <li className="nav-item active custom_nav_padding">
                        <a className='navbar-link' href='#/Search'>
                            Search
                        </a>
                    </li>

                    {isAuthenticated && <li className="nav-item active custom_nav_padding">
                        <a className='navbar-link' href='#/AddingBooks'>
                            Add Books
                        </a>
                    </li>}

                    {isAuthenticated && <li className="nav item active custom_nav_padding">
                        <a className='navbar-link' href="#/RemovingBooks">
                            Remove Books
                        </a>
                    </li>}

                    <li className="nav item active custom_nav_padding">
                        <a className="navbar-link" href="#/UserSettings">
                            Settings
                        </a>
                    </li>

                    <li className="nav-item active custom_nav_padding">
                        <a className='navbar-link' href='#/Login'>
                            Login
                        </a>
                    </li>

                    <li className="nav-item active custom_nav_padding">
                        <a className='navbar-link' href='#/Register'>
                            Register
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}