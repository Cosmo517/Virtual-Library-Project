import { Navbar } from "../../Components/Navbar";
import '../CSS/dashboard_styling.css'

export const Dashboard = () => {
    return (
        <>
            <Navbar/>
            <div className="container_edited">
                <div className="row">
                    <div className="dashboard_long_facts dashboard_long_fact_1">
                        <h1>Fact 1!</h1>
                    </div>

                    <div className="column">
                        <div className="dashboard_short_facts">
                            <h1>Fact 2!</h1>
                        </div>

                        <div className="dashboard_short_facts">
                            <h1>Fact 3!</h1>
                        </div>
                    </div>

                    <div className="dashboard_long_facts dashboard_long_fact_4">
                        <h1>Fact 4!</h1>
                    </div>
                </div>
            </div>
        </>
    );
}
