import React, {useState} from 'react'
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
        // grab the info element incase we need to display error messages
        let info = document.getElementById('info')
        // verify that the username is valid and that the passwords are valid
        if (formData.username !== '' && formData.password.length >= 10 && formData.password == formData.checkpass && formData.username.length <= 25)
        {
            // make a request to the backend
            let response = await api.post('/users/', formData)
            if (response.data.response == 'Success')
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
        else if (formData.username > 25)
        {
            info.innerHTML = 'Username must be 25 characters or less'
        }
        else if (formData.password != formData.checkpass)
        {
            info.innerHTML = 'New passwords do not match'
        }
        else if (formData.password.length < 10)
        {
            info.innerHTML = "Password is not 10 characters or longer"
        }
        else
        {
            info.innerHTML = 'Error'
        }
    };

    return (
        <div className='page-wrapper4'>
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

                    <label id='info'>Passwords must be 10 characters or longer</label> <br/>

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
