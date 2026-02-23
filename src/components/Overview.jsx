import { useEffect, useState } from "react";
import { prepareLineChartData } from "../util/util";
import CustomeLineChart from "./CustomeLineChart";
import { Plus } from "lucide-react";

const Overview = ({transactions, onAddEvent, isIncome}) => {
    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        const result = prepareLineChartData(transactions);
        setChartData(result);
        return () => {}
    }, [transactions])

    return (
        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
            <div className="flex items-center justify-between">
                 <div className="mb-6">
                    <h5 className="text-2xl font-semibold text-gray-800">
                        {isIncome ? <>Income Overview</> : <>Expense Overview</>}
                    </h5>
                    <p className="text-gray-500 text-sm mt-1">
                        {isIncome ? <>Track your earnings over time and analyze your income trends.</> :
                            <>Track your expenses over time and analyze your expenses trends.</>
                        }
                    </p>
                </div>
                <button 
                    onClick={onAddEvent}
                    className="add-btn flex items-center gap-2 bg-green-200 py-2 px-4 rounded-lg transition-colors hover:bg-green-500 text-green-800 hover:text-white">
                    <Plus size={15}/>
                    {isIncome ? <>Add Income</> : <>Add Expense</>}
                </button>
            </div>
            <div className="mt-5">
                {/* create line chart */}
                <CustomeLineChart data = {chartData}/>
            </div>
        </div>
    )
}

export default Overview;