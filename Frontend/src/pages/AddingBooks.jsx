import React, {useState} from 'react'
import api from '../api'
import { Navbar } from '../Components/Navbar';
import '../CSS/add_books.css'

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

    // handle any input change for the formData
    const handleInputChange = (event) => {
        const value = event.target.value
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    // handle form submission
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        // grab the info label incase we need to display error messages
        let info = document.getElementById('info')
        // check to see if any formData is empty and display an error
        for (const key in formData) {
            if (formData[key] == '') {
                info.innerHTML = 'One or more fields are empty'
                return;
            }
        }
        
        // grab form information and turn it into the correct data types
        formData.isbn = formData.isbn.replace(/[^0-9]/g, "")
        formData.page_count = parseInt(formData.page_count);
        formData.publish_year = parseInt(formData.publish_year);

        // try and create the post
        let response = await api.post('/books/', formData)
        if (response.data.response == 'success')
        {
            info.innerHTML = 'Book created successfully'
            setFormData({
                isbn: '',
                title: '',
                author: '',
                publisher: '',
                page_count: '',
                published_year: '',
                category: ''
            });
        }
        else if (response.data.response == 'book already exists')
        {
            info.innerHTML = 'A book with that ISBN already exists'
        }
        else 
        {
            info.innerHTML = 'Server error'
        }
    };

    return (
        <>
        <div className="page-wrapper1"> 
            <Navbar isAuthenticated={isAuthenticated }/>
            <div className='container1'>
                <h5 className='center-text' style={{color: 'white'}}>Enter the information of a book you want to add</h5>
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
                
                    <label style={{color: 'white'}}id='info'></label> <br/>

                    <button type='submit' className='btn btn-primary7'>
                        Add Book
                    </button>
                </form>
            </div>
            {/* Footer Section */}
            <footer>
                <p style={{ float: 'left' }}><strong>&copy; Virtual Library 2024, Web Portal for the Home Library</strong></p>
                <p style={{ float: 'right' }}><strong>Team 1.12.2: E.B., H.F., J.K.</strong></p>
            </footer>
    </div>
    </>
    )
}
