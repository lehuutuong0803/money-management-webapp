import { use, useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import axiosConfig from "../util/axiosConfig";
import ItemList from "../components/ItemList";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";
import AddIncomeAndExpenseForm from "../components/AddIncomeAndExpenseForm";
import DeleteAlert from "../components/DeleteAlert";
import Overview from "../components/Overview";

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
                console.log("Income data", response.data);
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

    // Delete income details
    const handleDeleteIncome = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
            setOpenDeleteAlert({show: false, data: null})
            toast.success("Income deleted successfully");
            fetchIncomeData();

        } catch (error) {
            console.log("Error deleteing income". error);
            toast.error(error.response?.data?.message || "Failed to delete income data. Please try again later.");
        } 
    }

    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD, {responseType: 'blob'});
            let fileName = "income.details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Download income details successfully!")

        } catch(error) {
            console.log("Error when downloading the excel: ", error);
            toast.error(error.response?.data?.message || "Failed to download income data. Please try again later.");
        }
    }

    const handleEmailIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_INCOME);
            if (response.status === 200) {
                toast.success("Income details emailed successfully!");
            }
        } catch (error) {
            console.log("Error emailing income details", error);
            toast.error(error.response?.data?.message || "Failed to email income data. Please try again later.");
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
                            <Overview
                                isIncome={true}
                                onAddEvent={() => setOpenAddIncomeModal(true)}
                                transactions={incomeData}
                            />
                        </div>
                        <ItemList 
                            isIncome={true}
                            transactions={incomeData} 
                            onDelete={(id) => {
                                setOpenDeleteAlert({show: true, data: id})
                            }}
                            onDownload={handleDownloadIncomeDetails}
                            onEmail={handleEmailIncomeDetails}
                        />
                        {/* Add income model */}
                        <Modal
                            isOpen={openAddIncomeModal}
                            onClose={() => setOpenAddIncomeModal(false)}
                            title="Add Income"
                        >
                            <AddIncomeAndExpenseForm
                                isIncome={true}
                                onAddIncome={(income) => handleAddIncome(income)}
                                categories={categories}
                            ></AddIncomeAndExpenseForm>
                        </Modal>

                        {/* Delete income model */}
                        <Modal
                            isOpen={openDeleteAlert.show}
                            onClose={() => setOpenDeleteAlert({show: false, data: null})}
                            title="Delete Income"
                        >
                            <DeleteAlert 
                                content="Are you sure want to delete this income details"
                                onDelete={() => handleDeleteIncome(openDeleteAlert.data)}
                            />
                        </Modal>

                    </div>
                </div>
            </Dashboard>
    )
}

export default Income;