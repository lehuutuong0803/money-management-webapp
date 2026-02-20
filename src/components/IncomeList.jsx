import { Download, Mail } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";

const IncomeList = ({ transactions, onDelete }) => {

    return (
        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
        <div className="flex items-center justify-between">
            <h5 className="text-lg font-semibold text-gray-800">Income Sources</h5>
            
            <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:text-purple-600 hover:bg-purple-80 rounded text-sm transition-colors">
                <Mail size={15} /> Email
            </button>
            
            <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:text-purple-600 hover:bg-purple-80 rounded text-sm transition-colors">
                <Download size={15} /> Download
            </button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
            {/* display the incomes */}
            {transactions?.map((income) => (
                <TransactionInfoCard
                    key={income.id}
                    icon={income.icon}
                    title={income.name}
                    date={moment(income.date).format("Do MMM YYYY")}
                    amount={income.amount}
                    type="income"
                    onDelete={() => onDelete(income.id)}
                />
            ))}
        </div>
        </div>
    );
};

export default IncomeList;