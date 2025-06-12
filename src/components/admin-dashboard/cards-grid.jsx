import React from "react";
import DetailCard from "./detail-card";

// summary prop: { users: { total, basic, pro }, sales: { total, basic, pro } }
const CardsGrid = ({ summary }) => {
  // Defensive: fallback to 0 if missing
  const users = summary?.users || {};
  const sales = summary?.sales || {};
  // Helper to round percentage to 1 decimal place
  const round = (val) =>
    typeof val === "number" && !isNaN(val) ? Math.round(val * 10) / 10 : 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 md:w-[50vw] gap-4  md:gap-14 place-items-center md:px-12 md:py-11">
      <DetailCard
        title="Total Users"
        value={users.total?.count ?? 0}
        percentage={round(users.total?.change)}
        userCard
      />
      <DetailCard
        title="Total Sales"
        value={sales.total?.amount ?? 0}
        percentage={round(sales.total?.change)}
        isDecreasing={sales.total?.change < 0}
      />
      <DetailCard
        title="Basic Users"
        value={users.basic?.count ?? 0}
        percentage={round(users.basic?.change)}
        userCard
      />
      <DetailCard
        title="Basic Sales"
        value={sales.basic?.amount ?? 0}
        percentage={round(sales.basic?.change)}
        isDecreasing={sales.basic?.change < 0}
      />
      <DetailCard
        title="Pro Users"
        value={users.pro?.count ?? 0}
        percentage={round(users.pro?.change)}
        userCard
      />
      <DetailCard
        title="Pro Sales"
        value={sales.pro?.amount ?? 0}
        percentage={round(sales.pro?.change)}
        isDecreasing={sales.pro?.change < 0}
      />
    </div>
  );
};

export default CardsGrid;
