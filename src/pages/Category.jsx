import { Plus } from "lucide-react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import CategoryList from "../components/CategoryList";
import axiosConfig from "../util/axiosConfig";
import toast from "react-hot-toast";
import { use, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import Modal from "../components/Modal";
import AddCategoryForm from "../components/AddCategoryForm";

const Category = () => {
    useUser();
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    const fetchCategoryDetails = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200 && response.data) {
                console.log("Fetched category details:", response.data);
                setCategoryData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch category details:", error);
            toast.error("Failed to fetch category details. Please try again later.");
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchCategoryDetails();
    }, [])

    const handleAddCategory = (category) => {
        console.log("Category added successfully: ", category);
        
    }

    return (
            <Dashboard activeMenu="Category">
                <div className="my-5-mx-auto">
                    {/* <h1 Add button to create new category */}
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-2xl font-semibold">All Categories</h2>
                        <button 
                            onClick={() => setOpenAddCategoryModal(true)}
                            className="add-btn flex items-center gap-2 bg-green-200 py-2 px-4 rounded-lg transition-colors hover:bg-green-500 text-green-800 hover:text-white">
                            <Plus size={15}/>
                            Add Category
                        </button>
                    </div>

                    {/* Category List */}
                    <CategoryList 
                        categories={categoryData}
                    />

                    {/* Adding category modal */}
                    <Modal
                        isOpen={openAddCategoryModal}
                        onClose={() => setOpenAddCategoryModal(false)}
                        title="Add New Category">
                        
                        <AddCategoryForm
                            onAddCategory={handleAddCategory}
                        />

                    </Modal>

                    {/* Updating category modal */}
                </div>
            </Dashboard>
    )
}

export default Category;