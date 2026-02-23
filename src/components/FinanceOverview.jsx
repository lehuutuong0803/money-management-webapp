import { addThousandSeparator } from "../util/util";
import CustomPieChart from "./CustomPieChart";

const FinanceOverview = ({totalBalance, totalIncome, totalExpense}) => {
    const COLORS = ["#016630", "#a0090e"];
    const balanceData = [
        {name: "Total Income", amount: totalIncome},
        {name: "Total Expense", amount: totalExpense}

    ]
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Financial Overview</h5>
            </div>
            <CustomPieChart
                data={balanceData}
                label="Total Balance"
                totalAmount={`$${addThousandSeparator(totalBalance)}`}
                colors={COLORS}
                showTextAnchor
            />

        </div>
    )
}

export default FinanceOverview;