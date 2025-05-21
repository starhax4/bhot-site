import React from "react";
import ButtonCTA from "../button";

const Hero = ({ onCtaClick }) => {
  return (
    <main className="mx-auto my-12 md:my-18 px-4 md:px-14">
      <div className="flex flex-col">
        <div className="flex flex-col-reverse gap-4 md:flex-row justify-between">
          <div className="md:w-[50%] flex flex-col gap-6 justify-between">
            <h1 className="text-black text-3xl md:text-4xl font-normal md:pr-32">
              Unlock the value hiding in your home.
            </h1>
            <p className="font-normal">
              At Best House on the Street, we give you everything you need to
              understand your home’s energy performance.
              <br />
              <br /> See how your property compares to others in your
              neighbourhood, and discover which energy-saving improvements could
              work best for you, all from just your house address.
              <br />
              <br /> We combine trusted public data with our own proprietary
              insights to show the potential value increase of making
              recommended energy upgrades, personalised for your home, in your
              local area.
            </p>
            <div className="flex justify-center">
              <ButtonCTA
                label="Check my Home"
                onClickHandler={() => {
                  onCtaClick("cta");
                }}
              />
            </div>
          </div>
          <div>
            <img
              src="/Landing Page Image 1.png"
              alt="house_image"
              className="md:min-h-full"
            />
          </div>
        </div>
        <div></div>
      </div>
    </main>
  );
};

export default Hero;
