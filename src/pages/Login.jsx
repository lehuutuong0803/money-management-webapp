import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/asset";
import Input from "../components/Inpux";
import axios from "axios";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { AppContext } from "../context/AppContext";
import { LoaderCircle } from "lucide-react";

const Login = () => {  

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {setUser} = useContext(AppContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // validate the form dataa
        if (!email.trim()) {
            setError("Email is required");
            setIsLoading(false);
            return;
        }
        if (!password.trim()) {
            setError("Password is required");
            setIsLoading(false);
            return;
        }
        setError(null);
        // login api call
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
                email,
                password
            });
            const {token, user} =response.data;
            if (token){
                localStorage.setItem("token", token);
                setUser(user);
                navigate("/dashboard");
            }
        } catch (error) {
            setError(error.response ? error.response.data.message : "An error occurred during login. Please try again.");
            console.error("Login error: ", error.response ? error.response.data : error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const navigate = useNavigate();
    return (
                <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/*Backgroung immage with blur*/}
            <img src={assets.login_bg} alt="Backgorund" className="absolute insert-0 h-full w-full object-cover filter blur-[1px]"/>

            <div className="relative z-10 w-full max-w-lg px-6"> 
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-semibold text-center text-black mb-2">Welcome Back</h3>
                    <p className="text-sm text-slate-700 text-center mb-8"> Please enter your details to login</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                            <Input 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email Adress"
                                placeholder="Enter your Email"
                                type="text"
                            />
                            <Input 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password"
                                placeholder="Enter your Password"
                                type="password"
                            />
                        {
                            error && <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">{error}</p>
                        }
                        <button disabled={isLoading} className={`bg-purple-800 hover:bg-purple-600 text-white font-semibold py-3 w-full rounded-lg transition-colors 
                            flex items-center justify-center gap-2 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`} type="submit">
                            {
                                isLoading ? (
                                    <>
                                        <LoaderCircle className="animate-spin w-5 h-5"/>
                                        Logging in...
                                    </>
                                ) : "Login"
                            }
                        </button>
                        <p className="text-sm text-slate-800 text-center mt-6">
                            Don't have an account? 
                            <button className="text-blue-600 hover:underline" onClick={() => navigate("/signup")}>Sign Up</button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;