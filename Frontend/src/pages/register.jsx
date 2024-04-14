import React, {useState, useEffect} from 'react'
import api from '../api'
import { Navbar } from "../../Components/Navbar";

export const Register = () => {
    const [books, register] = useState([]);

    // this will be a "form" for books
    const [formData, setFormData] = useState({
        username: '',
        password: '',
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
        await api.post('/users/', formData)
        setFormData({
            username: '',
            password: '',
            administrator: 0
        });
    };

    return (
        <>
            <div className='container'>
                <form onSubmit={handleFormSubmit}>
                    <div className='mb-1 mt-3'>
                        <input type='text' className='form-control' placeholder='Username' id='username' name='username' onChange={handleInputChange} value={formData.username}/>
                    </div>

                    <div className='mb-1'>
                        <input type='text' className='form-control' placeholder='Password' id='password' name='password' onChange={handleInputChange} value={formData.password}/>
                    </div>

                    <div className='mb-1'>
                        <input type='text' className='form-control' placeholder='Retype Password' onChange={handleInputChange} value={formData.checkpass}/>
                    </div>

                    <button type='Register' className='btn btn-primary'>
                        Register
                    </button>
                </form>
            </div>
        </>
    );
}