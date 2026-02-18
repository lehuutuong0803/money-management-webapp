import { useNavigate } from "react-router-dom";
import { assets } from "../assets/asset";
import { useState } from "react";
import Input from "../components/Inpux";
import { validateEmail } from "../util/validation";
import axios from "axios";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { LoaderCircle } from "lucide-react";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import uploadProfileImage from "../util/uploadProfileImage";
import toast from "react-hot-toast";

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        // prevent reloading the entire webpage
        e.preventDefault();
        let profileImageUrl = "";
        setIsLoading(true);

        // validate the form data
        if (!fullName.trim()) {
            setError("Full Name is required");
            setIsLoading(false);
            return;
        }
        if (!validateEmail(email)) {
            setError("Email is required");
            setIsLoading(false);
            return;
        }
        if (!password.trim()) {
            setError("Password is required");
            setIsLoading(false);
            return;
        }
        setError("");

        // signup api call
        try {
            // upload image if present
            if (profileImage) {
                const imageUrl = await uploadProfileImage(profileImage);
                console.log("Uploaded image URL: ", imageUrl);
                profileImageUrl = imageUrl || ""; // Fallback to empty string if upload fails


            }
            const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
                fullName,
                email,
                password, 
                profileImageUrl
            });
            if (response.status === 201) {
                toast.success("Account created successfully! Please login to continue.");
                navigate("/login?"); 
            }
        } catch (error) {
            toast.error("Failed to create account. Please try again.");
            setError(error.response ? error.response.data.message : "An error occurred during signup. Please try again.");
            console.error("Signup error: ", error.response ? error.response.data : error.message);
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/*Backgroung immage with blur*/}
            <img src={assets.login_bg} alt="Backgorund" className="absolute insert-0 h-full w-full object-cover filter blur-[1px]"/>

            <div className="relative z-10 w-full max-w-lg px-6"> 
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-semibold text-center text-black mb-2">Create An Account</h3>
                    <p className="text-sm text-slate-700 text-center mb-8"> Start tracking your spending by joining with us</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex justify-center mb-6">
                            <ProfilePhotoSelector 
                                image={profileImage}
                                setImage={setProfileImage}
                            />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <Input 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                label="Full Name"
                                placeholder="Enter your Full Name"
                                type="text"
                            /> 
                            <Input 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email Adress"
                                placeholder="Enter your Email"
                                type="text"
                            />
                            <div className="col-span-2">
                                <Input 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password"
                                placeholder="Enter your Password"
                                type="password"
                                 />
                            </div> 
                        </div>
                        {
                            error && <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">{error}</p>
                        }
                        <button disabled={isLoading} className={`bg-purple-800 hover:bg-purple-600 text-white font-semibold py-3 w-full rounded-lg transition-colors 
                            flex items-center justify-center gap-2 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`} type="submit">
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-5 h-5" />
                                    <span className="ml-2">Signing Up...</span>
                                </>
                            ) :
                                "Sign Up"

                            }
                        </button>
                        <p className="text-sm text-slate-800 text-center mt-6">
                            Already have an account? 
                            <button className="text-blue-600 hover:underline" onClick={() => navigate("/login")}>Login</button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup;