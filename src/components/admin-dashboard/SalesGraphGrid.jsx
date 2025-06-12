import React from "react";
import ConversionGraph from "../dashboard/convertiongraph";

// analytics: { visits, conversionToBasic, conversionToPro }
// summary: { sales: { total, basic, pro } }
const SalesGraphGrid = ({ summary, analytics }) => {
  // Prepare visits and conversion data for graphs
  const visitsData = (analytics?.visits || []).map((d) => ({
    name: `${d.x}`,
    value: d.y,
  }));
  const conversionToBasicData = (analytics?.conversionToBasic || []).map(
    (d) => ({ name: `${d.x}`, value: d.y })
  );
  const conversionToProData = (analytics?.conversionToPro || []).map((d) => ({
    name: `${d.x}`,
    value: d.y,
  }));

  return (
    <div className="flex flex-col gap-10 px-4 py-4  md:py-11 md:w-[45vw]">
      <ConversionGraph
        data={visitsData}
        title="Visits"
        height={192}
      />
      <ConversionGraph
        data={conversionToBasicData}
        title="Conversion to Basic"
        height={192}
      />
      <ConversionGraph
        data={conversionToProData}
        title="Conversion to Pro"
        height={192}
      />
    </div>
  );
};

export default SalesGraphGrid;
