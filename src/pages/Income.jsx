import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";

const Income = () => {
    useUser();
    return (
            <Dashboard activeMenu="Income">
                This is Income page
            </Dashboard>
    )
}

export default Income;