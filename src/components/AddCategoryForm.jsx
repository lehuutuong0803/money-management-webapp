import { useEffect, useState } from "react";
import Input from "./Inpux";
import EmojiPickerPopup from "./EmojiPickerPopup";
import { LoaderCircle } from "lucide-react";

const AddCategoryForm = ({initialCategoryData, isEditing, onAddCategory}) => {
    const [loading, setLoading] = useState(false);

    const [category, setCategory] = useState({
        name: "",
        type: "income",
        icon: ""
    });

    const categoryTypeOptions = [
        { value: "income", label: "Income" },
        { value: "expense", label: "Expense" }
    ]

    useEffect(() => {
        if (isEditing && initialCategoryData) {
            setCategory(initialCategoryData);
        }
    }, [isEditing, initialCategoryData]);

    const handleChange = (field, value) => {
        setCategory({...category, [field]: value});
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAddCategory(category);
            
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="p-4">

            <EmojiPickerPopup
                icon={category.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />
            <Input 
                value={category.name}
                onChange={({target}) => handleChange("name", target.value)}
                label="Category Name"
                placeholder="e.g., Freelance, Salary, Food, etc."
                type="text"
            />
            <Input
                label="Category Type"
                value={category.type}
                onChange={({target}) => handleChange("type", target.value)}
                isSelect={true}
                options={categoryTypeOptions}
            />

            <div className="flex justify-end mt-6">
                <button
                    onClick={handleSubmit}
                    type="button"
                    className="bg-purple-800 hover:bg-purple-600 text-white font-semibold py-3 w-full rounded-lg transition-colors 
                            flex items-center justify-center gap-2">
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin"/>
                            {isEditing ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        <>
                           {isEditing ? "Update Category" : "Add Category"}
                        </>
                    )}
                </button>
            </div>

        </div> 
    )
}

export default AddCategoryForm;