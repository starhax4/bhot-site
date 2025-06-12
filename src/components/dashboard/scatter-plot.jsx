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
  { id: "proj1", area: 30, score: 50 },
  { id: "proj2", area: 40, score: 75 },
  { id: "proj3", area: 50, score: 60 },
  { id: "proj4", area: 60, score: 80 },
  { id: "proj5", area: 70, score: 95 },
  { id: "proj6", area: 80, score: 105 },
  { id: "proj7", area: 90, score: 120 },
  { id: "proj8", area: 100, score: 135 },
  { id: "proj9", area: 110, score: 150 },
  { id: "proj10", area: 120, score: 165 },
  { id: "proj11", area: 130, score: 180 },
  { id: "proj12", area: 140, score: 195 },
  { id: "proj13", area: 150, score: 210 },
  { id: "proj14", area: 160, score: 225 },
  { id: "proj15", area: 170, score: 240 },
  { id: "proj16", area: 180, score: 255 },
  { id: "proj17", area: 190, score: 270 },
  { id: "proj18", area: 200, score: 285 },
  { id: "proj19", area: 210, score: 300 },
  { id: "proj20", area: 220, score: 315 },
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
  highlightedPointId, // not needed, will use lmkKey from localStorage
  width = "100%",
  height = 256,
  yAxisLabel = "Score",
  xAxisLabel = "Area (sqm)",
}) => {
  // Get lmkKey from localStorage for highlighting
  const userLmkKey =
    typeof window !== "undefined" ? localStorage.getItem("lmkKey") : undefined;

  // Defensive mapping: ensure data is always in the correct format
  const mappedData = Array.isArray(data)
    ? data.map((d, i) => ({
        id: d.lmkKey || d.id || d._id || d.property_id || `point-${i}`,
        lmkKey: d?.lmkKey,
        area: d.area ?? d.x ?? 0,
        score: d.score ?? d.y ?? 0,
        name: d.name || d.label || undefined,
        ...d,
      }))
    : [];

  // Default Tailwind classes for styling (can be customized)
  const lightGreen = "fill-green-600"; // Lighter green for regular points
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
            bottom: 30, // Increased bottom margin for X-axis label
            left: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className={gridColor}
          />
          <XAxis
            type="number"
            dataKey="area"
            name="Area (sqm)"
            domain={["dataMin - 1", "dataMax + 1"]}
            tick={{ fontSize: 12, className: axisColor }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={{ stroke: "#e5e7eb" }}
          >
            <Label
              value={xAxisLabel}
              offset={-10}
              position="insideBottomRight"
              style={{ fill: "#94a3b8", fontSize: 14, fontWeight: 600 }}
            />
          </XAxis>
          <YAxis
            type="number"
            dataKey="score"
            name="Score"
            domain={[0, "dataMax + 20"]}
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
            labelStyle={{ color: "#374151", fontWeight: "bold" }}
            formatter={(value, name, props) => {
              const pointName = props.payload.name
                ? ` (${props.payload.name})`
                : "";
              return [`${value}${pointName}`, name];
            }}
          />
          <Scatter
            name="Properties"
            data={mappedData}
            shape="square"
          >
            {mappedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                className={
                  entry.lmkKey && userLmkKey && entry.lmkKey === userLmkKey
                    ? darkGreen
                    : lightGreen
                }
                stroke={
                  entry.lmkKey && userLmkKey && entry.lmkKey === userLmkKey
                    ? "#005000"
                    : "#dcfce7"
                }
                strokeWidth={
                  entry.lmkKey && userLmkKey && entry.lmkKey === userLmkKey
                    ? 3
                    : 1
                }
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
