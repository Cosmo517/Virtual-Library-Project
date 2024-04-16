import { Navbar } from "../../Components/Navbar";
import Cookies from "js-cookie";

export const UserSettings = () => {

    const logout = () => {
        Cookies.remove('token')
        window.location.href='/'
    }
    
    return (
        <>
            <Navbar/>
            <div className="container">
                <h3>User Settings:</h3>
                <button className="btn btn-primary" onClick={logout}>Logout</button>
            </div>
        </>
    );
}