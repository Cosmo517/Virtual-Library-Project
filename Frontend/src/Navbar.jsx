import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className='navbar navbar-dark bg-primary'>
            <div className='container-fluid'>
                <a className='navbar-brand' href='#'>
                    Dashboard
                </a>
                <a className='navbar-nav' href='#/Browse'>
                    Browse
                </a>
                <a className='navbar-brand' href='#/Search'>
                    Search
                </a>
                <a className='navbar-brand' href='#/AddingBooks'>
                    Add Books
                </a>
                <a className='navbar-brand' href='#/Login'>
                    Login
                </a>
                <a className='navbar-brand' href='#/Register'>
                    Register
                </a>
            </div>
        </nav>
    );
}