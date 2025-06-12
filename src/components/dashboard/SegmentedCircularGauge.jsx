import React from "react";

// Helper function to convert polar coordinates to Cartesian for SVG paths
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

// Helper function to describe an SVG arc path
const describeArc = (x, y, radius, startAngle, endAngle) => {
  if (Math.abs(endAngle - startAngle) >= 359.999) {
    // Full circle
    endAngle = startAngle + 359.999;
  } else if (
    startAngle === endAngle &&
    Math.abs(endAngle - startAngle) < 0.001
  ) {
    // Zero-length arc
    const startPoint = polarToCartesian(x, y, radius, startAngle);
    return `M ${startPoint.x} ${startPoint.y}`;
  }

  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);

  const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    arcSweep,
    1,
    end.x,
    end.y,
  ].join(" ");

  return d;
};

// Define colors and grade boundaries
const gradeBoundariesAndColors = [
  { grade: "G", min: 0, max: 20, color: "#E9153B" }, // Min set to 0 for continuous gauge display
  { grade: "F", min: 21, max: 38, color: "#EF8023" },
  { grade: "E", min: 39, max: 54, color: "#FCAA65" },
  { grade: "D", min: 55, max: 68, color: "#FFD500" },
  { grade: "C", min: 69, max: 80, color: "#8DCE46" },
  { grade: "B", min: 81, max: 91, color: "#19B459" },
  { grade: "A", min: 92, max: 100, color: "#00C781" },
];

// Calculate outer segments data based on grade boundaries
const outerSegmentsData = gradeBoundariesAndColors.map(
  (gradeInfo, index, arr) => {
    let startPercentForAngleCalc;
    if (index === 0) {
      // The first segment (G) starts at its defined min percentage (which is 0)
      startPercentForAngleCalc = gradeInfo.min;
    } else {
      // Subsequent segments start visually where the previous segment ended (its max percentage)
      startPercentForAngleCalc = arr[index - 1].max;
    }
    // The end percentage for the current segment is its own max percentage
    const endPercentForAngleCalc = gradeInfo.max;

    return {
      id: gradeInfo.grade,
      color: gradeInfo.color,
      // Convert these continuous percentages to angles (0-360 degrees)
      startAngle: (startPercentForAngleCalc / 100) * 360,
      // Ensure the last segment precisely ends at 360 degrees if its max is 100%
      endAngle:
        endPercentForAngleCalc === 100 && index === arr.length - 1
          ? 360
          : (endPercentForAngleCalc / 100) * 360,
    };
  }
);

// Function to calculate grade based on value
const calculateGrade = (value, boundaries) => {
  const val = Math.round(value); // Round to nearest integer for comparison
  for (const { grade, min, max } of boundaries) {
    if (val >= min && val <= max) {
      return grade;
    }
  }
  // Special case for 0, if G starts at 1 as per spec
  if (val === 0 && boundaries[0].min === 1 && boundaries[0].grade === "G") {
    return "G";
  }
  return ""; // Fallback if no grade matches (should not happen for 0-100)
};

// Function to get the color for the inner progress arc
const getProgressArcColor = (value, boundaries) => {
  const val = Math.round(value); // Round to nearest integer
  for (const { grade, min, max, color } of boundaries) {
    if (val >= min && val <= max) {
      return color;
    }
  }
  // Special case for 0, if G starts at 1
  if (val === 0 && boundaries[0].min === 1 && boundaries[0].grade === "G") {
    return boundaries[0].color;
  }
  return boundaries[0].color; // Fallback to the lowest grade color
};

const SegmentedCircularGauge = ({ value, grade, size = 192 }) => {
  // Removed 'grade' prop
  // Default size 192px (w-48)
  const viewBoxSize = 100; // SVG internal coordinate system size
  const center = viewBoxSize / 2;

  // Radii and stroke widths are relative to viewBoxSize, so they scale with the SVG
  const outerRadius = 40;
  const outerStrokeWidth = 10;
  const innerRadius = 28;
  const innerStrokeWidth = 12;

  const scaleStartAngle = 0;
  const scaleSpan = 360;

  const progressValue = Math.max(0, Math.min(100, value)); // Clamp value between 0 and 100

  const actualProgressEndAngle =
    scaleStartAngle + (progressValue / 100) * scaleSpan;

  let pathDrawingEndAngle;
  if (progressValue === 100) {
    pathDrawingEndAngle = scaleStartAngle + (scaleSpan - 0.001); // Prevent full circle overlap issue
  } else {
    pathDrawingEndAngle = actualProgressEndAngle;
  }

  const progressPath = describeArc(
    center,
    center,
    innerRadius,
    scaleStartAngle,
    pathDrawingEndAngle
  );

  // Calculate current grade and color for the progress arc
  const currentDisplayGrade = calculateGrade(
    progressValue,
    gradeBoundariesAndColors
  );
  const progressArcFillColor = getProgressArcColor(
    progressValue,
    gradeBoundariesAndColors
  );

  const roundedValue = Math.round(progressValue);

  return (
    <div
      className="relative"
      style={{ width: `${size}px`, height: `${size}px` }}
      role="meter"
      aria-valuenow={roundedValue}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label={`Score: ${roundedValue}${
        currentDisplayGrade ? " " + currentDisplayGrade : ""
      }`}
    >
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="w-full h-full"
      >
        <g>
          {outerSegmentsData.map((segment) => (
            <path
              key={segment.id}
              d={describeArc(
                center,
                center,
                outerRadius,
                segment.startAngle,
                segment.endAngle
              )}
              fill="none"
              stroke={segment.color}
              strokeWidth={outerStrokeWidth}
              strokeLinecap="butt" // Ensures segments meet cleanly
            />
          ))}
          {progressValue > 0 && ( // Only draw progress path if value > 0
            <path
              d={progressPath}
              fill="none"
              stroke={progressArcFillColor} // Use the calculated color for the progress arc
              strokeWidth={innerStrokeWidth}
              strokeLinecap="butt" // Or 'round' for a rounded end cap
            />
          )}
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
        <span
          className="font-semibold text-black text-xl" // Ensure text color has good contrast
        >
          {roundedValue}
        </span>
        {currentDisplayGrade && (
          <span
            className="font-semibold text-black text-xl" // Ensure text color has good contrast
          >
            {grade}
          </span>
        )}
      </div>
    </div>
  );
};

export default SegmentedCircularGauge;
