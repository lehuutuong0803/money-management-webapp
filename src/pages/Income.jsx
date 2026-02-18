import { useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";

const Income = () => {
    useUser();
    const [incomeData, setIncomeData] = useState(null);
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null
    });

    const fetchIncomeData = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOME);
            if (response.status === 200 && response.data) {
                setIncomeData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch income data:", error);
            toast.error("Failed to fetch income data. Please try again later.");
        } finally {
            setLoading(false);
        }
    }


    return (
            <Dashboard activeMenu="Income">
                This is Income page
            </Dashboard>
    )
}

export default Income;