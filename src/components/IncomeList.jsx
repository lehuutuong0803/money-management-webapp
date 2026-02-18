import { Download, Mail } from "lucide-react";

const IncomeList = ({ transactions }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold text-gray-800">Income Sources</h5>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors">
            <Mail size={15} /> Email
          </button>
          
          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
            <Download size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomeList;