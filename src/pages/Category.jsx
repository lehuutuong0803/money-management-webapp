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

    const handleAddCategory = async (category) => {
        const {name, type, icon} = category;

        // check if the category already exists
        const existingCategory = isCategoryNameExisting(category.name);

        if (existingCategory) {
            toast.error("Category with the same name already exists.");
            return;
        }

        if (!name.trim()) {
            toast.error("Category name cannot be empty.");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {
                name,
                type,
                icon
            })
            if (response.status === 201 && response.data) {
                toast.success("Category added successfully!");
                setOpenAddCategoryModal(false);
                fetchCategoryDetails();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add category. Please try again later.");
            console.error("Error adding category:", error);
        }

        
    }

    const handleEditCategory = (category) => {
        setOpenEditCategoryModal(true);
        setSelectedCategory(category);

    }

    const isCategoryNameExisting = (name) => {
        return categoryData.some((item) => {
            return item.name.trim().toLowerCase() === name.trim().toLowerCase();
        })
    }

    const handleUpdateCategory = async (updatedCategory) => {

        try {
            
            if (!updatedCategory.name.trim()) {
                toast.error("Category name cannot be empty.");
                return;
            }

            if (!updatedCategory.id.trim()) {
                toast.error("Category ID is missing for update .");
                return;
            }

            const existingCategory = isCategoryNameExisting(updatedCategory.name);
            if (existingCategory){
                toast.error("Category with the same name already exists.");
                return;
            }

            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(updatedCategory.id), updatedCategory);
            if (response.status === 200 && response.data) {
                toast.success("Category updated successfully!");
                setOpenEditCategoryModal(false);
                fetchCategoryDetails();
                setSelectedCategory(null);
            } else {
                toast.error("Failed to update category. Please try again later.");
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update category. Please try again later.");
            console.error("Error updating category:", error);
        }
    }

    return (
            <Dashboard activeMenu="Category">
                <div className="my-5-mx-auto">
                    {/* <h1 Add button to create new category */}
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-2xl font-semibold">All Categories</h2>
                        <button 
                            onClick={() => setOpenAddCategoryModal(true)}
                            className="add-btn mt-3 flex items-center gap-2 bg-green-200 py-2 px-4 rounded-lg transition-colors hover:bg-green-500 text-green-800 hover:text-white">
                            <Plus size={15}/>
                            Add Category
                        </button>
                    </div>

                    {/* Category List */}
                    <CategoryList 
                        categories={categoryData}
                        onEditCategory={handleEditCategory}
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
                    <Modal
                        isOpen={openEditCategoryModal}
                        onClose={() => {
                            setOpenEditCategoryModal(false);
                            setSelectedCategory(null);
                        }}
                        title="Edit Category">
                        
                        <AddCategoryForm
                            initialCategoryData={selectedCategory}
                            isEditing={true}
                            onAddCategory={handleUpdateCategory}
                        />

                    </Modal>
                    
                </div>
            </Dashboard>
    )
}

export default Category;