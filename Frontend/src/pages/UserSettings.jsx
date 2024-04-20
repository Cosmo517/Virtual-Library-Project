import { Navbar } from "../../Components/Navbar";
import React, { useState, useEffect } from 'react'
import Cookies from "js-cookie";
import '../CSS/usersettings.css'

export const UserSettings = () => {
    const logout = () => {
        Cookies.remove('token')
        window.location.href='/'
    }

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        checkNewPass: ''
    })

    const handleFormSubmit = (event) => {
        if (formData.oldPassword != '' && formData.newPassword != '' && formData.checkNewPass != '') {
            if (formData.newPassword == formData.checkNewPass) {
                // continue code here
            }
        }
    };

    const handleInputChange = (event) => {
        const value = event.target.value
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };
    
    return (
        <>
            <Navbar/>
            <div className="all-settings-container">
                <h3 className="center-text">User Settings:</h3>
                <button id='logout' className="btn btn-primary" onClick={logout}>Logout</button>

                <form className='mt-4' onSubmit={handleFormSubmit}>
                    <input type="password" className='form-control' id="oldPassword" name='oldPassword' placeholder="Current Password" onChange={handleInputChange} value={formData.oldPassword}/> <br/>
                    <input type='password' className='form-control' id="newPassword" name='newPassword' placeholder="New Password" onChange={handleInputChange} value={formData.newPassword}/> <br/>
                    <input type='password' className='form-control' id='checkNewPass' name='checkNewPassword' placeholder="Retype New Password" onChange={handleInputChange} value={formData.checkNewPass}/> <br/>
                    <button type="submit" className="btn btn-primary">Change Password</button>
                </form>
            </div>
        </>
    );
}