import { Navbar } from "../../Components/Navbar";
import { BookList } from "../../Components/BookList";
import { useState, useEffect } from "react";
import api from "../api";
import '../CSS/browse.css'


export const Browse = () => {
    const [books, setBooks] = useState([])

    const [formData, setFormData] = useState({
        search: '',
        searchType: 'ISBN'
    })

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        let filtered_books = await api.post('/filter/', formData)
        setBooks(Array.from(filtered_books.data))
    };

    const handleInputChange = (event) => {
        const value = event.target.value
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    useEffect(() => {
        const grab_books = async () => {
            const booksResponse = await api.get("/books/")
            if (booksResponse.data !== undefined)
            {
                setBooks(Array.from(booksResponse.data))
            }
        }

        grab_books()
    }, [])

    return (
        <>
            <Navbar/>
            <div className="row-resize">
                <div className="filter-container">
                    <h5 className="center-text">Filters</h5>
                    <input type="radio" id='test' name="test" value='test'/>
                </div>

            <div className="mt-4 mb-4" style={{ marginTop: '150px' }}>
                <form onSubmit={handleFormSubmit} style={{ marginTop: '150px', marginLeft: '25px' }}>
                    <div className="row mb-3 row_resize">
                        <select className="form-select" id="search-bar-type" name="searchType" onChange={handleInputChange} value={formData.searchType}>
                            <option value='ISBN'>ISBN</option>
                            <option value='Title'>Title</option>
                            <option value='Author'>Author</option>
                            <option value='Genre'>Genre</option>
                        </select>

                            <input type='text' className='form-control text_resize' placeholder='Search' id='search-bar' name='search'  onChange={handleInputChange} value={formData.search}/>
                            
                            <button type='submit' className='btn btn-primary search_button'>
                                Search
                            </button>
                        </div>
                    </form>
                    
                    <BookList bookList={books}/>
                </div>
            </div>
        </>
    );
}
