import React from "react";
import '../CSS/browse.css'

export const Book = ({ isbn, title, author, publisher, pageCount, publishYear, category}) => {
    return (
        <div className="book"> 
            <h3>{title}</h3>
            <p>Author: {author}</p>
            <p>Pages: {pageCount}</p>
            <p>Genre: {category}</p>
            <p>Publisher: {publisher}</p>
            <p>Publication Date: {publishYear}</p>
            <p>ISBN: {isbn}</p>
        </div>
    )
}