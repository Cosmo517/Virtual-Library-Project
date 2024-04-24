import { Navbar } from "../Components/Navbar";
import { BookList } from "../Components/BookList";
import { useState, useEffect } from "react";
import api from "../api";
import '../CSS/browse.css'


export const Browse = () => {    
    const [books, setBooks] = useState([])

    const [formData, setFormData] = useState({
        search: '',
        searchType: 'Title'
    })

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleFilter();
    };

    const handleInputChange = (event) => {
        const value = event.target.value
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    // Handle the different filtering options
    const handleFilter = async () => {
        let titleSelectedZA = false;
        try {
            // try to grab the titleSelector element to see if its checked (ZA)
            let titleSelectorZA = document.getElementById('title-za')
            titleSelectedZA = titleSelectorZA.checked;
        }
        catch (err)
        {
            console.log('error!')
        }
        // grab the following elements and set basic values
        let yearBefore = document.getElementById('yearBefore').value == '' ? 0 : document.getElementById('yearBefore').value
        let yearAfter = document.getElementById('yearAfter').value == '' ? 9999 : document.getElementById('yearAfter').value
        let searchBar = document.getElementById('search-bar').value

        // create a dictionary for the request
        let data = {'search': searchBar,
                    'searchType': formData.searchType,
                    'ZA': titleSelectedZA,
                    'yearBefore': parseInt(yearBefore),
                    'yearAfter': parseInt(yearAfter) }   
        // send request to backend
        let filtered_books = await api.post('/filter/', data)
        // turn the response dictionary into an array
        setBooks(Array.from(filtered_books.data))
        console.log(filtered_books)
    }

    // On refresh grab the books from the database
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
        <div className="page-wrapper9">
            <Navbar/>
            <div className="row-resize">
                <div className="filter-container">
                    <h5 className="center-text">Filters</h5>

                    <div className="ml-2">
                        <input type="radio" id='title-az' name="filters" value='AZ'/>
                        <label style={{marginLeft: '4px'}} htmlFor='title-az'>Sort by Title A-Z</label> <br/>
                        <input type="radio" id='title-za' name="filters" value='ZA'/>
                        <label style={{marginLeft: '4px'}} htmlFor='title-za'>Sort by Title Z-A</label> <br/>
                        <label>Published between</label> <br/>
                        <input style={{ marginRight: '5px'  , width: '80px'}} id="yearBefore" type="number"/>
                        <label>and</label>
                        <input style={{ marginLeft: '5px', width: '80px'}} id='yearAfter' type="number"/>
                    </div>
                    <button className="btn btn-primary1 mr-2 mt-3" style={{ float: 'right'}} onClick={handleFilter}>Apply</button>
                </div>
            </div>

            <div className="books-container mt-4 mb-4">
                <form onSubmit={handleFormSubmit}>
                    <div className="row mb-3 row_resize">
                        <select className="form-select" id="search-bar-type" name="searchType" onChange={handleInputChange} value={formData.searchType}>
                            <option value='Title' defaultValue='Title'>Title</option>
                            <option value='Author'>Author</option>
                            <option value='Genre'>Genre</option>
                            <option value='ISBN'>ISBN</option>
                        </select>

                            <input type='text' className='form-control text_resize' placeholder='Search' id='search-bar' name='search'  onChange={handleInputChange} value={formData.search}/>
                            
                            <button type='submit' className='btn btn-primary2 search_button'>
                                Search
                            </button>
                        </div>
                    </form>
                    <BookList bookList={books}/>
                </div>
            {/* Footer Section */}
            <footer>
                <p style={{ float: 'left' }}><strong>&copy; Virtual Library 2024, Web Portal for the Home Library</strong></p>
                <p style={{ float: 'right' }}><strong>Team 1.12.2: E.B., H.F., J.K.</strong></p>
            </footer>
        </div>
    );
}
