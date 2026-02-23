import React, { useState, useRef } from 'react';

const CustomeLineChart = ({ data }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const svgRef = useRef(null);

    // Chart dimensions
    const width = 800;
    const height = 400;
    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    if (!data || data.length === 0) {
        return <div className="text-gray-500">No data available</div>;
    }

    // Find min and max values for scaling
    const amounts = data.map(d => d.totalAmount);
    const maxAmount = Math.max(...amounts);
    const minAmount = Math.min(...amounts);
    const amountRange = maxAmount - minAmount;

    // Scale functions
    const scaleX = (index) => {
        return padding.left + (index / (data.length - 1)) * chartWidth;
    };

    const scaleY = (amount) => {
        const normalized = (amount - minAmount) / amountRange;
        return padding.top + chartHeight - (normalized * chartHeight);
    };

    // Generate smooth curved path using cubic bezier curves
    const generateSmoothPath = (points) => {
        if (points.length < 2) return '';

        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];
            
            // Control points for smooth curve
            const controlPointX = (current.x + next.x) / 2;
            
            // Use cubic bezier curve for smooth transitions
            path += ` C ${controlPointX} ${current.y}, ${controlPointX} ${next.y}, ${next.x} ${next.y}`;
        }

        return path;
    };

    // Create points array
    const points = data.map((point, index) => ({
        x: scaleX(index),
        y: scaleY(point.totalAmount),
        data: point,
        index
    }));

    // Generate smooth curved path
    const linePath = generateSmoothPath(points);

    // Generate path for the gradient area
    const areaPath = 
        linePath + 
        ` L ${scaleX(data.length - 1)} ${padding.top + chartHeight}` +
        ` L ${scaleX(0)} ${padding.top + chartHeight} Z`;

    // Y-axis ticks
    const yTicks = 5;
    const yTickValues = Array.from({ length: yTicks }, (_, i) => {
        return minAmount + (amountRange / (yTicks - 1)) * i;
    });

    // Format currency
    const formatCurrency = (amount) => {
        return '$' + amount.toLocaleString();
    };

    // Handle mouse move for tooltip - now tracks mouse position
    const handleMouseMove = (e, point) => {
        const svgRect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;
        
        setHoveredPoint(point.data);
        setTooltipPosition({ 
            x: mouseX, 
            y: mouseY - 20
        });
    };

    const handleMouseLeave = () => {
        setHoveredPoint(null);
    };

    return (
        <div className="bg-white rounded-xl p-6">

            <div className="relative">
                <svg 
                    ref={svgRef}
                    width="100%" 
                    height={height} 
                    viewBox={`0 0 ${width} ${height}`}
                    className="overflow-visible"
                >
                    {/* Grid lines */}
                    {yTickValues.map((tick, i) => (
                        <line
                            key={i}
                            x1={padding.left}
                            y1={scaleY(tick)}
                            x2={width - padding.right}
                            y2={scaleY(tick)}
                            stroke="#f0f0f0"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Y-axis labels */}
                    {yTickValues.map((tick, i) => (
                        <text
                            key={i}
                            x={padding.left - 10}
                            y={scaleY(tick) + 4}
                            textAnchor="end"
                            className="text-xs fill-gray-400"
                        >
                            {Math.round(tick).toLocaleString()}
                        </text>
                    ))}

                    {/* Gradient definition */}
                    <defs>
                        <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>

                    {/* Hover sections - invisible rectangles for each data point */}
                    {points.map((point, index) => {
                        // Calculate section boundaries
                        let sectionX, sectionWidth;
                        
                        if (index === 0) {
                            // First section: from start to midpoint between first and second point
                            sectionX = padding.left;
                            sectionWidth = points.length > 1 
                                ? (points[1].x - point.x) / 2 + (point.x - padding.left)
                                : chartWidth;
                        } else if (index === points.length - 1) {
                            // Last section: from midpoint between last two points to end
                            sectionX = (points[index - 1].x + point.x) / 2;
                            sectionWidth = (width - padding.right) - sectionX;
                        } else {
                            // Middle sections: from midpoint with previous to midpoint with next
                            sectionX = (points[index - 1].x + point.x) / 2;
                            const nextMidpoint = (point.x + points[index + 1].x) / 2;
                            sectionWidth = nextMidpoint - sectionX;
                        }

                        return (
                            <rect
                                key={`section-${index}`}
                                x={sectionX}
                                y={padding.top}
                                width={sectionWidth}
                                height={chartHeight}
                                fill="transparent"
                                className="cursor-pointer"
                                onMouseMove={(e) => handleMouseMove(e, point)}
                                onMouseLeave={handleMouseLeave}
                            />
                        );
                    })}

                    {/* Area under the line */}
                    <path
                        d={areaPath}
                        fill="url(#incomeGradient)"
                        className="pointer-events-none"
                    />

                    {/* Smooth curved line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="pointer-events-none"
                    />

                    {/* Data points */}
                    {points.map((point) => {
                        const isHovered = hoveredPoint?.date === point.data.date;

                        return (
                            <circle
                                key={`point-${point.index}`}
                                cx={point.x}
                                cy={point.y}
                                r={isHovered ? "8" : "6"}
                                fill="white"
                                stroke="#8b5cf6"
                                strokeWidth={isHovered ? "3" : "2"}
                                className="transition-all duration-200 pointer-events-none"
                                style={{ filter: isHovered ? 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))' : 'none' }}
                            />
                        );
                    })}

                    {/* X-axis labels */}
                    {data.map((point, index) => {
                        const x = scaleX(index);
                        return (
                            <text
                                key={index}
                                x={x}
                                y={height - padding.bottom + 30}
                                textAnchor="middle"
                                className="text-xs fill-gray-500 pointer-events-none"
                            >
                                {point.month}
                            </text>
                        );
                    })}

                    {/* Vertical indicator line at data point */}
                    {hoveredPoint && points.find(p => p.data.date === hoveredPoint.date) && (
                        <line
                            x1={points.find(p => p.data.date === hoveredPoint.date).x}
                            y1={padding.top}
                            x2={points.find(p => p.data.date === hoveredPoint.date).x}
                            y2={height - padding.bottom}
                            stroke="#8b5cf6"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            opacity="0.5"
                            className="pointer-events-none"
                        />
                    )}
                </svg>

                {/* Tooltip - follows mouse cursor */}
                {hoveredPoint && (
                    <div 
                        className="absolute bg-white rounded-lg shadow-xl p-4 pointer-events-none border border-gray-100 z-10"
                        style={{
                            left: `${tooltipPosition.x}px`,
                            top: `${tooltipPosition.y}px`,
                            transform: 'translate(-50%, -100%)',
                            transition: 'left 0.1s ease-out, top 0.1s ease-out'
                        }}
                    >
                        <div className="text-sm font-semibold text-gray-700 mb-1">
                            {hoveredPoint.month}
                        </div>
                        <div className="text-lg font-bold text-purple-600 mb-2">
                            Total: {formatCurrency(hoveredPoint.totalAmount)}
                        </div>
                        {hoveredPoint.items.length > 0 && (
                            <div className="text-xs text-gray-600 border-t border-gray-100 pt-2">
                                <div className="font-medium mb-1">Details:</div>
                                {hoveredPoint.items.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="flex justify-between gap-3">
                                        <span className="truncate max-w-[120px]">{item.name}:</span>
                                        <span className="font-medium whitespace-nowrap">{formatCurrency(item.amount)}</span>
                                    </div>
                                ))}
                                {hoveredPoint.items.length > 3 && (
                                    <div className="text-gray-400 mt-1">
                                        +{hoveredPoint.items.length - 3} more
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomeLineChart;