import { LoaderCircle } from "lucide-react";
import { useState } from "react";

const DeleteAlert = ({content, onDelete}) => {
    const [loading, setLoadding] = useState(false);

    const handleDelete = async () => {
        setLoadding(true);
        try {
            await onDelete();
        } finally {
            setLoadding(false);
        }
    }
    return (
        <div>
            <p className="text-sm">
                {content}
            </p>
            <div className="flex justify-end mt-6">
                <button 
                    onClick={handleDelete}
                    type="button"
                    className="bg-purple-800 hover:bg-purple-600 text-white font-semibold py-3 w-full rounded-lg transition-colors 
                            flex items-center justify-center gap-2">
                        {loading ? (
                            <>
                                <LoaderCircle className="h-4 w-4 aniated-spin"/>
                                Deleting ...
                            </>
                        ) : (
                            <>
                                Delete
                            </>
                        )}
                </button>
            </div>
        </div>
    )
}

export default DeleteAlert;