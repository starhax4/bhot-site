import React from "react";
import DetailCard from "./detail-card";

const CardsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:w-[50vw] gap-14 place-items-center md:px-12 md:py-11">
      <DetailCard
        title="Total Users"
        value={40689}
        percentage={8.5}
        userCard
      />
      <DetailCard
        title="Total Sales"
        value={89000}
        percentage={4.3}
        isDecreasing
      />
      <DetailCard
        title="Basic Users"
        value={40689}
        percentage={8.5}
        userCard
      />
      <DetailCard
        title="Basic Sales"
        value={89000}
        percentage={4.3}
        isDecreasing
      />

      <DetailCard
        title="Pro Sales"
        value={89000}
        percentage={4.3}
        userCard
      />
      <DetailCard
        title="Pro Sales"
        value={89000}
        percentage={4.3}
        isDecreasing
      />
    </div>
  );
};

export default CardsGrid;
