import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

function Landing({ darkMode }) {
  const [imageHeight, setImageHeight] = useState(0);
  const imageRef = useRef(null);

  useEffect(() => {
    const divHeight = document.querySelector(".landing").offsetHeight;
    setImageHeight(divHeight);
  }, []);

  return (
    <div
      className={`landing grid bg-cover grid-cols-12 px-20 ${
        darkMode ? "text-white" : "text-black"
      }`}
      style={{
        height: "87vh",
      }}
    >
      <div className="sm:hidden xl:flex md:justify-center md:items-center md:col-span-6">
        <img
          ref={imageRef}
          src="bg_chesspanel.png"
          alt="chesspanel"
          className="landingImage rounded-lg p-9 ml-10"
          style={{ height: imageHeight, objectFit: "cover" }}
        />
      </div>
      <div className="flex flex-col col-span-12 justify-center p-10 mr-5 md:col-span-6">
        <Link
          to="/multiplayer"
          className={`${
            darkMode
              ? "shadow-blue-500 bg-black text-white border-gray-700"
              : "border-gray-700 bg-white text-black"
          } m-2 py-5 border flex items-center justify-center rounded-lg flex-1 shadow-md`}
        >
          Play Online
        </Link>
        <Link
          onClick={() => (window.location.href = "/bot")}
          className={`${
            darkMode
              ? "shadow-blue-500 bg-black text-white border-gray-700"
              : "border-gray-700 bg-white text-black"
          } m-2 py-5 border flex items-center justify-center rounded-lg flex-1 shadow-md`}
        >
          Challenge AI
        </Link>
        <Link
          className={`${
            darkMode
              ? "shadow-blue-500 bg-black text-white border-gray-700"
              : "border-gray-700 bg-white text-black"
          } m-2 py-5 border flex items-center justify-center rounded-lg flex-1 shadow-md`}
        >
          Tournaments
        </Link>
        <Link
          className={`${
            darkMode
              ? "shadow-blue-500 bg-black text-white border-gray-700"
              : "border-gray-700 bg-white text-black"
          } m-2 py-5 border flex items-center justify-center rounded-lg flex-1 shadow-md`}
        >
          Chess Ranking
        </Link>
      </div>
    </div>
  );
}

export default Landing;
