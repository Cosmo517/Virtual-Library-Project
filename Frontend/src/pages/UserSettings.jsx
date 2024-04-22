import { Navbar } from "../Components/Navbar";
import React, { useState } from 'react'
import Cookies from "js-cookie";
import '../CSS/usersettings.css'
import api from "../api";

export const UserSettings = () => {
    const logout = () => {
        Cookies.remove('token')
        window.location.href='/'
    }

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        checkNewPass: '',
        token: ''
    })

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        // grab the info element incase we need to display error messages
        let info = document.getElementById('info')

        // validate the user passwords
        if (formData.oldPassword != '' && formData.newPassword != '' && formData.checkNewPass != '') {
            if (formData.newPassword == formData.checkNewPass && formData.newPassword.length >= 10) {
                // grab the user token
                formData.token = Cookies.get('token')
                // send the request to the backend
                let response = await api.post('/passwords/', formData)
                if (response.data.response == 'Accepted')
                {
                    setFormData({
                        oldPassword: '',
                        newPassword: '',
                        checkNewPass: '',
                        token: ''
                    })
                    info.innerHTML = "Password Changed"
                }
                else if (response.data.response == 'Invalid Password')
                {
                    info.innerHTML = "Invalid password"
                }
                else
                {
                    setFormData({
                        oldPassword: '',
                        newPassword: '',
                        checkNewPass: '',
                        token: ''
                    })
                    info.innerHTML = "Session expired. Please sign in."
                }
            }
            else
            {
                info.innerHTML = "Length of new password is too short"
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
        <div className="page-wrapper3"> 
            <Navbar/>
            <div className="all-settings-container">
                <h3 className="center-text">User Settings:</h3>
                <button id='logout' className="btn btn-primary ml-2" onClick={logout}>Logout</button>

                <form className='mt-4' onSubmit={handleFormSubmit}>
                    <input type="password" className='form-control' id="oldPassword" name='oldPassword' placeholder="Current Password" onChange={handleInputChange} value={formData.oldPassword}/> <br/>
                    <input type='password' className='form-control' id="newPassword" name='newPassword' placeholder="New Password" onChange={handleInputChange} value={formData.newPassword}/> <br/>
                    <input type='password' className='form-control' id='checkNewPass' name='checkNewPass' placeholder="Retype New Password" onChange={handleInputChange} value={formData.checkNewPass}/> <br/>
                    <label id="info"></label>
                    <button type="submit" className="btn btn-primary submit-button">Change Password</button>
                </form>
            </div>
                {/* Footer Section */}
                <footer>
                    <p style={{ float: 'left' }}><strong>&copy; Virtual Library 2024, Web Portal for the Home Library</strong></p>
                    <p style={{ float: 'right' }}><strong>Team 1.12.2: E.B., H.F., J.K.</strong></p>
                </footer>
        </div>
    );
}