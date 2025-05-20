import React, { useState, useRef, useEffect, useCallback } from "react";

export default function DualRangeSlider({
  min: minBound, // Overall minimum possible value for the slider
  max: maxBound, // Overall maximum possible value for theslider
  step, // Step increment
  initialMin, // Initial minimum value of the selected range
  initialMax, // Initial maximum value of the selected range
  onChange, // Callback function when the range changes, receives { min, max }
  units = "sqm", // Units to display next to the values
}) {
  const [minVal, setMinVal] = useState(initialMin);
  const [maxVal, setMaxVal] = useState(initialMax);

  const rangeRef = useRef(null); // Ref for the visual filled part of the track

  // Refs to store the current values, used to prevent thumbs from crossing
  // These are updated when minVal/maxVal change, and read in input handlers.
  const currentMinValRef = useRef(minVal);
  const currentMaxValRef = useRef(maxVal);

  useEffect(() => {
    currentMinValRef.current = minVal;
  }, [minVal]);

  useEffect(() => {
    currentMaxValRef.current = maxVal;
  }, [maxVal]);

  // Update internal state if the initialMin or initialMax props change,
  // but only if the prop value is different from the current state value.
  useEffect(() => {
    if (initialMin !== minVal) {
      setMinVal(initialMin);
    }
    // It's important that minVal is in the dependency array if we read it in the condition.
    // Same for maxVal below.
  }, [initialMin, minVal]);

  useEffect(() => {
    if (initialMax !== maxVal) {
      setMaxVal(initialMax);
    }
  }, [initialMax, maxVal]);

  // Function to calculate the percentage position of a value on the track
  const getPercent = useCallback(
    (value) => Math.round(((value - minBound) / (maxBound - minBound)) * 100),
    [minBound, maxBound]
  );

  // Effect to update the visual style of the filled range track
  useEffect(() => {
    if (rangeRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxVal);
      rangeRef.current.style.left = `${minPercent}%`;
      // Ensure width is not negative if minVal somehow exceeds maxVal
      rangeRef.current.style.width = `${Math.max(0, maxPercent - minPercent)}%`;
    }
  }, [minVal, maxVal, getPercent]);

  // Effect to call the parent's onChange callback when minVal or maxVal changes
  useEffect(() => {
    if (onChange) {
      onChange({ min: minVal, max: maxVal });
    }
  }, [minVal, maxVal, onChange]);

  // Handler for the minimum value range input
  const handleMinInputChange = (e) => {
    // Ensure the new min value doesn't exceed the max value (minus step)
    const newMin = Math.min(
      Number(e.target.value),
      currentMaxValRef.current - step
    );
    setMinVal(newMin);
  };

  // Handler for the maximum value range input
  const handleMaxInputChange = (e) => {
    // Ensure the new max value doesn't go below the min value (plus step)
    const newMax = Math.max(
      Number(e.target.value),
      currentMinValRef.current + step
    );
    setMaxVal(newMax);
  };

  return (
    <div className="w-full">
      {/* Container for the inputs and the visual track. Height accommodates thumbs. */}
      <div className="relative h-8 flex items-center">
        {/* Min Value Input: Positioned absolutely, transparent track, custom thumb */}
        <input
          type="range"
          min={minBound}
          max={maxBound}
          step={step}
          value={minVal}
          onChange={handleMinInputChange}
          className="absolute w-full appearance-none bg-transparent focus:outline-none z-[3] h-1
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:appearance-none
                     [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4
                     [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary
                     [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
          // Adjust z-index to bring thumb to front if it's near the max end or values overlap
          style={{ zIndex: minVal > maxBound - step * 2 ? 5 : 3 }}
        />
        {/* Max Value Input: Similar styling to min input */}
        <input
          type="range"
          min={minBound}
          max={maxBound}
          step={step}
          value={maxVal}
          onChange={handleMaxInputChange}
          className="absolute w-full appearance-none bg-transparent focus:outline-none z-[4] h-1
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:appearance-none
                     [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4
                     [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary
                     [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
        />
        {/* Visual Track Elements */}
        <div className="relative w-full h-1">
          {" "}
          {/* Container for track parts */}
          <div className="absolute top-0 left-0 h-1 w-full bg-gray-200 rounded"></div>{" "}
          {/* Base track */}
          <div
            ref={rangeRef}
            className="absolute top-0 h-1 bg-primary rounded"
          ></div>{" "}
          {/* Filled portion of track */}
        </div>
      </div>
      {/* Display of the current min and max values */}
      <div className="flex justify-between mt-2 text-xs text-neutral-500">
        <span>
          {minVal} {units}
        </span>
        <span>
          {maxVal} {units}
        </span>
      </div>
    </div>
  );
}
