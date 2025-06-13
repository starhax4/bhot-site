import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const NotFoundPage = () => {
  return (
    <>
      <Navbar />
      <div
        className=" flex flex-col w-full"
        style={{ minHeight: "calc(100vh - 152px)" }} // 64px is a common navbar height; adjust as needed
      >
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-lg w-full">
            <h1 className="text-6xl font-extrabold text-primary mb-4 drop-shadow">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Page Not Found
            </h2>
            <p className="text-gray-500 mb-8 text-lg">
              Sorry, the page you are looking for does not exist or has been
              moved.
              <br />
              Please check the URL or return to the homepage.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-green-950 transition font-semibold text-lg"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFoundPage;
