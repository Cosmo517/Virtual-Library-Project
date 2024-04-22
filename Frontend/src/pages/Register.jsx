import React, {useState, useEffect} from 'react'
import api from '../api'
import '../CSS/custom_nav_padding.css'
import '../CSS/register.css'

export const Register = () => {
    // this will be a "form" for users
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        checkpass: '',
        administrator: 0
    });

    const handleInputChange = (event) => {
        const value = event.target.value
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        let info = document.getElementById('info')
        if (formData.username !== '' && formData.password.length >= 10 && formData.password == formData.checkpass)
        {
            let response = await api.post('/users/', formData)
            if (response.data.response == 'Accepted')
            {
                setFormData({
                    username: '',
                    password: '',
                    checkpass: '',
                    administrator: 0
                });
                info.innerHTML = 'Account created successfully'
            }
            else if (response.data.response == 'Username taken')
            {
                info.innerHTML = 'Username already exists'
            }
            else {
                info.innerHTML = 'Server error'
            }
        }
        else if (formData.username === '')
        {
            info.innerHTML = 'Username cannot be blank'
        }
        else if (formData.password != formData.checkpass)
        {
            info.innerHTML = 'New passwords do not match'
        }
        else
        {
            info.innerHTML = 'Error'
        }
    };

    return (
        <div className='page-wrapper'>
            <div className='container4'>
                <h4>
                    <center>
                        Create an Account
                    </center>
                </h4>

                <form onSubmit={handleFormSubmit}>
                    <div className='mb-1 mt-3'>
                        <input type='text' className='form-control' placeholder='Username' id='username' name='username' onChange={handleInputChange} value={formData.username}/>
                    </div>

                    <div className='mb-1'>
                        <input type='password' className='form-control' placeholder='Password' id='password' name='password' onChange={handleInputChange} value={formData.password}/>
                    </div>

                    <div className='mb-1'>
                        <input type='password' className='form-control' placeholder='Retype Password' id='checkpass' name='checkpass' onChange={handleInputChange} value={formData.checkpass}/>
                    </div>

                    <label id='info'></label> <br/>

                    <button type='submit' className='btn btn-primary5'>
                        Register
                    </button>

                    <button className='btn btn-primary6 button-spacing' onClick={() => {window.location.href='/#/login'}}>
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
}
