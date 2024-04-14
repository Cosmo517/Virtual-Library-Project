import React, {useState, useEffect} from 'react'
import api from '../api'
import { Navbar } from "../../Components/Navbar";
import Cookies from 'js-cookie'

export const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        let signedjwt = await api.post('/login/', formData)
        console.log('data: ', signedjwt['data'].length)
        setFormData({
            username: '',
            password: ''
        })
        if (signedjwt['data']['token'])
        {
            Cookies.set('token', signedjwt['data']['token'])
            window.location.href='/';
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
            <div className='container'>
                <form onSubmit={handleFormSubmit}>
                    <div className='mb-1 mt-3'>
                        <input type='text' className='form-control' placeholder='Username' id='username' name='username'  onChange={handleInputChange} value={formData.username}/>
                    </div>

                    <div className='mb-1'>
                        <input type='text' className='form-control' placeholder='Password' id='password' name='password' onChange={handleInputChange} value={formData.password}/>
                    </div>
                
                    <button type='submit' className='btn btn-primary'>
                        Login
                    </button>
                </form>
        </div>
    </>
    )
}