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

// Define colors
const TdColors = {
  teal600: "#0D9488",
  red500: "#EF4444",
  orange500: "#F97316",
  orange300: "#FDBA74", // Peach
  yellow500: "#EAB308",
  lime500: "#84CC16", // Lime Green
  green500: "#22C55E", // Bright Green
};

const segmentAngleSize = 360 / 7;

// Outer segments: Red, Orange, Peach, Yellow, Lime, Green, Teal
const outerSegmentsData = [
  {
    id: "red",
    color: TdColors.red500,
    startAngle: 0,
    endAngle: segmentAngleSize,
  },
  {
    id: "orange",
    color: TdColors.orange500,
    startAngle: segmentAngleSize,
    endAngle: 2 * segmentAngleSize,
  },
  {
    id: "peach",
    color: TdColors.orange300,
    startAngle: 2 * segmentAngleSize,
    endAngle: 3 * segmentAngleSize,
  },
  {
    id: "yellow",
    color: TdColors.yellow500,
    startAngle: 3 * segmentAngleSize,
    endAngle: 4 * segmentAngleSize,
  },
  {
    id: "lime",
    color: TdColors.lime500,
    startAngle: 4 * segmentAngleSize,
    endAngle: 5 * segmentAngleSize,
  },
  {
    id: "green",
    color: TdColors.green500,
    startAngle: 5 * segmentAngleSize,
    endAngle: 6 * segmentAngleSize,
  },
  {
    id: "teal",
    color: TdColors.teal600,
    startAngle: 6 * segmentAngleSize,
    endAngle: 360,
  },
];

const getActiveSegmentColor = (
  angle,
  segments,
  progressValue,
  scaleStartAngleUsedInCalc
) => {
  const normalizedAngle = ((angle % 360) + 360) % 360;

  if (progressValue === 100) {
    let targetAngleForSegmentLookup =
      (scaleStartAngleUsedInCalc - 0.01 + 360) % 360;
    for (const segment of segments) {
      if (
        targetAngleForSegmentLookup >= segment.startAngle &&
        targetAngleForSegmentLookup < segment.endAngle
      ) {
        return segment.color;
      }
    }
    if (Math.abs(scaleStartAngleUsedInCalc) < 0.01) {
      // Started at 0, 100% means last segment
      return segments[segments.length - 1].color;
    }
  }

  for (const segment of segments) {
    if (
      normalizedAngle >= segment.startAngle &&
      normalizedAngle < segment.endAngle
    ) {
      return segment.color;
    }
  }
  if (Math.abs(normalizedAngle) < 0.001) {
    // Exactly 0
    const firstSegment = segments.find(
      (s) => Math.abs(s.startAngle) < 0.001 && s.endAngle > 0
    );
    if (firstSegment) return firstSegment.color;
  }
  if (Math.abs(normalizedAngle - 360) < 0.01) {
    // Exactly 360 (should be caught by < endAngle for last segment)
    return segments[segments.length - 1].color;
  }
  return segments[0].color; // Fallback
};

const SegmentedCircularGauge = ({ value, grade, size = 192 }) => {
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

  const progressValue = Math.max(0, Math.min(100, value));

  const actualProgressEndAngle =
    scaleStartAngle + (progressValue / 100) * scaleSpan;

  let pathDrawingEndAngle;
  if (progressValue === 100) {
    pathDrawingEndAngle = scaleStartAngle + (scaleSpan - 0.001);
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

  const colorLookupAngle = actualProgressEndAngle;
  const progressCurrentColor = getActiveSegmentColor(
    colorLookupAngle,
    outerSegmentsData,
    progressValue,
    scaleStartAngle
  );

  const roundedValue = Math.round(progressValue);

  // Responsive font sizes
  // Base sizes for a reference gauge size of 192px
  const baseSize = 192;
  const baseScoreFontSize = 30; // Corresponds to text-3xl approx
  const baseGradeFontSize = 18; // Corresponds to text-lg approx

  const scoreFontSize = (size / baseSize) * baseScoreFontSize;
  const gradeFontSize = (size / baseSize) * baseGradeFontSize;

  return (
    <div
      className="relative"
      style={{ width: `${size}px`, height: `${size}px` }}
      role="meter"
      aria-valuenow={roundedValue}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label={`Score: ${roundedValue}${grade ? " " + grade : ""}`}
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
              strokeLinecap="butt"
            />
          ))}
          {progressValue > 0 && (
            <path
              d={progressPath}
              fill="none"
              stroke={progressCurrentColor}
              strokeWidth={innerStrokeWidth}
              strokeLinecap="butt"
            />
          )}
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
        <span
          className="font-bold text-gray-800"
          style={{ fontSize: `${scoreFontSize}px`, lineHeight: "1.1" }} // Added lineHeight for better spacing
        >
          {roundedValue}
        </span>
        {grade && (
          <span
            className="text-gray-700"
            style={{ fontSize: `${gradeFontSize}px`, lineHeight: "1.1" }} // Added lineHeight
          >
            {grade.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};

export default SegmentedCircularGauge;

// Example Usage:
// import SegmentedCircularGauge from './SegmentedCircularGauge';
//
// function App() {
//   return (
//     <div className="flex flex-wrap items-center justify-center min-h-screen bg-gray-100 p-4 gap-4">
//       <SegmentedCircularGauge value={71} grade="C" /> {/* Default size (192px) */}
//       <SegmentedCircularGauge value={95} grade="A" size={240} /> {/* Custom size */}
//       <SegmentedCircularGauge value={25} grade="D" size={120} /> {/* Smaller size */}
//       <SegmentedCircularGauge value={100} grade="Max" size={80} /> {/* Even smaller */}
//     </div>
//   );
// }
