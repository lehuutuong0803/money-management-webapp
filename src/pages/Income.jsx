import { use, useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import axiosConfig from "../util/axiosConfig";
import IncomeList from "../components/IncomeList";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";
import AddIncomeForm from "../components/AddIncomeForm";

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

    // fetch Income details from API
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
            toast.error(error.response?.data?.message || "Failed to fetch income data. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    // fetch categories for income
    const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
            if (response.status === 200) {
                console.log("Income category", response.data);
                setCategories(response.data)
            }
        } catch (error) {
            console.log("Faile to fetch income categories: ", error)
            toast.error(error.response?.data?.message || "Failed to fetch income data. Please try again later.");
        }
    }

    // save income details
    const handleAddIncome = async (income) => {
        const {name, amount, date, icon, categoryId} = income;

        // validation
        if (!name.trim()) {
            toast.error("Please enter a name");
            return;
        }

        if (!amount.trim() || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be a valid number greater than 0.")
            return;
        }
        
        if (!date) {
            toast.error("Please select a date")
            return
        }

        const today = new Date().toISOString().split("T")[0];
        if (date > today) {
            toast.error("Date cannot be in the future")
            return;
        }

        if (!categoryId) {
            toast.error("Please select a category")
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME,{
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId
            });

            if (response.status === 201) {
                toast.success("Adding the income successfully!")
                setOpenAddIncomeModal(false);
                fetchIncomeData();
                fetchIncomeCategories();

            }
        } catch (error) {
            console.log("Error adding income", error)
            toast.error(error.response?.data?.message || "Failed to add income data. Please try again later.");
        }

    }

    useEffect(() => {
        fetchIncomeData();
        fetchIncomeCategories();
    }, []);

    return (
            <Dashboard activeMenu="Income">
                <div className="my-5 mx-auto">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            {/* overview for income with line chart */}
                            <button 
                                onClick={() => setOpenAddIncomeModal(true)}
                                className="add-btn flex items-center gap-2 bg-green-200 py-2 px-4 rounded-lg transition-colors hover:bg-green-500 text-green-800 hover:text-white">
                                <Plus size={15}/>
                                Add Income
                            </button>
                        </div>
                        <IncomeList 
                            transactions={incomeData} 
                            onDelete={(id) => setOpenDeleteAlert({show: true, data: id})} 
                        />
                        {/* Add income model */}
                        <Modal
                            isOpen={openAddIncomeModal}
                            onClose={() => setOpenAddIncomeModal(false)}
                            title="Add Income"
                        >
                            <AddIncomeForm
                                onAddIncome={(income) => handleAddIncome(income)}
                                categories={categories}
                            ></AddIncomeForm>
                        </Modal>

                        {/* Delete income model */}
                        <Modal
                            isOPen={openDeleteAlert.show}
                            onClose={() => setOpenDeleteAlert({show: false, data: null})}
                            title="Delete Income"
                        />

                    </div>
                </div>
            </Dashboard>
    )
}

export default Income;