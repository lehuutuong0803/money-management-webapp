import { ArrowRight } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";

const Transactions = ({transactions, onMore, type, title}) => {

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">
                    {title}
                </h5>
                <button className="bg-gray-200 hover:bg-purple-600 hover:text-white py-1 px-4 rounded-lg transition-colors 
                            flex items-center justify-center gap-2" onClick={onMore}>
                    More <ArrowRight className="text-base" size={15} />
                </button>
            </div>
            <div className="mt-6">
                {transactions?.slice(0,5).map(item => (
                    <TransactionInfoCard 
                        key={item.id}
                        title={item.name}
                        icon={item.icon}
                        data={moment(item.date).format("Do MMM YYYY")}
                        amount={item.amount}
                        type={type}
                        hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    )
}

export default Transactions;