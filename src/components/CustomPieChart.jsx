import React from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";

const CustomPieChart = ({ data, label, totalAmount, colors }) => {
  const coloredData = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));

  return (
    <div className="relative w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={coloredData}
            dataKey="amount"
            cx="50%"
            cy="50%"
            innerRadius={90}
            outerRadius={120}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-gray-500 text-sm">{label}</p>
        <h2 className="text-2xl font-semibold text-gray-800">
          {totalAmount}
        </h2>
      </div>
      {/* Legend */}
            <div className="flex justify-center gap-6 mt-6">
                {data?.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span className="text-sm text-gray-700">{entry.name}</span>
                    </div>
                ))}
            </div>
    </div>
  );
};

export default CustomPieChart;