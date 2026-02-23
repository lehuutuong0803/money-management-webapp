import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import Overview from "../components/Overview";
import Modal from "../components/Modal";
import AddIncomeAndExpenseForm from "../components/AddIncomeAndExpenseForm";
import ItemList from "../components/ItemList";
import toast from "react-hot-toast";
import DeleteAlert from "../components/DeleteAlert";

const Expense = () => {
    useUser();
    const [expenseData, setExpenseData] = useState(null);
    const [categories, setCategories] = useState(null);
    const [openAddFormm, setOpenAddForm] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({show: false, data: null});


    const fetchExpenseData = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
            if (response.status === 200 && response.data) {
                setExpenseData(response.data)
            }
        } catch (error) {
            console.log("Error fetching Expense Data", error);
        }
    }

    const fetchExpenseCategoryData = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
            console.log("Category - expense: ", response);
            if (response.status === 200 && response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.log("Error fetching Category Data", error);
        }
    }

     // save expense details
    const handleAddIncome = async (expense) => {
        const {name, amount, date, icon, categoryId} = expense;

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
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE,{
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId
            });

            if (response.status === 201) {
                toast.success("Adding the expense successfully!")
                setOpenAddForm(false);
                fetchExpenseData();
                fetchExpenseCategoryData();

            }
        } catch (error) {
            console.log("Error adding expense", error)
            toast.error(error.response?.data?.message || "Failed to add expense data. Please try again later.");
        }

    }

    // Delete income details
    const handleDeleteIncome = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
            setOpenDeleteAlert({show: false, data: null})
            toast.success("Expense deleted successfully");
            fetchExpenseData();

        } catch (error) {
            console.log("Error deleteing expense". error);
            toast.error(error.response?.data?.message || "Failed to delete expense data. Please try again later.");
        } 
    }

    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD, {responseType: 'blob'});
            let fileName = "Expense .details.xlsx";
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

    const handleEmailExpenseDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE);
            if (response.status === 200) {
                toast.success("Income details emailed successfully!");
            }
        } catch (error) {
            console.log("Error emailing income details", error);
            toast.error(error.response?.data?.message || "Failed to email income data. Please try again later.");
        }
    }

    useEffect(() => {
        fetchExpenseData();
        fetchExpenseCategoryData();
    },[])

    return (
            <Dashboard activeMenu="Expense">
                <div className="my-5 mx-auto">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            {/* overview for income with line chart */}
                            <Overview
                                onAddEvent={() => setOpenAddForm(true)}
                                transactions={expenseData}
                            />
                        </div>
                        <ItemList
                            transactions={expenseData} 
                            onDelete={(id) => {
                                setOpenDeleteAlert({show: true, data: id})
                            }}
                            onDownload={handleDownloadExpenseDetails}
                            onEmail={handleEmailExpenseDetails}
                        />

                        {/* Add income model */}
                        <Modal
                            isOpen={openAddFormm}
                            onClose={() => setOpenAddForm(false)}
                            title="Add Income"
                        >
                            <AddIncomeAndExpenseForm
                                onAddIncome={(income) => handleAddIncome(income)}
                                categories={categories}
                            ></AddIncomeAndExpenseForm>
                        </Modal>

                        {/* Delete income model */}
                        <Modal
                            isOpen={openDeleteAlert.show}
                            onClose={() => setOpenDeleteAlert({show: false, data: null})}
                            title="Delete Income">
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

export default Expense;