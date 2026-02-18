import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";

const Filter = () => {
    useUser(); 
    return (
            <Dashboard activeMenu="Filters">
                This is Filter page
            </Dashboard>
    );
}

export default Filter;