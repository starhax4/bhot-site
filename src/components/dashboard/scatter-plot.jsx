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
  { id: "proj4", frequency: 6, projectSuccess: 80 },
  { id: "proj5", frequency: 7, projectSuccess: 95 },
  { id: "proj6", frequency: 8, projectSuccess: 105 },
  { id: "proj7", frequency: 9, projectSuccess: 120 },
  { id: "proj8", frequency: 10, projectSuccess: 135 },
  { id: "proj9", frequency: 11, projectSuccess: 150 },
  { id: "proj10", frequency: 12, projectSuccess: 165 },
  { id: "proj11", frequency: 13, projectSuccess: 180 },
  { id: "proj12", frequency: 14, projectSuccess: 195 },
  { id: "proj13", frequency: 15, projectSuccess: 210 },
  { id: "proj14", frequency: 16, projectSuccess: 225 },
  { id: "proj15", frequency: 17, projectSuccess: 240 },
  { id: "proj16", frequency: 18, projectSuccess: 255 },
  { id: "proj17", frequency: 19, projectSuccess: 270 },
  { id: "proj18", frequency: 20, projectSuccess: 285 },
  { id: "proj19", frequency: 21, projectSuccess: 300 },
  { id: "proj20", frequency: 22, projectSuccess: 315 },
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
  const lightGreen = "fill-green-300"; // Lighter green for regular points
  const darkGreen = "fill-primary"; // Primary green for highlighted point using the theme color
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
              style={{ fill: "#94a3b8", fontSize: 14, fontWeight: 600 }}
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
                  entry.id === highlightedPointId ? darkGreen : lightGreen
                }
                stroke={entry.id === highlightedPointId ? "#005000" : "#dcfce7"} // Primary green and green-100 for borders
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
