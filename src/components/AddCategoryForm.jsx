import { useState } from "react";
import Input from "./Inpux";
import EmojiPickerPopup from "./EmojiPickerPopup";

const AddCategoryForm = ({onAddCategory}) => {
    const [category, setCategory] = useState({
        name: "",
        type: "income",
        icon: ""
    });

    const categoryTypeOptions = [
        { value: "income", label: "Income" },
        { value: "expense", label: "Expense" }
    ]

    const handleChange = (field, value) => {
        setCategory({...category, [field]: value});
    }

    const handleSubmit = () => {
        onAddCategory(category);
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
                    Add Category
                </button>
            </div>

        </div> 
    )
}

export default AddCategoryForm;