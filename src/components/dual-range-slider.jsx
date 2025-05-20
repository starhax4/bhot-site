import React, { useCallback } from "react";
import "./styles/slider.css";
import MultiRangeSlider from "multi-range-slider-react";

const DualRangeSlider = ({
  min = 0,
  max = 5000,
  step = 10,
  minValue,
  maxValue,
  formatLabel,
  onChange,
}) => {
  const handleInput = useCallback(
    ({ minValue, maxValue }) => {
      if (onChange) {
        onChange([minValue, maxValue]);
      }
    },
    [onChange]
  );

  return (
    <div className="dual-range-slider">
      <MultiRangeSlider
        min={min}
        max={max}
        step={step}
        minValue={minValue}
        maxValue={maxValue}
        onInput={handleInput}
        label={false}
        ruler={false}
        barInnerColor="rgb(0, 80, 0)" // Primary color from your theme
        barLeftColor="rgb(229, 231, 235)" // Light gray
        barRightColor="rgb(229, 231, 235)" // Light gray
        thumbLeftColor="rgb(0, 80, 0)"
        thumbRightColor="rgb(0, 80, 0)"
      />
      <div className="flex justify-between mt-2">
        <p className="text-neutral-400 text-xs font-semibold">
          {formatLabel ? formatLabel(minValue) : minValue}
        </p>
        <p className="text-neutral-400 text-xs font-semibold">
          {formatLabel ? formatLabel(maxValue) : maxValue}
        </p>
      </div>
    </div>
  );
};

export default DualRangeSlider;
