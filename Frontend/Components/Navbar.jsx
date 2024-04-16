import { Link } from "react-router-dom";
import '../src/CSS/custom_nav_padding.css'

export const Navbar = () => {
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

                    <li className="nav-item active custom_nav_padding">
                        <a className='navbar-link' href='#/AddingBooks'>
                            Add Books
                        </a>
                    </li>
                    
                    <li className="nav item active custom_nav_padding">
                        <a className='navbar-link' href="#/RemovingBooks">
                            Remove Books
                        </a>
                    </li>

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