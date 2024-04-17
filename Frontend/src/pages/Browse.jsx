import { useEffect, useState } from "react";
import { Navbar } from "../../Components/Navbar";
import api from '../api'

export const Browse = () => {
    const [allBooks, setAllBooks] = useState({})

    useEffect(() => {
        const grab_books = async () => {
            const booksResponse = await api.get("/books/")
            setAllBooks(booksResponse)
            console.log(booksResponse)
        }

        grab_books()
    }, [])
    return (
        <>
            <Navbar/>
            <h1>Browsing!!!!!</h1>
        </>
    );
}
