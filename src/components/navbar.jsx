import { useState } from "react";
import { Link } from "react-router";

export default function Navbar({ onNavClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuCLick = () => {
    setIsMenuOpen((prev) => !prev);
  };
  return (
    <nav className="sticky top-0 mx-auto px-4 py-2 md:px-12 md:h-26  border-b-[0.5px] bg-white border-b-gray-200 shadow-md z-[500]">
      <div className="flex justify-between items-center md:items-end  ">
        <div>
          <Link to="/">
            <img
              className="w-44 md:w-54"
              src="/BHOTS Logo+Tag 1.png"
              alt="BHOTS_logo"
            />
          </Link>
        </div>
        <div>
          <ul className="hidden md:flex justify-between items-center gap-16 list-none text-base font-bold text-primary hover:text-green-950">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/pricing">Pricing</Link>
            </li>
            <li>
              <button
                onClick={() => {
                  onNavClick("contact");
                }}
                className="cursor-pointer"
              >
                Contacts
              </button>
            </li>
            <button
              onClick={() => {
                onNavClick("account");
              }}
              className="cursor-pointer"
            >
              <div className="flex justify-center items-center size-10 rounded-full outline-[3px] outline-primary shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer">
                <span>GM</span>
              </div>
            </button>
          </ul>
          <div className="flex md:hidden">
            <button onClick={handleMenuCLick}>
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x-icon lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-menu-icon lucide-menu"
                >
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                  <path d="M4 6h16" />
                </svg>
              )}
            </button>
            {isMenuOpen && (
              <div className="absolute flex mx-auto bg-white shadow-md top-22 right-2 w-[90vw] z-[1000]">
                <ul className="flex flex-col justify-between gap-4 my-2 mx-4 text-start list-none text-base font-bold text-primary hover:text-green-950">
                  <li className="">
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/pricing">Pricing</Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavClick("contact");
                      }}
                      className="cursor-pointer"
                    >
                      Contacts
                    </button>
                  </li>
                  <button
                    onClick={() => {
                      onNavClick("account");
                    }}
                    className="cursor-pointer"
                  >
                    My Account
                  </button>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
