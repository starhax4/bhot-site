import React from "react";

// SVG Check Icon (dark grey as in the image)
const CheckIcon = () => (
  <img
    src="/tick.svg"
    alt="tick"
  />
);

const pricingData = {
  features: [
    { id: "properties", label: "Number of Properties / Month" },
    { id: "benchmarking", label: "Peer Benchmarking" },
    { id: "valuation", label: "Property Valuation Estimate" },
    { id: "efficiency", label: "Energy Efficiency Recommendations" },
    {
      id: "uplift",
      label: "Estimated Value Uplift from Implementing Recommendations",
    },
    { id: "payback", label: "Payback Period Estimation" },
  ],
  plans: [
    {
      id: "free",
      name: "Free", // Large header text for the plan
      frequency: "",
      buttonText: "Existing plan",
      buttonLink: "#",
      values: {
        properties: "1",
        benchmarking: true,
        valuation: true,
        efficiency: true,
        uplift: false,
        payback: false,
      },
    },
    {
      id: "basic",
      name: "£9.99", // Large header text for the plan
      frequency: "/Lifetime",
      buttonText: "Choose Basic Plan",
      buttonLink: "/checkout/cart?package=basic",
      values: {
        properties: "1",
        benchmarking: true,
        valuation: true,
        efficiency: true,
        uplift: true,
        payback: true,
      },
    },
    {
      id: "pro",
      name: "£59.99", // Large header text for the plan
      frequency: "/Year",
      buttonText: "Choose Pro Plan",
      buttonLink: "/checkout/cart?package=pro",
      values: {
        properties: "Unlimited",
        benchmarking: true,
        valuation: true,
        efficiency: true,
        uplift: true,
        payback: true,
      },
    },
  ],
};

const PricingTable = () => {
  const { features, plans } = pricingData;

  return (
    // The main container for the pricing table, matching shadow and rounded corners.
    <div className="w-[95vw] bg-white rounded-3xl outline  outline-offset-[-1px] outline-slate-200 max-w-7xl mx-auto my-8 overflow-hidden">
      {/* Wrapper to enable horizontal scrolling on smaller screens */}
      <div className="overflow-x-auto">
        {/* 
          The grid itself. It needs a minimum width to ensure content doesn't break
          and to trigger horizontal scroll when viewport is narrower.
          The grid-template-columns are defined to give more relative space to the first column (feature labels).
        */}
        <div
          className="min-w-[900px] lg:min-w-[1024px] grid gap-0" // Adjusted min-width
          style={{
            gridTemplateColumns: `minmax(220px, 1.5fr) repeat(${plans.length}, minmax(160px, 1fr))`,
          }}
        >
          {/* ----- ROW 1: "Compare Plans" Info & Plan Headers ----- */}

          {/* Cell 1.1: "Compare Plans" section */}
          <div className="p-5 md:p-6">
            <h2 className="text-xl font-bold md:text-2xl text-primary mb-1">
              Compare plans
            </h2>
            <p className="text-xs md:text-sm text-gray-400">
              Choose your plan according to your needs
            </p>
          </div>

          {/* Cells 1.2, 1.3, 1.4: Plan Headers (Free, £9.99, £59.99) */}
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="p-3 md:p-6 text-center border-l border-gray-200"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-primary">
                {plan.name}
                {plan.frequency && (
                  <span className="text-xs md:text-sm text-gray-400 font-medium align-baseline ml-1">
                    {plan.frequency}
                  </span>
                )}
              </h3>
              <a
                href={plan.buttonLink}
                className="mt-4 inline-block w-full bg-primary text-white py-3 px-4 rounded-md text-sm font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              >
                {plan.buttonText}
              </a>
            </div>
          ))}

          {/* ----- FEATURE ROWS ----- */}
          {features.map((feature, featureIndex) => (
            <React.Fragment key={feature.id}>
              {/* Column 1: Feature Label */}
              <div
                className={`p-3 md:p-5 text-sm md:text-lg text-zinc-800 flex items-center min-h-[55px] md:min-h-[65px] border-t 
                            ${
                              featureIndex === 0
                                ? "border-gray-300 font-medium"
                                : "border-gray-200 font-medium"
                            }`}
                // The first feature row's top border is slightly more prominent in the image.
                // The image does not make the first feature label bold, so removing font-medium.
                // The border above first feature row is the same as others based on crops.
              >
                {feature.label}
              </div>

              {/* Columns 2, 3, 4: Feature values for each plan */}
              {plans.map((plan) => (
                <div
                  key={`${plan.id}-${feature.id}`}
                  className={`p-2 md:p-4 border-t border-l border-gray-200 flex justify-center items-center min-h-[55px] md:min-h-[65px]
                              ${
                                featureIndex === 0
                                  ? "border-gray-300"
                                  : "border-gray-200"
                              }`}
                >
                  {typeof plan.values[feature.id] === "boolean" ? (
                    plan.values[feature.id] ? (
                      <CheckIcon />
                    ) : null // Render nothing if false, as per image
                  ) : (
                    <span className="text-sm text-gray-800">
                      {plan.values[feature.id]}
                    </span>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
