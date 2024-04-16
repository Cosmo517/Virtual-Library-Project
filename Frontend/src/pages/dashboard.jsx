import { Navbar } from "../../Components/Navbar";
import '../CSS/dashboard_styling.css'

export const Dashboard = () => {
    return (
        <>
            <Navbar/>
            <div className="container_edited">
                <div className="row">
                    <div className="dashboard_title">
                        <h1>Welcome to your own Virtual Bookshelf</h1>
                        <h2>Web portal for the home library</h2>
                    </div>
                    
                        <div className="dashboard_description">
                            <p>
                                Welcome to your Virtual Booksheld, where you can explore and manage your personal library collection.
                                This portal is designed to help you browse through a collection of books and discover new ones.
                                Browse through the collection, search for specfic titles or authors, and even rate your favorite reads.
                            </p>
                            <p>
                                Whether you're an avid reader or just starting, Virtual Bookshelf is here to enhance your experience!
                            </p>
                    </div>
                </div>
            </div>
        </>
    );
}