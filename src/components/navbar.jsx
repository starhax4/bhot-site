import { useState } from "react";
import { Link } from "react-router";
import AddressManager from "./address-manager"; // Importing AddressManager component
import { useAuth } from "../context/auth/AuthContext";
import UserIcon from "./user-icon";

export default function Navbar({ onNavClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

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
              {isAuthenticated ? (
                <Link to="/dashboard">Dashboard</Link>
              ) : (
                <button
                  onClick={() => {
                    onNavClick("login");
                  }}
                  className="cursor-pointer"
                >
                  Dashboard
                </button>
              )}
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
                Contact
              </button>
            </li>
            <button
              onClick={() => {
                if (isAuthenticated) {
                  onNavClick("account");
                } else {
                  onNavClick("login");
                }
              }}
              className="cursor-pointer"
            >
              <div className="flex justify-center items-center size-10 rounded-full outline-[3px] outline-primary shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer">
                {isAuthenticated && !!useAuth().user ? (
                  (() => {
                    const user = useAuth().user;
                    let initials = "";
                    if (user.firstName && user.lastName) {
                      initials =
                        `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
                    } else if (user.name) {
                      const nameParts = user.name.trim().split(" ");
                      if (nameParts.length === 1) {
                        initials = nameParts[0].slice(0, 2).toUpperCase();
                      } else {
                        initials = `${nameParts[0][0]}${
                          nameParts[nameParts.length - 1][0]
                        }`.toUpperCase();
                      }
                    }
                    return initials ? (
                      <span>{initials}</span>
                    ) : (
                      <UserIcon size={24} />
                    );
                  })()
                ) : (
                  <UserIcon size={24} />
                )}
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
                    {isAuthenticated ? (
                      <Link to="/dashboard">Dashboard</Link>
                    ) : (
                      <button
                        onClick={() => {
                          onNavClick("login");
                        }}
                        className="cursor-pointer"
                      >
                        Dashboard
                      </button>
                    )}
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
                      Contact
                    </button>
                  </li>
                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        onNavClick("account");
                      } else {
                        onNavClick("login");
                      }
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
      {/* Address Manager for Pro users, potentially shown near account details or in a dropdown */}
      {/* <AddressManager /> */}
    </nav>
  );
}
