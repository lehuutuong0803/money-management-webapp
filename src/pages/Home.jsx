import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";

const Home = () => {
    useUser();
    return (
        <div className="home">
            <Dashboard activeMenu="Dashboard">
                This is Home page
            </Dashboard>
        </div>
    );
}

export default Home;