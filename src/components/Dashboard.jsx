import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Menubar from "./Menubar";
import Sidebar from "./Sidebar";

const Dashboard = ({children, activeMenu}) => {
    const {user} = useContext(AppContext);

    return (
        <div>
             <Menubar activeMenu={activeMenu}/>
             {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                        {/* Sidebar */}
                        <Sidebar activeMenu={activeMenu}/>
                    </div>
                    <div className="grow mx-5">
                        {/* Main content */}
                       {children}
                    </div>
                </div>
             )}
        </div>
    )
}

export default Dashboard;