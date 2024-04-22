import { useState } from "react";
import { Navbar } from "../Components/Navbar";
import api from "../api";
import '../CSS/remove_books.css'

export const RemovingBooks = ({ isAuthenticated }) => {
    const [formData, setFormData] = useState({
        isbn: ''
    })

    const [response, setResponse] = useState({data: {
        isbn: '',
        title: '',
        author: '',
        publisher: '',
        page_count: '',
        published_year: '',
        category: ''
    }})

    const [showModal, setShowModal] = useState(false)

    const handleInputChange = (event) => {
        const value = event.target.value
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        let info = document.getElementById('info')
        if (formData.isbn !== '')
        {
            formData.isbn = formData.isbn.replace(/[^0-9]/g, "")
            let response = await api.post("/single_book/", formData)
            if (response.data == null)
            {
                info.innerHTML = 'Book not found'
                setShowModal(false)
            }
            else {
                info.innerHTML = ''
                setResponse(response);
                setShowModal(true)
            }
        }
        else if (formData.isbn === '')
        {
            info.innerHTML = 'ISBN field is empty'
        }
        else
        {
            info.innerHTML = 'Error'
        }
    }

    const formSubmit = async () => {
        setShowModal(false)
        setResponse({data: {
            isbn: '',
            title: '',
            author: '',
            publisher: '',
            page_count: '',
            published_year: '',
            category: ''
        }})
        await api.post("/delete_book/", formData)
        setFormData({ isbn: ''});
    }

    return (
        <div className="page-wrapper2"> 
            <Navbar isAuthenticated={isAuthenticated} />
            <div className="container2" style={ { marginTop: "100px"} }>
                <form onSubmit={handleFormSubmit}>
                    <p>Please enter the ISBN of the book you wish to remove</p>
                    <div className="mt-1 mb-3">
                        <input 
                        type='text' 
                        className='form-control' 
                        placeholder='ISBN' 
                        id='isbn' name='isbn' 
                        onChange={handleInputChange} 
                        value={formData.isbn}/>
                    </div>

                    <label style={{color: "white"}} id='info'></label>

                    <button 
                        type='submit' 
                        className='btn btn-primary'
                        style={{float: 'right'}}
                        onClick={console.log('remove book button clicked')} 
                        data-toggle="modal" 
                        data-target="#confirmChoice"
                    >
                        Remove Book
                    </button>
                </form>
            </div>

            { showModal &&
            <div 
                className="modal modal-align" 
                id='confirmChoice' 
                tabIndex={-1} 
                role="diaglog" 
                aria-labelledby="exampleModal" 
                aria-hidden='true'
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModal">Book Removal</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            Are you sure you want to remove the following book? <br/> <br/>
                            ISBN: {response.data.isbn} <br/>
                            Title: {response.data.title} <br/>
                            Author: {response.data.author} <br/>
                            Publisher: {response.data.publisher} <br/>
                            Page Count: {response.data.page_count} <br/>
                            Publication Date: {response.data.published_year} <br/>
                            Category: {response.data.category}
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={formSubmit} >Yes</button>
                        </div>
                    </div>
                </div>
            </div>}
            {/* Footer Section */}
            <footer>
                <p style={{ float: 'left' }}><strong>&copy; Virtual Library 2024, Web Portal for the Home Library</strong></p>
                <p style={{ float: 'right' }}><strong>Team 1.12.2: E.B., H.F., J.K.</strong></p>
            </footer>
        </div>
    );
}