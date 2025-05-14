"use client";

import { useState, useEffect, useRef } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const defaultData = [
  { name: "5K", value: 22 },
  { name: "", value: 28 },
  { name: "", value: 35 },
  { name: "", value: 48 },
  { name: "", value: 42 },
  { name: "10K", value: 38 },
  { name: "", value: 35 },
  { name: "", value: 55 },
  { name: "", value: 48 },
  { name: "15K", value: 40 },
  { name: "", value: 45 },
  { name: "", value: 52 },
  { name: "20K", value: 55 },
  { name: "", value: 48 },
  { name: "", value: 42 },
  { name: "25K", value: 64.36 }, // Peak value with tooltip
  { name: "", value: 45 },
  { name: "", value: 55 },
  { name: "30K", value: 50 },
  { name: "", value: 48 },
  { name: "", value: 55 },
  { name: "35K", value: 60 },
  { name: "", value: 58 },
  { name: "", value: 30 },
  { name: "40K", value: 32 },
  { name: "", value: 48 },
  { name: "", value: 52 },
  { name: "45K", value: 75 },
  { name: "", value: 62 },
  { name: "", value: 65 },
  { name: "50K", value: 45 },
  { name: "", value: 55 },
  { name: "", value: 58 },
  { name: "55K", value: 45 },
  { name: "", value: 60 },
  { name: "", value: 55 },
  { name: "60K", value: 58 },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function ConversionGraph({
  title = "Conversion to Basic",
  data = defaultData,
  height = 192,
}) {
  const [month, setMonth] = useState("October");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTooltipIndex, setActiveTooltipIndex] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef(null);

  // Calculate the graph height based on the total card height
  // Subtract header height and padding
  const headerHeight = 32; // Approximate height of the header with smaller text
  const verticalPadding = 16; // 8px top + 8px bottom
  const graphHeight = height - headerHeight - verticalPadding;

  // Force tooltip to show for the peak value (index 15) on initial render
  useEffect(() => {
    // Set the default tooltip to show at the peak value (index 15)
    setActiveTooltipIndex(15);

    // Calculate initial tooltip position
    if (chartRef.current) {
      const chartWidth = chartRef.current.getBoundingClientRect().width;
      // Approximate position for index 15
      const xPosition = (chartWidth / data.length) * 15;
      setTooltipPosition({
        x: xPosition,
        y: graphHeight / 2.5, // Adjust y position for smaller graph
      });
    }
  }, [data.length, graphHeight]);

  const CustomTooltip = ({ active, payload, label }) => {
    if ((active && payload && payload.length) || activeTooltipIndex !== null) {
      const value =
        activeTooltipIndex !== null && data[activeTooltipIndex]
          ? data[activeTooltipIndex].value
          : payload && payload[0]
          ? payload[0].value
          : null;

      if (value === null) return null;

      return null; // We'll use the custom tooltip below instead
    }
    return null;
  };

  const handleMouseMove = (props) => {
    if (props && props.activeTooltipIndex !== undefined) {
      setActiveTooltipIndex(props.activeTooltipIndex);

      if (chartRef.current && props.activeCoordinate) {
        setTooltipPosition({
          x: props.activeCoordinate.x,
          y: props.activeCoordinate.y,
        });
      }
    }
  };

  const handleMouseLeave = () => {
    // Keep the tooltip at index 15 (peak value) when not hovering
    setActiveTooltipIndex(15);

    // Set position for the default tooltip
    if (chartRef.current) {
      const chartWidth = chartRef.current.getBoundingClientRect().width;
      // Approximate position for index 15
      const xPosition = (chartWidth / data.length) * 15;
      setTooltipPosition({
        x: xPosition,
        y: graphHeight / 2.5, // Adjust y position for smaller graph
      });
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectMonth = (selectedMonth) => {
    setMonth(selectedMonth);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className="w-full bg-white rounded-lg overflow-hidden font-['Nunito_Sans']"
      style={{
        position: "relative", // Added to establish a stacking context
        zIndex: 0, // Ensures this stacking context is properly ordered
        height: `${height}px`,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div className="flex justify-between items-center px-3 py-2">
        <h2 className="text-neutral-800 md:text-2xl font-bold font-['Nunito_Sans']">
          {title}
        </h2>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="h-6 px-2 flex items-center justify-between bg-white border border-gray-200 rounded-md text-xs"
            style={{ boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)" }}
          >
            <span className="text-gray-700">{month}</span>
            <svg
              className={`w-3 h-3 text-gray-500 transition-transform ml-1 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-1 w-[120px] bg-white border border-gray-200 rounded-md z-10 max-h-40 overflow-auto"
              style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}
            >
              {months.map((m) => (
                <div
                  key={m}
                  className="px-2 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer text-xs"
                  onClick={() => selectMonth(m)}
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className="relative"
        style={{ height: `${graphHeight}px` }}
        ref={chartRef}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient
                id="colorValue"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#3b82f6"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="#3b82f6"
                  stopOpacity={0.05}
                />
              </linearGradient>
              {/* Box shadow effect */}
              <filter
                id="boxShadow"
                height="130%"
                width="100%"
                x="0%"
                y="0%"
              >
                <feFlood
                  floodColor="#3b82f6"
                  floodOpacity={0.15}
                  result="floodFill"
                />
                <feComposite
                  in="floodFill"
                  in2="SourceAlpha"
                  operator="in"
                  result="coloredShadow"
                />
                <feOffset
                  in="coloredShadow"
                  dx="0"
                  dy="5"
                  result="offsetShadow"
                />
                <feGaussianBlur
                  in="offsetShadow"
                  stdDeviation="3"
                  result="blurredShadow"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="blurredShadow"
                  mode="normal"
                />
              </filter>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "#9ca3af" }}
              dy={5}
              interval="equidistantPreserveStart"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "#9ca3af" }}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
              ticks={[0, 50, 100]} // Reduced ticks for smaller height
              dx={-5}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={true}
              isAnimationActive={true}
              wrapperStyle={{ zIndex: 100 }}
            />
            <Area
              type="linear"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={1.5} // Slightly thinner line for smaller graph
              fillOpacity={1}
              fill="url(#colorValue)"
              isAnimationActive={false}
              connectNulls
              dot={false}
              filter="url(#boxShadow)"
              activeDot={{
                r: 3, // Smaller dot for smaller graph
                fill: "#3b82f6",
                stroke: "#fff",
                strokeWidth: 1.5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Custom tooltip with arrow */}
        {activeTooltipIndex !== null && data[activeTooltipIndex] && (
          <div
            className="absolute"
            style={{
              left: tooltipPosition.x - 15,
              top: tooltipPosition.y - 30, // Adjusted for smaller graph
              zIndex: 1000,
            }}
          >
            <div
              className="bg-blue-500 text-white px-2 py-0.5 rounded-md text-xs font-medium relative"
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              {data[activeTooltipIndex].value.toFixed(2)}
              {/* Arrow pointing down */}
              <div
                className="absolute w-0 h-0"
                style={{
                  left: "50%",
                  marginLeft: "-4px",
                  bottom: "-4px",
                  borderLeft: "4px solid transparent",
                  borderRight: "4px solid transparent",
                  borderTop: "4px solid #3b82f6",
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
