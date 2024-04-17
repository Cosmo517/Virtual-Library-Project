import { useState } from "react";
import { Navbar } from "../../Components/Navbar";
import api from "../api";

export const RemovingBooks = () => {
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

    const handleInputChange = (event) => {
        const value = event.target.value
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        if (formData.isbn !== '')
        {
            formData.isbn = formData.isbn.replace(/[^0-9]/g, "")    
            setResponse(await api.post("/single_book/", formData));
        }
    }

    const formSubmit = async () => {
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
        <>
            <Navbar/>
            <div className="container">
                <form onSubmit={handleFormSubmit}>
                    <div className="mt-1 mb-3">
                        <input type='text' className='form-control' placeholder='ISBN' id='isbn' name='isbn' onChange={handleInputChange} value={formData.isbn}/>
                    </div>

                    <button type='submit' className='btn btn-primary' data-toggle="modal" data-target="#confirmChoice">
                        Remove Book
                    </button>
                </form>
            </div>

            { (response.data !== null && response.data.isbn !== '') &&
            <div className="modal" id='confirmChoice' tabIndex={-1} role="diaglog" aria-labelledby="exampleModal" aria-hidden='true'>
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
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={formSubmit}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    );
}