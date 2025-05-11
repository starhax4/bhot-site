import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bottom-0 mx-auto px-12 md:h-12 border-t-[0.5px] border-t-gray-200 md:py-3 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] outline outline-offset-[-0.50px] outline-gray-200 z-50">
      <div className="flex flex-col-reverse text-center md:flex-row justify-around items-center ">
        <p className="text-neutral-400 text-base font-normal">
          © 2025 Best House on the Street Limited. All Rights Reserved
        </p>
        <Link to="/privacy-policy">
          <p className="text-neutral-400 text-base font-normal hover:text-primary">
            Privacy Policy
          </p>
        </Link>
        <Link to="/terms">
          <p className="text-neutral-400 text-base font-normal hover:text-primary">
            Terms and Conditions
          </p>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
