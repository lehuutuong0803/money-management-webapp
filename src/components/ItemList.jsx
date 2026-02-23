import { Download, LoaderCircle, Mail } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";
import { useState } from "react";

const ItemList = ({ transactions, onDelete, onDownload, onEmail, isIncome }) => {
    const [loading, setLoading] = useState(false);
    const handleOnDelete = (id) => {
        onDelete(id);
    }

    const handleEmail = async () => {
        setLoading(true)
        try {
            await onEmail();
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async () => {
        setLoading(true)
        try {
            await onDownload();
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
        <div className="flex items-center justify-between">
            <h5 className="text-lg font-semibold text-gray-800">{isIncome ? <>Income Sources</> : <>Expense Sources</>}</h5>
            
            <div className="flex items-center gap-2">
            <button 
                disabled={loading}
                onClick={handleEmail}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:text-purple-600 hover:bg-purple-80 rounded text-sm transition-colors">
                {loading ? (
                    <>
                        <LoaderCircle className="w-4 h-4 animate-spin"/>
                        Emailing...
                    </>
                ) : (
                    <>
                        <Mail size={15} className="text-base"/> Email
                    </>
                )}
            </button>
            
            <button
                disabled={loading}
                onClick={handleDownload}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:text-purple-600 hover:bg-purple-80 rounded text-sm transition-colors">
                {loading ? (
                    <>
                        <LoaderCircle className="w-4 h-4 animate-spin"/>
                        Downloading...
                    </>
                ) : (
                    <>
                        <Download size={15} className="text-base"/> Download
                    </>
                )}
            </button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
            {/* display the incomes */}
            {transactions?.map((item) => (
                <TransactionInfoCard
                    key={item.id}
                    icon={item.icon}
                    title={item.name}
                    date={moment(item.date).format("Do MMM YYYY")}
                    amount={item.amount}
                    type={isIncome ? "income" : "expense"}
                    onDelete={() => handleOnDelete(item.id)}
                />
            ))}
        </div>
        </div>
    );
};

export default ItemList;