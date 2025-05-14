import React, { useState } from "react";
import SegmentedCircularGauge from "./SegmentedCircularGauge";
import ScatterPlot from "./scatter-plot";

// Dummy data for scatter plot
const scatterData = Array.from({ length: 50 }, () => ({
  x: Math.random() * 20,
  y: Math.random() * 250,
}));

const DashboardCard = () => {
  const [filter, setFilter] = useState({
    distance: "2", // Initial value for distance
    size: "1000", // Initial value for size
    type: {
      detachedHouse: false,
      terracedHouse: false,
      parkHouse: false,
      flat: false,
    },
  });

  const [openDropdown, setOpenDropdown] = useState(null); // 'distance', 'size', 'type'
  const [distanceButtonLabel, setDistanceButtonLabel] = useState("Distance");
  const [sizeButtonLabel, setSizeButtonLabel] = useState("Size");
  const [typeButtonLabel, setTypeButtonLabel] = useState("Type");

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
    { id: "proj10", frequency: 12, projectSuccess: 145 },
    { id: "proj11", frequency: 13, projectSuccess: 180 },
    { id: "proj12", frequency: 14, projectSuccess: 190 },
    { id: "proj13", frequency: 15, projectSuccess: 175 },
    { id: "proj14", frequency: 16, projectSuccess: 192 },
    { id: "proj15", frequency: 17, projectSuccess: 200 },
    { id: "proj16", frequency: 18, projectSuccess: 195 },
    { id: "proj17", frequency: 19, projectSuccess: 205 },
    { id: "proj18", frequency: 20, projectSuccess: 198 },
    { id: "proj19", frequency: 21, projectSuccess: 208 },
    { id: "proj20", frequency: 22, projectSuccess: 210 },
  ];

  // Sample data - replace with your actual data source
  const sampleChartData = [
    { category: "5k", value: 22 },
    { category: "10k", value: 30 },
    { category: "15k", value: 48 },
    { category: "20k", value: 40 },
    { category: "21k", value: 85.36 },
    { category: "22k", value: 52 },
    { category: "25k", value: 32 },
    { category: "30k", value: 40 },
    { category: "35k", value: 55 },
    { category: "40k", value: 48 },
    { category: "45k", value: 75 },
    { category: "50k", value: 68 },
    { category: "55k", value: 60 },
    { category: "60k", value: 55 },
  ];

  const periodOptions = [
    { label: "October", value: "october" },
    { label: "November", value: "november" },
    { label: "December", value: "december" },
  ];

  const [currentPeriod, setCurrentPeriod] = useState("october");

  const propertyOverview = {
    address: "1 Street Name, City, Post Code",
    type: "e.g. Mid-terrace House",
    area: "x sqm",
  };

  const distanceOptions = [
    { label: "Distance", value: "default_distance", miles: filter.distance },
    { label: "Within 1 mile", value: "1", miles: "1" },
    { label: "Within 2 miles", value: "2", miles: "2" },
    { label: "Within 5 miles", value: "5", miles: "5" },
    { label: "Within 10 miles", value: "10", miles: "10" },
  ];

  const sizeOptions = [
    { label: "Size", value: "default_size", sqm: filter.size },
    { label: "Up to 500 sqm", value: "500", sqm: "500" },
    { label: "Up to 1000 sqm", value: "1000", sqm: "1000" },
    { label: "Up to 2500 sqm", value: "2500", sqm: "2500" },
    { label: "Up to 5000 sqm", value: "5000", sqm: "5000" },
  ];

  const typeOptions = [
    { label: "Type", value: "default_type" },
    { label: "Any Type", value: "any_type" },
    { label: "Detached House", value: "detachedHouse" },
    { label: "Terraced House", value: "terracedHouse" },
    { label: "Park House", value: "parkHouse" },
    { label: "Flat", value: "flat" },
  ];

  const handleDropdownToggle = (dropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  const handleDistanceOptionSelect = (option) => {
    setDistanceButtonLabel(
      option.label === "Distance" ? "Distance" : option.label
    );
    if (option.value !== "default_distance") {
      setFilter((prevFilter) => ({
        ...prevFilter,
        distance: option.miles,
      }));
    }
    setOpenDropdown(null);
  };

  const handleSizeOptionSelect = (option) => {
    setSizeButtonLabel(option.label === "Size" ? "Size" : option.label);
    if (option.value !== "default_size") {
      setFilter((prevFilter) => ({
        ...prevFilter,
        size: option.sqm,
      }));
    }
    setOpenDropdown(null);
  };

  const handleTypeOptionSelect = (option) => {
    setTypeButtonLabel(option.label);
    const newTypeFilterState = {
      detachedHouse: false,
      terracedHouse: false,
      parkHouse: false,
      flat: false,
    };
    if (option.value !== "default_type" && option.value !== "any_type") {
      newTypeFilterState[option.value] = true;
    }
    // For "any_type", all remain false. For "default_type", no change to filter.type from here.
    if (option.value !== "default_type") {
      setFilter((prevFilter) => ({
        ...prevFilter,
        type: newTypeFilterState,
      }));
    }
    setOpenDropdown(null);
  };

  const handleCheckboxChange = (typeName) => {
    setFilter((prevFilter) => {
      const updatedType = {
        ...prevFilter.type,
        [typeName]: !prevFilter.type[typeName],
      };

      const trueTypes = Object.entries(updatedType)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      if (trueTypes.length === 0) {
        setTypeButtonLabel("Any Type");
      } else if (trueTypes.length === 1) {
        const selectedTypeOption = typeOptions.find(
          (opt) => opt.value === trueTypes[0]
        );
        setTypeButtonLabel(
          selectedTypeOption ? selectedTypeOption.label : "Type"
        );
      } else {
        setTypeButtonLabel("Multiple Types");
      }

      return {
        ...prevFilter,
        type: updatedType,
      };
    });
  };

  const handleRangeChange = (e) => {
    const { id, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [id]: value,
    }));
  };

  return (
    <div className="flex flex-col  md:w-[45vw] px-4 pt-8 pb-5 bg-white  shadow-lg rounded-3xl ">
      {/* Property Info */}
      <div className="flex flex-col md:flex-row justify-between">
        <div className="md:w-[40%] flex flex-col gap-4">
          <h2 className="text-lg  text-primary font-semibold">Your Property</h2>
          <div className="flex gap-2">
            <div className="flex flex-col gap-10">
              <p className="text-neutral-400 text-sm font-semibold">Address:</p>
              <p className="text-neutral-400 text-sm font-semibold">Type:</p>
              <p className="text-neutral-400 text-sm font-semibold">Area: </p>
            </div>

            <div className="flex flex-col gap-5 w-48">
              <p className="text-neutral-400 text-sm font-semibold h-10">
                {propertyOverview.address}
              </p>
              <p className="text-neutral-400 text-sm font-semibold h-10">
                {propertyOverview.type}
              </p>
              <p className="text-neutral-400 text-sm font-semibold h-10">
                {propertyOverview.area}
              </p>
            </div>
          </div>
        </div>

        {/* Circular Progress Indicators */}
        <div className="flex flex-col items-center md:flex-row gap-10">
          <div className="w-36">
            <p className="text-center mt-2 font-medium">Current</p>
            <SegmentedCircularGauge
              value={71}
              grade="C"
              size={142}
            />
          </div>
          <div className=" w-36">
            <p className="text-center mt-2 font-medium">Potential</p>
            <SegmentedCircularGauge
              value={82}
              grade="B"
              size={142}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <h2 className="flex text-center md:justify-start text-lg  text-primary font-semibold">
          Neighbourhood benchmarking
        </h2>
        <div className="flex flex-col my-4">
          <div className="flex flex-col items-center md:items-start gap-4 md:flex-row justify-between w-full">
            {/* Distance Filter */}
            <div className="flex flex-col gap-2 relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle("distance")}
                className={`w-32 px-2 py-2 outline-2 outline-offset-[-1px] outline-primary bg-primary text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer `}
              >
                <p className="text-nowrap text-xs">{distanceButtonLabel}</p>
                <div className="flex my-auto items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-down-icon lucide-chevron-down"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>
              {openDropdown === "distance" && (
                <div className="absolute top-full mt-1 w-40 bg-white shadow-xl rounded-lg z-20 border border-gray-200 py-1">
                  {distanceOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => handleDistanceOptionSelect(opt)}
                      className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-xs text-gray-700"
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
              {/* Gray button removed */}
              <div className="bg-white shadow-xl md:w-36 px-2 py-2 rounded-lg">
                <div className="flex justify-between">
                  <p className="text-neutral-400 text-xs font-semibold">
                    0 miles
                  </p>
                  <p className="text-neutral-400 text-xs font-semibold">
                    10 miles
                  </p>
                </div>
                <div>
                  <div className="">
                    <input
                      type="range"
                      id="distance"
                      className="w-full accent-primary"
                      min="0"
                      max="10"
                      value={filter.distance}
                      onChange={handleRangeChange}
                    />
                    <span className="text-neutral-400 text-xs">
                      within <strong>{filter.distance} miles</strong>
                    </span>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          console.log(
                            "Distance apply clicked for range:",
                            filter.distance
                          );
                        }}
                        className="text-primary text-xs font-semibold hover:text-green-950 cursor-pointer active:text-green-800"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Size Filter */}
            <div className="flex flex-col gap-2 relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle("size")}
                className={`w-32 px-2 py-2 outline-2 outline-offset-[-1px] outline-primary bg-primary text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer `}
              >
                <p className="text-nowrap text-xs">{sizeButtonLabel}</p>
                <div className="flex my-auto items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-down-icon lucide-chevron-down"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>
              {openDropdown === "size" && (
                <div className="absolute top-full mt-1 w-40 bg-white shadow-xl rounded-lg z-20 border border-gray-200 py-1">
                  {sizeOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => handleSizeOptionSelect(opt)}
                      className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-xs text-gray-700"
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
              {/* Gray button removed */}
              <div className="bg-white shadow-xl md:w-36 px-2 py-2 rounded-lg">
                <div className="flex justify-between">
                  <p className="text-neutral-400 text-xs font-semibold">
                    0 sqm
                  </p>
                  <p className="text-neutral-400 text-xs font-semibold">
                    5,000 sqm
                  </p>
                </div>
                <div>
                  <div className="">
                    <input
                      type="range"
                      id="size"
                      className="w-full accent-primary"
                      min="0"
                      max="5000"
                      value={filter.size}
                      onChange={handleRangeChange}
                    />
                    <span className="text-neutral-400 text-xs">
                      Up to <strong>{filter.size} sqm</strong>
                    </span>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          console.log(
                            "Size apply clicked for range:",
                            filter.size
                          );
                        }}
                        className="text-primary text-xs font-semibold hover:text-green-950 cursor-pointer active:text-green-800"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex flex-col gap-2 relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle("type")}
                className={`w-32 px-2 py-2 outline-2 outline-offset-[-1px] outline-primary bg-primary text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer `}
              >
                <p className="text-nowrap text-xs">{typeButtonLabel}</p>
                <div className="flex my-auto items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-down-icon lucide-chevron-down"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>
              {openDropdown === "type" && (
                <div className="absolute top-full mt-1 w-40 bg-white shadow-xl rounded-lg z-20 border border-gray-200 py-1">
                  {typeOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => handleTypeOptionSelect(opt)}
                      className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-xs text-gray-700"
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
              {/* Gray button removed */}
              <div className="bg-white shadow-xl w-58 md:w-36 px-2 py-2 rounded-lg">
                <div>
                  <div className="">
                    {" "}
                    {/* Ensure className is used, was class previously */}
                    <div className="flex gap-1 font-semibold ">
                      <input
                        type="checkbox"
                        name="detachedHouse"
                        id="detachedHouse"
                        className="accent-primary"
                        checked={filter.type.detachedHouse}
                        onChange={() => handleCheckboxChange("detachedHouse")}
                      />
                      <label
                        htmlFor="detachedHouse"
                        className="text-sm text-neutral-400"
                      >
                        Detached House
                      </label>
                    </div>
                    <div className="flex gap-1 font-semibold">
                      <input
                        type="checkbox"
                        name="terracedHouse"
                        id="terracedHouse"
                        className="accent-primary"
                        checked={filter.type.terracedHouse}
                        onChange={() => handleCheckboxChange("terracedHouse")}
                      />
                      <label
                        htmlFor="terracedHouse"
                        className="text-sm text-neutral-400"
                      >
                        Terraced House
                      </label>
                    </div>
                    <div className="flex gap-1 font-semibold">
                      <input
                        type="checkbox"
                        name="parkHouse"
                        id="parkHouse"
                        className="accent-primary"
                        checked={filter.type.parkHouse}
                        onChange={() => handleCheckboxChange("parkHouse")}
                      />
                      <label
                        htmlFor="parkHouse"
                        className="text-sm text-neutral-400"
                      >
                        Park House
                      </label>
                    </div>
                    <div className="flex gap-1 font-semibold">
                      <input
                        type="checkbox"
                        name="flat"
                        id="flat"
                        className="accent-primary"
                        checked={filter.type.flat}
                        onChange={() => handleCheckboxChange("flat")}
                      />
                      <label
                        htmlFor="flat"
                        className="text-sm text-neutral-400"
                      >
                        Flat
                      </label>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          console.log(
                            "Type apply clicked. Current types:",
                            filter.type
                          );
                        }}
                        className="text-primary text-xs font-semibold hover:text-green-950 cursor-pointer active:text-green-800"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4">
            <ScatterPlot
              data={sampleData} // Ensure sampleData is correctly formatted for ScatterPlot
              highlightedPointId={"proj4"} // Example, adjust as needed
              yAxisLabel="Project Success"
              xAxisLabel="Frequency"
              // width="w-full" // ScatterPlot should handle its own width/height or accept props
              // height={256}  // ScatterPlot should handle its own width/height or accept props
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
