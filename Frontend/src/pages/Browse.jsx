import { Navbar } from "../../Components/Navbar";
import { BookList } from "../../Components/BookList";

export const Browse = () => {

    return (
        <>
            <Navbar/>
            <div className="container mt-4 mb-4">
                <BookList/>
            </div>
        </>
    );
}
