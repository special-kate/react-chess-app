import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

function Landing() {
  const [imageHeight, setImageHeight] = useState(0);
  const imageRef = useRef(null);

  useEffect(() => {
    const divHeight = document.querySelector(".landing").offsetHeight;
    setImageHeight(divHeight);
  }, []);

  return (
    <div
      className="landing grid bg-cover grid-cols-12 px-20"
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
          className="m-2 py-5 border flex items-center justify-center border-gray-700 rounded-lg flex-1 bg-white shadow-md"
        >
          Play Online
        </Link>
        <Link
          onClick={() => (window.location.href = "/bot")}
          className="m-2 py-5 border flex items-center justify-center border-gray-700 rounded-lg flex-1 bg-white shadow-md"
        >
          Challenge AI
        </Link>
        <Link className="m-2 py-5 border flex items-center justify-center border-gray-700 rounded-lg flex-1 bg-white  shadow-md">
          Tournaments
        </Link>
        <Link className="m-2 py-5 border flex items-center justify-center border-gray-700 rounded-lg flex-1 bg-white shadow-md">
          Chess Ranking
        </Link>
      </div>
    </div>
  );
}

export default Landing;
