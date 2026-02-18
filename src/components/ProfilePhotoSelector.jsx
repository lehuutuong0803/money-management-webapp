import { Trash, Upload, User } from "lucide-react";
import { useRef, useState } from "react";

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);

            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    }

    const handleRemoveImage = (e) => {
        e.preventDefault();
        setImage(null);
        setPreviewUrl(null);
        inputRef.current.value = null;
    }

    const onChooseFile = (e) => {
        e.preventDefault();
        inputRef.current?.click();
    }    

    return (
        <div className="flex justify-center mb-6">
            <input type="file"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />
            {!image ? (
                <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
                    <User className="text-purple-500" size={35}/>
                    <button 
                        className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1" 
                        onClick={onChooseFile}>
                        <Upload size={15} className="text-purple-500"/>
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <img src={previewUrl} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover" />
                    <button className="w-8 h-8 flex items-center justify-center bg-red-800 text-white rounded-full absolute -bottom-1 -right-1" >
                        <Trash size={15} onClick={handleRemoveImage}/>
                    </button>
                </div>
            )}
        </div>
    )
}
export default ProfilePhotoSelector;