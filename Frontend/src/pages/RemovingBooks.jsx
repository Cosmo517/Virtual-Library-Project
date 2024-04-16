import { useState } from "react";
import { Navbar } from "../../Components/Navbar";
import { Button, Modal } from "bootstrap";

export const RemovingBooks = () => {
    const [formData, setFormData] = useState({
        isbn: ''
    })

    const handleInputChange = (event) => {
        const value = event.target.value
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    const handleFormSubmit = () => {
        event.preventDefault()
        // get api call here
    }

    const submitForm = () => {
        // actually delete book
        console.log('book deleted')
        setFormData({ isbn:''})
    }



    return (
        <>
            <Navbar/>
            <div className="container">
                <form onSubmit={handleFormSubmit}>
                    <div className="mt-1 mb-3">
                        <input type='text' className='form-control' placeholder='ISBN' id='isbn' name='isbn' onChange={handleInputChange} value={formData.isbn}/>
                    </div>

                    <button type='button' className='btn btn-primary' data-toggle="modal" data-target="#confirmChoice">
                        Remove Book
                    </button>
                </form>
            </div>

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
                            Are you sure you want to remove the book?
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={submitForm}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}