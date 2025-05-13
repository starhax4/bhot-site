import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Cell,
} from "recharts";

// Sample data structure - you'll replace this with your actual data
// The 'id' can be used to identify the highlighted point
// interface DataPoint {
//   id: string;
//   frequency: number;
//   projectSuccess: number;
//   name?: string; // Optional: for tooltips
// }

// Sample data - this would come from your state, likely filtered
const sampleData = [
  { id: "proj1", frequency: 3, projectSuccess: 50 },
  { id: "proj2", frequency: 4, projectSuccess: 75 },
  { id: "proj3", frequency: 5, projectSuccess: 60 },
  { id: "proj4", frequency: 8.5, projectSuccess: 105 }, // Highlighted point
  { id: "proj5", frequency: 9, projectSuccess: 130 },
  { id: "proj6", frequency: 12, projectSuccess: 150 },
  { id: "proj7", frequency: 15, projectSuccess: 180 },
  { id: "proj8", frequency: 17, projectSuccess: 220 },
  { id: "proj9", frequency: 19, projectSuccess: 200 },
  // ... more data points
];

// interface ScatterPlotComponentProps {
//   data: DataPoint[];
//   highlightedPointId?: string; // ID of the point to highlight
//   width?: string | number; // Optional width (e.g., "100%", 600)
//   height?: string | number; // Optional height (e.g., "100%", 400)
//   yAxisLabel?: string;
//   xAxisLabel?: string;
// }

const ScatterPlot = ({
  data,
  highlightedPointId,
  width = "100%",
  height = 256,
  yAxisLabel = "Project Success",
  xAxisLabel = "Frequency",
}) => {
  // Default Tailwind classes for styling (can be customized)
  const lightPurple = "fill-purple-300"; // Lighter purple for regular points
  const darkPurple = "fill-purple-600"; // Darker purple for highlighted point
  const axisColor = "text-gray-600";
  const gridColor = "stroke-gray-200";
  const labelColor = "text-neutral-400";

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {yAxisLabel && (
        <h2 className={`text-sm font-semibold ${labelColor} ml-8`}>
          {yAxisLabel}
        </h2>
      )}
      <ResponsiveContainer
        width={width}
        height={height}
      >
        <ScatterChart
          margin={{
            top: 20,
            right: 30, // Increased right margin for X-axis label
            bottom: 40, // Increased bottom margin for X-axis label
            left: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className={gridColor}
          />
          <XAxis
            type="number"
            dataKey="frequency"
            name="Frequency"
            domain={["dataMin - 1", "dataMax + 1"]} // Auto-adjust domain with padding
            tick={{ fontSize: 12, className: axisColor }}
            axisLine={{ stroke: "#e5e7eb" }} // Tailwind gray-200
            tickLine={{ stroke: "#e5e7eb" }}
          >
            <Label
              value={xAxisLabel}
              offset={-30}
              position="insideBottomRight"
              style={{ fill: "#94a3b8", fontSize: 14 , fontWeight : 600}}
            />
          </XAxis>
          <YAxis
            type="number"
            dataKey="projectSuccess"
            name="Project Success"
            domain={[0, "dataMax + 20"]} // Start Y-axis at 0, extend slightly beyond max data
            ticks={[0, 50, 100, 150, 200, 250]} // Define specific ticks as in the image
            tick={{ fontSize: 12, className: axisColor }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.375rem",
              borderColor: "#e5e7eb",
            }}
            labelStyle={{ color: "#374151", fontWeight: "bold" }} // Tailwind gray-700
            formatter={(value, name, props) => {
              const pointName = props.payload.name
                ? ` (${props.payload.name})`
                : "";
              return [`${value}${pointName}`, name];
            }}
          />
          <Scatter
            name="Projects"
            data={data}
            shape="square"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                className={
                  entry.id === highlightedPointId ? darkPurple : lightPurple
                }
                stroke={entry.id === highlightedPointId ? "#581c87" : "#a855f7"} // Tailwind purple-800 and purple-500 for borders
                strokeWidth={1}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

// Example Usage:
// const MyPage = () => {
//   const [filteredData, setFilteredData] = useState(sampleData);
//   const [selectedProjectId, setSelectedProjectId] = useState('proj4');

//   // Logic to update filteredData based on your filter cards would go here

//   return (
//     <ScatterPlotComponent
//       data={filteredData}
//       highlightedPointId={selectedProjectId}
//       yAxisLabel="Project Success Metrics"
//       xAxisLabel="Task Completion Frequency"
//     />
//   );
// }

export default ScatterPlot;
