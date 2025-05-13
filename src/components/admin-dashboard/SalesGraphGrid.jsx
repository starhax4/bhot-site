import React, { useState } from "react";
import LineChartCard from "../dashboard/line-chart";
import ConversionGraph from "../dashboard/convertiongraph";

const SalesGraphGrid = () => {
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

  return (
    <div className="flex flex-col gap-10  md:py-11 md:w-[45vw]">
      <ConversionGraph
        data={defaultData}
        title="Visits"
        height={192}
      />
      <ConversionGraph
        data={defaultData}
        title="Conversion to Basic"
        height={192}
      />
      <ConversionGraph
        data={defaultData}
        title="Conversion to Pro"
      />
    </div>
  );
};

export default SalesGraphGrid;
