import React, {useState, useEffect} from 'react'
import api from '../api'
import { Navbar } from '../Navbar';

export const AddingBooks = () => {
    const [books, setBooks] = useState([]);
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

    const fetchBooks = async() => {
        const response = await api.get('/books/');
        return response;
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleInputChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        formData.page_count = parseInt(formData.page_count);
        formData.publish_year = parseInt(formData.publish_year);
        await api.post('/books/', formData)
        fetchBooks();
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
            <Navbar/>
            <div className='container'>
                <form onSubmit={handleFormSubmit}>
                    <div className='mb-1 mt-5'>
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
