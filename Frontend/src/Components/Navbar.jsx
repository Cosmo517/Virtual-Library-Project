import React, { useState, useEffect } from 'react';
import '../CSS/custom_nav_padding.css';

export const Navbar = () => {

    return (
        <header>
            <nav className='navbar navbar-expand-lg navbar-dark fixed-top'>
                <a className="navbar-brand" href="#">
                    Virtual Library
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <a className='nav-link' href='#'>
                                Dashboard
                            </a>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <a className='nav-link' href='#/Browse'>
                                Browse
                            </a>
                        </li>
                    </ul>

                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item active">
                                    <a className='nav-link' href='#/AddingBooks'>
                                        Add Books
                                    </a>
                                </li>
                            </ul>
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item active">
                                    <a className='nav-link' href="#/RemovingBooks">
                                        Remove Books
                                    </a>
                                </li>
                            </ul>
                    
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                More
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <a className="dropdown-item" href="#/UserSettings">Settings</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};
