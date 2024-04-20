import React, {useState, useEffect} from 'react'
import api from '../api'
import { Navbar } from '../Components/Navbar';

export const AddingBooks = ({ isAuthenticated}) => {
    // this will be a "form" for books
    const [formData, setFormData] = useState({
        isbn: '',
        title: '',
        author: '',
        publisher: '',
        page_count: '',
        published_year: '',
        category: ''
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
        formData.isbn = formData.isbn.replace(/[^0-9]/g, "")
        formData.page_count = parseInt(formData.page_count);
        formData.publish_year = parseInt(formData.publish_year);
        await api.post('/books/', formData)
        setFormData({
            isbn: '',
            title: '',
            author: '',
            publisher: '',
            page_count: '',
            published_year: '',
            category: ''
        });
    };

    return (
        <>
            <Navbar isAuthenticated={isAuthenticated }/>
            <div className='container'>
                <form onSubmit={handleFormSubmit}>
                    <div className='mb-1 mt-3'>
                        <input type='text' className='form-control' placeholder='ISBN' id='isbn' name='isbn' onChange={handleInputChange} value={formData.isbn}/>
                    </div>

                    <div className='mb-1'>
                        <input type='text' className='form-control' placeholder='Title' id='title' name='title' onChange={handleInputChange} value={formData.title}/>
                    </div>

                    <div className='mb-1'>
                        <input type='text' className='form-control' placeholder='Author' id='author' name='author' onChange={handleInputChange} value={formData.author}/>
                    </div>

                    <div className='mb-1'>
                        <input type='text' className='form-control' placeholder='Publisher' id='publisher' name='publisher' onChange={handleInputChange} value={formData.publisher}/>
                    </div>

                    <div className='mb-1'>
                        <input type='text' className='form-control' placeholder='Page Count' id='page_count' name='page_count' onChange={handleInputChange} value={formData.page_count}/>
                    </div>

                    <div className='mb-1'>
                        <input type='text' className='form-control' placeholder='Year Published' id='published_year' name='published_year' onChange={handleInputChange} value={formData.published_year}/>
                    </div>

                    <div className='mb-1'>
                        <input type='text' className='form-control' placeholder='Genre' id='category' name='category' onChange={handleInputChange} value={formData.category}/>
                    </div>
                
                    <button type='submit' className='btn btn-primary'>
                        Add Book
                    </button>
                </form>
        </div>
    </>
    )
}
