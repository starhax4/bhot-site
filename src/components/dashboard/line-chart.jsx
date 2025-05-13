import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

// Custom Tooltip Component (assuming this is fine)
const CustomTooltipContent = ({ active, payload, label, valueSuffix }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip-container bg-blue-500 text-white px-3 py-1.5 rounded-md shadow-lg text-xs font-semibold">
        <p>{`${payload[0].value.toFixed(2)}${valueSuffix || ""}`}</p>
      </div>
    );
  }
  return null;
};

const LineChartCard = ({
  title,
  data,
  dropdownOptions,
  selectedDropdownValue,
  onDropdownChange,
  yAxisUnit = "",
  yAxisDomain = [0, 100],
  yAxisTicks = [0, 20, 40, 60, 80, 100],
  chartHeight = 300,
  tooltipValueSuffix = "",
  lineColor = "#3b82f6",
  areaGradientFromOpacity = 0.2,
  areaGradientToOpacity = 0.01,
  // --- Shadow Props: Defaults made more prominent for debugging ---
  shadowColor = "rgba(0, 0, 0, 0.5)", // More opaque black shadow for visibility
  shadowOffsetX = "0",
  shadowOffsetY = "5", // Pushes shadow down
  shadowBlur = "10",   // More blur for visibility
}) => {
  const uniqueSuffix = Math.random().toString(36).substr(2, 9);
  const safeTitleId = title.replace(/\s+/g, '-') || "chart";
  const areaGradientId = `chartAreaFill-${safeTitleId}-${uniqueSuffix}`;
  const lineShadowFilterId = `lineShadowFilter-${safeTitleId}-${uniqueSuffix}`;

  // console.log("Using filter ID:", lineShadowFilterId); // For debugging if needed

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
          {title}
        </h2>
        <select
          value={selectedDropdownValue}
          onChange={(e) => onDropdownChange(e.target.value)}
          className="bg-white border border-gray-200 text-gray-600 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block px-3 py-1.5 appearance-none w-full sm:w-auto"
        >
          {dropdownOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ width: "100%", height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: -20,
              bottom: 5, // Ensure enough space for shadow if it extends below
            }}
          >
            <defs>
              <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={lineColor}
                  stopOpacity={areaGradientFromOpacity}
                />
                <stop
                  offset="95%"
                  stopColor={lineColor}
                  stopOpacity={areaGradientToOpacity}
                />
              </linearGradient>
              <filter id={lineShadowFilterId} x="-50%" y="-50%" width="200%" height="200%">
                {/* Removed floodOpacity attribute to let alpha from shadowColor (floodColor) control opacity */}
                <feDropShadow
                  dx={shadowOffsetX}
                  dy={shadowOffsetY}
                  stdDeviation={shadowBlur}
                  floodColor={shadowColor}
                  // floodOpacity="1" // REMOVED THIS LINE
                />
              </filter>
            </defs>
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              dy={10}
            />
            <YAxis
              domain={yAxisDomain}
              ticks={yAxisTicks}
              tickFormatter={(value) => `${value}${yAxisUnit}`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#6b7280", textAnchor: "end" }}
              dx={-5}
            />
            <Tooltip
              content={<CustomTooltipContent valueSuffix={tooltipValueSuffix} />}
              cursor={{
                stroke: lineColor,
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
              position={{ y: 0 }}
              offset={20}
            />
            <Area
              type="linear"
              dataKey="value"
              stroke="none"
              fill={`url(#${areaGradientId})`}
              filter={`url(#${lineShadowFilterId})`}
            />
            <Line
              type="linear"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2.5}
              dot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
              activeDot={{
                r: 6,
                stroke: "#ffffff",
                strokeWidth: 2,
                fill: lineColor,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartCard;