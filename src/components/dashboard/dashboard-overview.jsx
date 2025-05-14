import React, { useState } from "react";
import SegmentedCircularGauge from "./SegmentedCircularGauge";
import ScatterPlot from "./scatter-plot";
import LineChartCard from "./line-chart";

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

            <div className="flex flex-col gap-5">
              <p className="text-neutral-400 text-sm font-semibold">
                {propertyOverview.address}
              </p>
              <p className="text-neutral-400 text-sm font-semibold">
                {propertyOverview.type}
              </p>
              <p className="text-neutral-400 text-sm font-semibold mt-5">
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
          <div className="flex flex-col items-center gap-4 md:flex-row justify-between w-full">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  //   setSelectedOptions("careers");
                }}
                className={`w-24 px-1 py-2  outline-2 outline-offset-[-1px] outline-primary bg-primary  text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer `}
              >
                <p className="text-nowrap text-xs">Distance </p>
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
              <button
                type="button"
                onClick={() => {
                  //   setSelectedOptions("careers");
                }}
                className={`w-24 px-1 py-2  outline-2 outline-offset-[-1px] bg-gray-400  text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer `}
              >
                <p className="text-nowrap text-xs">Distance </p>
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
                    {" "}
                    {/* Changed class to className */}
                    <input
                      type="range"
                      id="distance"
                      className="w-full accent-primary" /* Changed class to className */
                      min="0"
                      max="10"
                      value={filter.distance} /* Bind value to state */
                      onChange={handleRangeChange} /* Use new handler */
                    />
                    <span className="text-neutral-400 text-xs">
                      within <strong>{filter.distance}miles</strong>
                    </span>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          console.log("Distance apply clicked");
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
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  //   setSelectedOptions("careers");
                }}
                className={`w-24 px-1 py-2  outline-2 outline-offset-[-1px] outline-primary bg-primary  text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer `}
              >
                <p className="text-nowrap text-xs">Size </p>
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
              <button
                type="button"
                onClick={() => {
                  //   setSelectedOptions("careers");
                }}
                className={`w-24 px-1 py-2  outline-2 outline-offset-[-1px] bg-gray-400  text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer `}
              >
                <p className="text-nowrap text-xs">Size </p>
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
                    {" "}
                    {/* Changed class to className */}
                    <input
                      type="range"
                      id="size"
                      className="w-full accent-primary" /* Changed class to className */
                      min="0"
                      max="5000"
                      value={filter.size} /* Bind value to state */
                      onChange={handleRangeChange} /* Use new handler */
                    />
                    <span className="text-neutral-400 text-xs">
                      Up to <strong>{filter.size}sqm</strong>
                    </span>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          console.log("Distance apply clicked");
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
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  //   setSelectedOptions("careers");
                }}
                className={`w-24 px-1 py-2  outline-2 outline-offset-[-1px] outline-primary bg-primary  text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer `}
              >
                <p className="text-nowrap text-xs">Type </p>
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
              <button
                type="button"
                onClick={() => {
                  //   setSelectedOptions("careers");
                }}
                className={`w-24 px-1 py-2  outline-2 outline-offset-[-1px] bg-gray-400  text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer `}
              >
                <p className="text-nowrap text-xs">Type </p>
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
              <div className="bg-white shadow-xl md:w-36 px-2 py-2 rounded-lg">
                <div>
                  <div class="">
                    <div className="flex gap-1 font-semibold">
                      <input
                        type="checkbox"
                        name="detachedHouse"
                        id="detachedHouse"
                        className="accent-primary"
                        onChange={() => {
                          setFilter({
                            ...filter,
                            type: { ...filter.type, detachedHouse: true },
                          });
                        }}
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
                        onChange={() => {
                          setFilter({
                            ...filter,
                            type: { ...filter.type, terracedHouse: true },
                          });
                        }}
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
                        onChange={() => {
                          setFilter({
                            ...filter,
                            type: { ...filter.type, parkHouse: true },
                          });
                        }}
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
                        onChange={() => {
                          setFilter({
                            ...filter,
                            type: { ...filter.type, flat: true },
                          });
                        }}
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
                          console.log("Distance apply clicked");
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
              data={sampleData}
              highlightedPointId={"proj4"}
              yAxisLabel="Project Success"
              xAxisLabel="Frequency"
              // width="w-full"
              // height={256}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      {/* <h3 className="text-lg font-bold mb-4">Neighbourhood benchmarking</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {["Distance", "Size", "Type"].map((filter) => (
          <div key={filter}>
            <label className="block text-sm font-medium">{filter}</label>
            <select className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring focus:ring-green-500">
              <option>{filter}</option>
            </select>
          </div>
        ))}
      </div> */}

      {/* Scatter Plot */}
      {/* <h3 className="text-lg font-bold mb-4">Project Success</h3>
      <div className="relative h-48 bg-gray-100 rounded-lg">
        <svg
          viewBox="0 0 200 250"
          className="w-full h-full"
        >
          {scatterData.map((point, index) => (
            <circle
              key={index}
              cx={point.x * 10}
              cy={250 - point.y}
              r="2"
              fill="#6B46C1"
            />
          ))}
        </svg>
        <div className="absolute bottom-2 left-2 text-xs">Frequency</div>
        <div className="absolute top-2 left-2 text-xs">Project Success</div>
      </div> */}
    </div>
  );
};

export default DashboardCard;
