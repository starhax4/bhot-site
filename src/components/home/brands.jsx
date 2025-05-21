import React from "react";

const Brands = () => {
  return (
    <div className="mx-auto my-14 flex flex-col gap-4">
      <div>
        <h2 className="text-black  font-normal text-xl text-center mx-auto px-2">
          Data sources from the following resources:
        </h2>
      </div>
      <div className="mx-auto flex flex-col md:flex-row md:justify-evenly items-baseline md:items-center gap-6 md:gap-36">
        <div>
          <img
            src="/HMLR.png"
            alt="HM_land_registry_logo"
          />
        </div>

        <div>
          <img
            src="/dluhc.png"
            alt="dluhc_logo"
          />
        </div>
      </div>
      <div>
        <p className="text-center text-neutral-400 text-sm font-normal">
          All brand names and logos are the property of their respective owners.
          This site is not affiliated with, endorsed by, or sponsored by any
          mentioned brands.
        </p>
      </div>
    </div>
  );
};

export default Brands;
