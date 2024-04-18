import { Navbar } from "../../Components/Navbar";
import { BookList } from "../../Components/BookList";
import { useState } from "react";

export const Browse = () => {
    const [formData, setFormData] = useState({
        search: ''
    })

    const handleFormSubmit = async (event) => {
        event.preventDefault();
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
            <Navbar/>

            <div className="container mt-4 mb-4">
                <form onSubmit={handleFormSubmit}>
                    <div className="row mb-3">
                        <input type='text' className='form-control text_resize' placeholder='Search' id='username' name='username'  onChange={handleInputChange} value={formData.username}/>
                        
                        <button type='submit' className='btn btn-primary search_button'>
                            Search
                        </button>
                    </div>
                </form>
                <BookList/>
            </div>
        </>
    );
}
